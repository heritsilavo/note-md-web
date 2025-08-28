"use client"
import React, { useState } from "react";
import { FiSave, FiTag, FiCalendar, FiPaperclip, FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import CategoriesSelector from "@/components/NoteEditor/CategoriesSelector";
import BaliseSelector from "@/components/NoteEditor/BaliseSelector";
import RappelEditor from "@/components/NoteEditor/RappelEditor";
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import { NoteDto } from "@/database/note-dto";
import { generateRandomId } from "@/utils/generate-new-id";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-toastify";
import { fetchApi } from "@/utils/fetch-api";

const DEFAULT_NOTE_MARKDOWN = `# Bienvenue dans votre éditeur Markdown !

## Fonctionnalités principales
- **Édition Markdown** avec aperçu en temps réel
- **Gestion des catégories et balises**
- **Ajout de rappels et pièces jointes**

## Exemple de code

\`\`\`js
function helloWorld() {
  console.log('Hello, world!');
}
\`\`\`

> Ceci est un bloc de citation.

- [ ] Tâche à faire
- [x] Tâche terminée
`;

function NoteEditorPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "new_note";

  //STATES
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [balises, setBalises] = useState<string[]>([]);
  const [rappel, setRappel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Note content and metadata
  const [note, setNote] = useState(DEFAULT_NOTE_MARKDOWN);
  const [editMode, setEditMode] = useState(true);
  const [title, setTitle] = useState("Titre du note");

  const handleSave = async () => {
    setIsLoading(true);
    const newNote: NoteDto = {
      nom_note: title,
      contenu_note: note,
      categorie: categories,
      balises: balises,
      date_heure_note: "",
      date_creation: new Date().toISOString(),
      id: "",
      status: "created",
      supabase_id: generateRandomId(),
      synced: true,
      typenote: "markdown",
      user_id: "user-123",
      visible_pour_date_seulement: false,
      date_sync: new Date().toISOString(),
      rappel: rappel || undefined,
    };

    await fetchApi(`/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });
    
    setIsLoading(false);
    console.log("Saving note:", newNote);
    router.push("/");
    toast.success("Note enregistrée avec succès !");
  }

  const handleClickSave = () => {
    if (action === "new_note") {
      handleSave();
    }
    
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-2 flex flex-col gap-10">
      {isLoading && <LoadingSpinner text="Enregistrement en cours..." />}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="w-full flex flex-col items-center">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="text-3xl font-bold text-center w-full max-w-2xl text-blue-900 bg-transparent outline-none  px-2 py-1"
                spellCheck={true}
                placeholder="Titre de la note..."
              />
            </div>
            <button
              className="bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow hover:bg-blue-800 transition duration-200"
              title="Enregistrer la note"
              onClick={handleClickSave}
              disabled={isLoading}
            >
              <FiSave /> Enregistrer
            </button>
          </div>

          {/* Catégories, Balises, Rappel */}
          <div className="rounded-2xl p-8 flex flex-col md:flex-row gap-8 justify-between">
            <CategoriesSelector categories={categories} setCategories={setCategories} />
            <BaliseSelector balises={balises} setBalises={setBalises} />
            <RappelEditor rappel={rappel} setRappel={setRappel} />
          </div>

          {/* Editeur Markdown */}
          <div className="rounded-2xl p-8 mt-4 transition-all duration-300">
            <NoteEditor contenu={note} setContenu={setNote} defaultPreview={true} />
          </div>
        </>
      )}
    </div>
  );
}

export default NoteEditorPage;

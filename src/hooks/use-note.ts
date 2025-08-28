"use client"

import { NoteDto } from "@/database/note-dto";
import { generateRandomId } from "@/utils/generate-new-id";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

export default function useNote() {
    const router = useRouter();

    const [categories, setCategories] = useState<string[]>(["All"]);
    const [balises, setBalises] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [rappel, setRappel] = useState<string | null>(null);
    const [note, setNote] = useState(DEFAULT_NOTE_MARKDOWN);
    const [title, setTitle] = useState("Titre du note");

    const handleSave = async () => {
        setIsLoading(true);
        const newNote: NoteDto = {
            nom_note: title,
            contenu_note: note,
            categorie: categories,
            balises: balises,
            date_heure_note: rappel || "",
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

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newNote),
            });

            console.log("NOTE SAVED", response);
            router.push("/");
        } catch (error: Error | unknown) {
            const message = error instanceof Error ? error.message : String(error);
            
            console.error("Error saving note:", message);
        } finally {
            setIsLoading(false);
        }
    }

    return {
        categories,
        setCategories,
        balises,
        setBalises,
        rappel,
        setRappel,
        isLoading,
        setIsLoading,
        note,
        setNote,
        title,
        setTitle,
        handleSave
    };
}
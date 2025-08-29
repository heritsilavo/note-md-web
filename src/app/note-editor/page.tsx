"use client"
import { FiSave } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import CategoriesSelector from "@/components/NoteEditor/CategoriesSelector";
import BaliseSelector from "@/components/NoteEditor/BaliseSelector";
import RappelEditor from "@/components/NoteEditor/RappelEditor";
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import LoadingSpinner from "@/components/LoadingSpinner";
import useNote from "@/hooks/use-note";
import { useEffect, useState } from "react";

export type TypeAction = "new_note" | "edit_note";

function NoteEditorPage() {

  const searchParams = useSearchParams();
  const action: TypeAction = searchParams.get("action") as TypeAction || "new_note";
  const noteSupabaseId = searchParams.get("id") || null;

  const {
    categories,
    setCategories,
    balises,
    setBalises,
    isLoading,
    rappel,
    setRappel,
    note,
    setNote,
    title,
    setTitle,
    handleSave,
    handleConfirmModif,
  } = useNote({action, noteSupabaseId});

  const handleClickSave = () => {
    if (action === "new_note") {
      handleSave();
    } else if (action === "edit_note" && noteSupabaseId) {
      handleConfirmModif();
    }
  }

  if (action === "edit_note" && !noteSupabaseId) {
    return <div className="max-w-7xl mx-auto py-10 px-2 flex flex-col gap-10">
      <div className="text-red-600 font-semibold text-center">Erreur : Aucun ID de note fourni pour l'édition.</div>
    </div>
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-2 flex flex-col gap-10">
      {(isLoading) && <LoadingSpinner />}
      
      {!(isLoading) && (
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
              className="cursor-pointer bg-blue-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow hover:bg-blue-800 transition duration-200"
              title={action === "new_note" ? "Creer la note" : "Modifier la note"}
              onClick={handleClickSave}
              disabled={isLoading}
            >
              <FiSave /> {action === "new_note" ? "Creer" : "Modifier"}
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

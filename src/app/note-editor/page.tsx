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
import useNote from "@/hooks/use-note";

function NoteEditorPage() {

  const searchParams = useSearchParams();
  const action = searchParams.get("action") || "new_note";

  //STATES
  const {
      categories,
      setCategories,
      balises,
      setBalises,
      rappel,
      setRappel,
      isLoading,
      setIsLoading,
      handleSave,
      note,
      setNote,
      title,
      setTitle
  } = useNote();

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
                className="text-3xl font-bold text-center w-full max-w-2xl text-blue-900 drop-shadow bg-transparent outline-none border-b-2 border-blue-200 focus:border-blue-500 transition px-2 py-1 duration-200"
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
          <div className="rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 justify-between border border-gray-100">
            <CategoriesSelector categories={categories} setCategories={setCategories} />
            <BaliseSelector balises={balises} setBalises={setBalises} />
            <RappelEditor rappel={rappel} setRappel={setRappel} />
          </div>

          {/* Editeur Markdown */}
          <div className="rounded-2xl shadow-lg p-8 border border-gray-100 mt-4 transition-all duration-300">
            <NoteEditor contenu={note} setContenu={setNote} defaultPreview={true} />
          </div>
        </>
      )}
    </div>
  );
}

export default NoteEditorPage;

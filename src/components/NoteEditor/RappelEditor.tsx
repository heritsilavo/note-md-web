"use client";
import React from "react";
import { FiCalendar, FiX } from "react-icons/fi";

type RappelEditorProps = {
    rappel: string | null;
    setRappel: (date: string | null) => void;
};

export default function RappelEditor({ rappel, setRappel }: RappelEditorProps) {
    return (
        <div className="flex-1 flex flex-col gap-2 rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                <FiCalendar /> Rappel
            </div>
            <div className="flex gap-2 items-center">
                <input
                    type="datetime-local"
                    className="px-2 py-1 rounded-lg border border-gray-300 text-sm flex-1 focus:border-blue-400 outline-none transition"
                    value={rappel ?? ""}
                    onChange={e => setRappel(e.target.value || null)}
                />
                {rappel && (
                    <button
                        className="p-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                        type="button"
                        title="Supprimer le rappel"
                        onClick={() => setRappel(null)}
                    >
                        <FiX />
                    </button>
                )}
            </div>
        </div>
    );
}

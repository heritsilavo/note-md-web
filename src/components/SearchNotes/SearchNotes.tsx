"use client"
import { NoteDto } from "@/database/note-dto";
import { fetchApi } from "@/utils/fetch-api";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { DebounceInput } from "react-debounce-input";

export default function SearchNotes() {
    const router = useRouter()
    const [noteResults, setNoteResults] = useState<NoteDto[]>([]);
    const [hasFocus, setHasFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const updateNoteSearch = async (query: string) => {
        if (!query.trim()) {
            setNoteResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchApi("/api/notes/search/" + encodeURIComponent(query));
            const data = await response.json();
            setNoteResults(data);
        } catch (error) {
            console.error("Search error:", error);
            setNoteResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <DebounceInput
                    className="px-3 py-1.5 rounded-md border bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-full pr-10"
                    minLength={1}
                    debounceTimeout={300}
                    onChange={(e) => updateNoteSearch(e.target.value)}
                    placeholder="Rechercher un titre ..."
                    onBlurCapture={() => setHasFocus(false)}
                    onFocus={() => setHasFocus(true)}
                />
                {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
            </div>

            {(noteResults.length > 0 || isLoading) && hasFocus && (
                <div className="absolute z-10 bg-white top-11 left-0 right-0 p-3 shadow-lg rounded-md border border-gray-200">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                            <span className="ml-2 text-sm text-gray-500">Recherche...</span>
                        </div>
                    ) : (
                        noteResults.map((note, index) => (
                            <div 
                                onClick={() => router.push("/note-preview/" + note.supabase_id)} 
                                key={note.id || index} 
                                className="border-b border-gray-200 last:border-b-0 cursor-pointer"
                            >
                                <button
                                    type="button"
                                    className="cursor-pointer w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <div className="flex items-center">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {note.nom_note || "Sans titre"}
                                            </p>
                                            {note.contenu_note && (
                                                <p className="text-xs text-gray-600 truncate mt-1">
                                                    {note.contenu_note}
                                                </p>
                                            )}
                                        </div>
                                        {note.date_heure_note && (
                                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                {new Date(note.date_heure_note).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
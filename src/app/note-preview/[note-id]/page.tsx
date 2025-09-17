"use client";
import { NoteDto } from "@/database/note-dto";
import { fetchApi } from "@/utils/fetch-api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'katex/dist/katex.min.css';
import '@toast-ui/editor/toastui-editor.css'
import { useDeleteNote } from "@/hooks/use-delete-note";
import LoadingIcon from "@/components/LoadingSpinner";
import { decrypt } from "@/utils/crypto-js";

const ToastViewer = dynamic(() => import("@toast-ui/react-editor").then(mod => mod.Viewer), {
    ssr: false,
    loading: () => <p className="text-gray-500">Chargement du contenu...</p>
});

type ActionType = "note_historique" | null;

export default function Page() {
    const router = useRouter();

    const searchParams = useSearchParams();
    const action:ActionType  = searchParams.get("action") as ActionType || null;
    const noteHistData: NoteDto | null = JSON.parse(searchParams.get("note_data") || "null");
 
    const noteId = useParams()["note-id"] as string | undefined;

    const [isLoading, setIsLoading] = useState(false);
    const [noteData, setNoteData] = useState<NoteDto | undefined>(noteHistData || undefined);
    const [error, setError] = useState<string | null>(null);
    const [parentNotes, setParentNotes] = useState<NoteDto[]>([]);
    const [childNotes, setChildNotes] = useState<NoteDto[]>([]);
    const [copySuccess, setCopySuccess] = useState(false);

    const {
        openModal,
        loadingDelete
    } = useDeleteNote({ noteId: noteId || "" });

    const getNoteData = async () => {
        setIsLoading(true);
        try {
            const res = await fetchApi(`/api/notes/${noteId}`);
            if (!res.ok) {
                throw new Error(`Erreur HTTP: ${res.status}`);
            }

            const data = await res.json();
            if (data.error) {
                console.log("Error fetching note data:", JSON.stringify(data.error));
                setError(JSON.stringify(data.error));
                return;
            }
            setError(null);
            setNoteData(data);
            
            // Charger les relations parent-enfant
            await loadRelations(data);
        } catch (error) {
            console.error("Failed to fetch note data:", error);
            setError("Impossible de charger la note");
        } finally {
            setIsLoading(false);
        }
    }

    const loadRelations = async (note: NoteDto) => {
        try {
            // Charger les notes parents
            if (note.parents && note.parents.length > 0) {
                const parentPromises = note.parents.map(parentId => 
                    fetchApi(`/api/notes/${parentId}`).then(res => res.json())
                );
                const parents = await Promise.all(parentPromises);
                setParentNotes(parents.filter(p => p && !p.error));
            }

            // Charger les notes enfants
            if (note.enfants && note.enfants.length > 0) {
                const childPromises = note.enfants.map(childId => 
                    fetchApi(`/api/notes/${childId}`).then(res => res.json())
                );
                const children = await Promise.all(childPromises);
                setChildNotes(children.filter(c => c && !c.error));
            }
        } catch (error) {
            console.error("Failed to load relations:", error);
        }
    };

    const copyToClipboard = async () => {
        if (!noteData?.contenu_note) return;
        
        try {
            await navigator.clipboard.writeText(noteData.contenu_note);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error("Failed to copy content:", error);
        }
    };

    useEffect(() => {
        if ( action != "note_historique" && !!noteId) {
            getNoteData();
        } else if (noteHistData) {
            loadRelations(noteHistData);
        }
    }, [noteId, action]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'd MMMM yyyy à HH:mm', { locale: fr });
        } catch {
            return dateString;
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
                    <p className="text-gray-700">{error}</p>
                    <button
                        onClick={() => getNoteData()}
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    if (!noteId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-700">Note ID manquant</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingIcon />;
    }

    if (!noteData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-700">Note non trouvée</p>
                </div>
            </div>
        );
    }

    if (loadingDelete) {
            return <LoadingIcon />;
    }

    return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Contenu principal */}
                        <div className="lg:col-span-3">
                            <div className="bg-white shadow-sm rounded-lg">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {noteData.nom_note}
                                    </h1>
                                    {
                                        (action != "note_historique") && (
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={copyToClipboard}
                                                    className={`cursor-pointer px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                                        copySuccess 
                                                            ? 'bg-green-600 text-white' 
                                                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                                                    }`}
                                                >
                                                    {copySuccess ? 'Copié !' : 'Copier'}
                                                </button>
                                                <button 
                                                    onClick={() => router.push(`/note-editor?action=new_note&parent=${noteData.supabase_id}`)}
                                                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                                >
                                                    Ajouter note enfant
                                                </button>
                                                <button 
                                                    onClick={() => router.push(`/note-editor/?action=edit_note&id=${noteId}`)} 
                                                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                                >
                                                    Modifier
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>

                                <div className="px-6 py-6">
                                    <div className="toastui-viewer">
                                        {typeof window !== 'undefined' && (
                                            <ToastViewer
                                                initialValue={noteData.contenu_note || ''}
                                                plugins={[]}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Relations Parent-Enfant */}
                            {(parentNotes.length > 0 || childNotes.length > 0) && (
                                <div className="bg-white shadow-sm rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Relations</h3>
                                    
                                    {/* Notes parents */}
                                    {parentNotes.length > 0 && (
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Notes parentes :</h4>
                                            <div className="space-y-2">
                                                {parentNotes.map((parent) => (
                                                    <button
                                                        key={parent.supabase_id}
                                                        onClick={() => router.push(`/note-preview/${parent.supabase_id}`)}
                                                        className="cursor-pointer block w-full text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                                                    >
                                                        ↑ {parent.nom_note}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Notes enfants */}
                                    {childNotes.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 mb-2">Notes enfants :</h4>
                                            <div className="space-y-2">
                                                {childNotes.map((child) => (
                                                    <button
                                                        key={child.supabase_id}
                                                        onClick={() => router.push(`/note-preview/${child.supabase_id}`)}
                                                        className="cursor-pointer block w-full text-left p-2 text-sm bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors"
                                                    >
                                                        ↓ {child.nom_note}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Catégories */}
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {noteData.categorie?.map((cat, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Propriétés de la Note */}
                            <div className="bg-white shadow-sm rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétés de la Note</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Date de Création
                                        </label>
                                        <p className="text-sm text-gray-900">
                                            {formatDate(noteData.date_creation)}
                                        </p>
                                    </div>

                                    {
                                        noteData.date_sync && <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Synchronisé le
                                            </label>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(noteData.date_sync)}
                                            </p>
                                        </div>
                                    }

                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Statut
                                        </label>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white bg-blue-500`}>
                                            {noteData.status}
                                        </span>
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-2">
                                            Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {noteData.balises?.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Rappel */}
                                    {noteData.rappel && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">
                                                Rappel
                                            </label>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(noteData.rappel)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {
                                (action != "note_historique")
                                    && <button onClick={openModal} className="cursor-pointer w-full rounded py-1 text-red-500 border-1 border-red-500 hover:bg-red-100 shadow font-bold">
                                        Supprimer la note
                                    </button>
                            }
                        
                        </div>
                    </div>
                </div>

            </div>
    );
}
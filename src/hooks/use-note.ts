"use client"

import { DEFAULT_NOTE_MARKDOWN } from "@/constants/default-note-markdown";
import { addParentEnfantRelation } from "@/database/database-service-notes";
import { NoteDto } from "@/database/note-dto";
import { decrypt } from "@/utils/crypto-js";
import { fetchApi } from "@/utils/fetch-api";
import { generateRandomId } from "@/utils/generate-new-id";
import { CustomError } from "@heritsilavo/react-error-boundary/next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UseNoteProps = {
    action: "new_note" | "edit_note";
    noteSupabaseId: string | null;
    parentId?: string | null; // Nouveau paramètre pour l'ID du parent
}

export default function useNote({ action, noteSupabaseId, parentId }: UseNoteProps) {

    const router = useRouter();

    const [categories, setCategories] = useState<string[]>(["All"]);
    const [balises, setBalises] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rappel, setRappel] = useState<string | null>(null);
    const [note, setNote] = useState(DEFAULT_NOTE_MARKDOWN);
    const [title, setTitle] = useState("Titre du note");
    const [initialNote, setInitialNote] = useState<NoteDto | null>(null);
    const [parentNote, setParentNote] = useState<NoteDto | null>(null); // Note parent

    const loadParentNote = async (parentId: string) => {
        try {
            const res = await fetchApi(`/api/notes/${parentId}`);
            if (!res.ok) {
                throw new Error(`Failed to fetch parent note with id ${parentId}`);
            }
            const data: NoteDto = await res.json();
            setParentNote(data);
            
            // Hériter des catégories du parent par défaut
            setCategories(data.categorie.length > 0 ? data.categorie : ["All"]);
            
        } catch (error) {
            console.error("Error loading parent note:", error);
            toast.error("Erreur lors du chargement de la note parent");
        }
    };

    const init = async () => {
        setIsLoading(true);
        
        try {
            // Charger la note parent si spécifiée
            if (parentId && action === "new_note") {
                await loadParentNote(parentId);
            }

            // Charger la note à éditer si nécessaire
            if (action === "edit_note" && noteSupabaseId) {
                const res = await fetchApi(`/api/notes/${noteSupabaseId}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch note with id ${noteSupabaseId}`);
                }
                const data: NoteDto = await res.json();
                
                setNote(data.contenu_note);
                setTitle(data.nom_note);
                setCategories(data.categorie);
                setBalises(data.balises);
                setRappel(data.rappel || null);
                setInitialNote(data);
            }
        } catch (error) {
            console.log(error);
            if (!(error instanceof CustomError)) {
                toast.error(`Erreur lors du chargement des données`);
            } else {
                toast.error(`${error.code} : ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, []);


    const handleSave = async () => {
        setIsLoading(true);
        const newNoteId = generateRandomId();
        const newNote: NoteDto = {
            nom_note: title,
            contenu_note: note,
            categorie: categories,
            balises: balises,
            date_heure_note: "",
            date_creation: new Date().toISOString(),
            id: "",
            status: "created",
            supabase_id: newNoteId,
            synced: true,
            typenote: "markdown",
            user_id: "user-123",
            visible_pour_date_seulement: false,
            date_sync: "",
            rappel: rappel || undefined,
            date_modification: new Date().toISOString(),
            parents: parentId ? [parentId] : [], // Ajouter le parent s'il existe
            enfants: [],
        };

        try {
            await fetchApi(`/api/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newNote),
            });

            // Créer la relation parent-enfant si nécessaire
            if (parentId) {
                await addParentEnfantRelation(parentId, newNoteId);
            }

            console.log("Saving note:", newNote);
            
            
            router.push("/");
            toast.success("Note enregistrée avec succès !");
        } catch (error) {
            if (!(error instanceof CustomError)) {
                const message = error instanceof Error ? error.message : String(error);
                console.error("Error saving note:", message);
                toast.error(`Erreur lors de l'enregistrement de la note`);
            } else {
                toast.error(`${error.code} : ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const handleConfirmModif = async () => {
        if (!initialNote) return;
        setIsLoading(true);
        const updatedNote: NoteDto = {
            ...initialNote,
            contenu_note: note,
            categorie: categories,
            balises: balises,
            rappel: rappel || undefined,
            status: "modified",
            date_sync: new Date().toISOString(),
            date_modification: new Date().toISOString()
        };
        try {
            await fetchApi(`/api/notes/${initialNote.supabase_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedNote),
            });

            console.log("Updating note:", updatedNote);
            router.push(`/note-preview/${initialNote.supabase_id}`);
            toast.success("Note modifiée avec succès !");
        } catch (error) {
            if (!(error instanceof CustomError)) {
                const message = error instanceof Error ? error.message : String(error);
                console.error("Error updating note:", message);
                toast.error(`Erreur lors de la modification de la note`);
            } else {
                toast.error(`${error.code} : ${error.message}`);
            }
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
        handleSave,
        initialNote,
        handleConfirmModif,
        parentNote, // Nouveau retour pour la note parent
    };
}
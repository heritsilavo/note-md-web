"use client"

import { DEFAULT_NOTE_MARKDOWN } from "@/constants/default-note-markdown";
import { NoteDto } from "@/database/note-dto";
import { fetchApi } from "@/utils/fetch-api";
import { generateRandomId } from "@/utils/generate-new-id";
import { CustomError } from "@heritsilavo/react-error-boundary/next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type UseNoteProps = {
    action: "new_note" | "edit_note";
    noteSupabaseId: string | null;
}

export default function useNote({ action, noteSupabaseId }: UseNoteProps) {

    const router = useRouter();

    const [categories, setCategories] = useState<string[]>(["All"]);
    const [balises, setBalises] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rappel, setRappel] = useState<string | null>(null);
    const [note, setNote] = useState(DEFAULT_NOTE_MARKDOWN);
    const [title, setTitle] = useState("Titre du note");
    const [initialNote, setInitialNote] = useState<NoteDto | null>(null);

    const init = async () => {
        if (action === "edit_note" && noteSupabaseId) {
            setIsLoading(true);
            try {
                const res = await fetchApi(`/api/notes/${noteSupabaseId}`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch note with id ${noteSupabaseId}`);
                }
                const {data}: {data:NoteDto} = await res.json();
                setNote(data.contenu_note);
                setTitle(data.nom_note);
                setCategories(data.categorie);
                setBalises(data.balises);
                setRappel(data.rappel || null);
                setInitialNote(data);
            } catch (error) {
                console.log(error);
                if (!(error instanceof CustomError)) {
                    toast.error(`Erreur lors du chargement de la note`);
                } else {
                    toast.error(`${error.code} : ${error.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        init();
    }, []);

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
            date_sync: "",
            rappel: rappel || undefined,
            date_modification: new Date().toISOString()
        };

        try {
            await fetchApi(`/api/notes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newNote),
            });

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
            router.push("/");
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
        handleConfirmModif
    };
}
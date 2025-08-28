"use client";
import { NoteDto } from "@/database/note-dto";
import { fetchApi } from "@/utils/fetch-api";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Page() {
    const noteId = useParams()["note-id"];
    
    const [isLoading, setIsLoading] = useState(false);
    const [noteData, setNoteData] = useState<NoteDto>();
    
    const getNoteData = async () => {
        setIsLoading(true);
        try {
            const res = await fetchApi(`/api/notes/${noteId}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data: NoteDto = await res.json();
            setNoteData(data);
        } catch (error) {
            console.error("Failed to fetch note data:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (noteId) {
            getNoteData();
        }
    }, [noteId]);

    if (!noteId) {
        return <> Note ID manquant </>;
    }
    return <> Note: {JSON.stringify(noteId)} </>
}
"use client"
import { fetchApi } from "@/utils/fetch-api";
import { useModal } from "@heritsilavo/modal/next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type UseDeleteNoteProps = {
    noteId: string;
}

export function useDeleteNote({ noteId }: UseDeleteNoteProps) {
    const router = useRouter();

    const { setModal } = useModal()
    const [loadingDelete, setLoadingDelete] = useState(false);

    const confirmDelete = async () => {
        setModal({ open: false, content: null });
        setLoadingDelete(true);
        try {
            const response = await fetchApi(`/api/notes/${noteId}`, { method: 'DELETE' });
            if (response.ok) {
                console.log("Note deleted successfully[respose]: ", await response.json());
                router.replace('/');
                toast.success("Note deleted successfully");
            } else {
                toast.error("Failed to delete the note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
        } finally {
            setLoadingDelete(false);
        }
    };

    const openModal = () => {
        setModal({
            open: true,
            content: <div className="p-2 flex justify-center items-center font-bold text-red-500">Confirmer la suppression ?</div>,
            noHeader: true,
            onConfirm: () => confirmDelete(),
            animationType: "elastic", // 'elastic' | 'smooth' | 'fade'
            modalContentClassname: "border-0"
        });
    };

    return {
        openModal,
        loadingDelete,
        setLoadingDelete
    }
}
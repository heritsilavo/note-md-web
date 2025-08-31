import { HistoriqueNoteDTO } from "./historique-dto";
import { NoteDto } from "./note-dto";
import { supabase } from "./supabase";

/**
 * recupere toutes les notes de la table historique
 * @returns all notes from historique table ordered by created_at descending
 */
export async function getAllHistoriqueNotes(): Promise<{ data: HistoriqueNoteDTO[]; error: any }> {
    try {
        const { data, error } = await supabase
            .from('notes_hist')
            .select('*')
            .limit(50)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.log("getAllHistoriqueNotes error:", error);
            return { data: [], error };
        }
        
        console.log("getAllHistoriqueNotes data:", data);
        
        const historiques = (data ?? []).map((histo: any) => new HistoriqueNoteDTO({
            id: histo.id,
            note_id: histo.note_id,
            nom_note: histo.nom_note,
            avant: histo.avant,
            apres: histo.apres,
            action: histo.action,
            created_at: histo.created_at,
        }));
        
        return { data: historiques, error: null };
    } catch (error) {
        console.log("Unexpected error:", error);
        return { data: [], error };
    }
}

/**
 * Recupere un historique par son id
 * @param id id de l'historique a recuperer
 * @returns l'historique correspondant a l'id
 */
export async function getHistoriqueNoteById(id: string): Promise<{ data: HistoriqueNoteDTO | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('notes_hist')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            console.log("getHistoriqueNoteById error:", error);
            return { data: null, error };
        }
        if (!data) {
            return { data: null, error: null };
        }
        const historique = new HistoriqueNoteDTO({
            id: data.id,
            note_id: data.note_id,
            nom_note: data.nom_note,
            avant: data.avant,
            apres: data.apres,
            action: data.action,
            created_at: data.created_at,
        });
        return { data: historique, error: null };
    } catch (error) {
        console.log("Unexpected error:", error);
        return { data: null, error };
    }
}
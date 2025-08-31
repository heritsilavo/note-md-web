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
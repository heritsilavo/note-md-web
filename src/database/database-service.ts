import { supabase } from "@/database/supabase";
import { NoteDto } from "./note-dto";

/**
 * Fetch all notes from the database.
 * @returns Promise resolving to an array of notes or error.
 */
export async function getNotes() {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) throw error;
  return (data ?? []).map((note: any) => new NoteDto({
    supabase_id: note.supabase_id,
    id: note.id,
    nom_note: note.nom_note,
    contenu_note: note.contenu_note,
    date_creation: note.date_creation,
    date_heure_note: note.date_heure_note,
    date_sync: note.date_sync,
    categorie: note.categorie ?? [],
    typenote: note.typenote,
    visible_pour_date_seulement: note.visible_pour_date_seulement,
    rappel: note.rappel,
    synced: note.synced,
    status: note.status,
    user_id: note.user_id,
    balises: note.balises ?? [],
  }));
}

/**
 * Add a new note to the database.
 * @param note - The note object to insert.
 * @returns Promise resolving to the inserted note or error.
 */
export async function addNote(note: NoteDto) {
  const { data, error } = await supabase.from('notes').insert([
    {
      supabase_id: note.supabase_id,
      id: note.id,
      nom_note: note.nom_note,
      contenu_note: note.contenu_note,
      date_creation: note.date_creation,
      date_heure_note: note.date_heure_note,
      date_sync: note.date_sync,
      categorie: note.categorie,
      typenote: note.typenote,
      visible_pour_date_seulement: note.visible_pour_date_seulement,
      rappel: note.rappel,
      synced: note.synced,
      status: note.status,
      user_id: note.user_id,
      balises: note.balises,
    }
  ]).select();
  if (error) throw error;
  return data?.[0] ? new NoteDto(data[0]) : null;
}

/**
 * Update an existing note.
 * @param id - The ID of the note to update.
 * @param updates - The fields to update.
 * @returns Promise resolving to the updated note or error.
 */
export async function updateNote(id: string, updates: Partial<NoteDto>) {
  const { data, error } = await supabase.from('notes').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0] ? new NoteDto(data[0]) : null;
}

/**
 * Delete a note by ID.
 * @param id - The ID of the note to delete.
 * @returns Promise resolving to the deleted note or error.
 */
export async function deleteNote(id: string) {
  const { data, error } = await supabase.from('notes').delete().eq('id', id).select();
  if (error) throw error;
  return data?.[0] ? new NoteDto(data[0]) : null;
}

/**
 * Get a note by its ID.
 * @param noteId - The ID of the note to retrieve.
 * @returns Promise resolving to the note or error.
 */
export async function getNoteById(noteId: string) {
  return await supabase.from('notes').select('*').eq('supabase_id', noteId).single();
}

/**
 * Get a note by its title.
 * @param nomNote - The title of the note to retrieve.
 * @returns Promise resolving to the note or error.
 */
export async function getNoteByTitle(nomNote: string) {
  const { data, error } = await supabase.from('notes').select('*').limit(1).eq('nom_note', nomNote).single();
  if (error) {
    console.log("getNoteByTitle error:", error);
    return null;
  };
  return data ? new NoteDto(data) : null;
}

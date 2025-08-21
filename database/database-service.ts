import { supabase } from './supabase';

/**
 * Fetch all notes from the database.
 * @returns Promise resolving to an array of notes or error.
 */
export async function getNotes() {
  const { data, error } = await supabase.from('notes').select('*');
  if (error) throw error;
  return data;
}

/**
 * Add a new note to the database.
 * @param note - The note object to insert.
 * @returns Promise resolving to the inserted note or error.
 */
export async function addNote(note: { title: string; content: string }) {
  const { data, error } = await supabase.from('notes').insert([note]).select();
  if (error) throw error;
  return data?.[0];
}

/**
 * Update an existing note.
 * @param id - The ID of the note to update.
 * @param updates - The fields to update.
 * @returns Promise resolving to the updated note or error.
 */
export async function updateNote(id: number, updates: { title?: string; content?: string }) {
  const { data, error } = await supabase.from('notes').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

/**
 * Delete a note by ID.
 * @param id - The ID of the note to delete.
 * @returns Promise resolving to the deleted note or error.
 */
export async function deleteNote(id: number) {
  const { data, error } = await supabase.from('notes').delete().eq('id', id).select();
  if (error) throw error;
  return data?.[0];
}

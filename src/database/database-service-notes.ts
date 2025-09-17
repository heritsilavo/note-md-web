import { supabase } from "@/database/supabase";
import { NoteDto } from "./note-dto";
import { SummaryDataType } from "@/types/summary-data.types";
import { decrypt, encrypt } from "@/utils/crypto-js";

/**
 * Fetch all notes from the database.
 * @returns Promise resolving to an array of notes or error.
 */
export async function getNotes() {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .neq('status', 'deleted')
    .order('date_modification', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((note: any) => new NoteDto({
    supabase_id: note.supabase_id,
    id: note.id,
    nom_note: note.nom_note,
    contenu_note: decrypt(note.contenu_note),
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
    date_modification: note.date_modification,
  }));
}

/**
 * Fetch all note names from the database.
 * @returns Promise resolving to an array of notes or error.
 */
export async function getNoteNames() {
  const { data, error } = await supabase
    .from('notes')
    .select('nom_note')
    .neq('status', 'deleted')
    .order('date_modification', { ascending: false });
  if (error) throw error;
  return (data ?? []).map((note: any) => note.nom_note);
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
      contenu_note: encrypt(note.contenu_note),
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
      date_modification: note.date_modification,
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
  const updateData: any = { ...updates };

  if (!!updates.contenu_note) {
    updateData.contenu_note = encrypt(updates.contenu_note);
  }

  const { data, error } = await supabase
    .from('notes')
    .update(updateData)
    .eq('supabase_id', id)
    .select();
  if (error) throw error;
  return data?.[0] ? new NoteDto(data[0]) : null;
}

/**
 * Delete a note by ID.
 * @param id - The ID of the note to delete.
 * @returns Promise resolving to the deleted note or error.
 */
export async function deleteNote(id: string) {
  const { data, error } = await supabase.from('notes').delete().eq('supabase_id', id).select();
  if (error) throw error;
  return data?.[0] ? new NoteDto(data[0]) : null;
}

/**
 * soft delete a note by ID.
 * @param id - The ID of the note to delete.
 * @returns Promise resolving to the deleted note or error.
 */
export async function softDeleteNote(id: string) {
  const { data, error } = await supabase.from('notes').update({ status: 'deleted' }).eq('supabase_id', id).select();
  if (error) throw error;
  return data?.[0] ? new NoteDto(data[0]) : null;
}

/**
 * Get a note by its ID.
 * @param noteId - The ID of the note to retrieve.
 * @returns Promise resolving to the note or error.
 */
export async function getNoteById(noteId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('supabase_id', noteId)
    .single();
  if (error) {
    console.log("getNoteByTitle error:", error);
    return null;
  };
  const noteData = { ...data }
  if (!!noteData.contenu_note) {
    noteData.contenu_note = decrypt(data.contenu_note)
  }
  return data ? new NoteDto(noteData) : null;
}

/**
 * Get a note by its title.
 * @param nomNote - The title of the note to retrieve.
 * @returns Promise resolving to the note or error.
 */
export async function getNoteByTitle(nomNote: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .neq('status', 'deleted')
    .limit(1)
    .eq('nom_note', nomNote)
    .single();
  if (error) {
    console.log("getNoteByTitle error:", error);
    return null;
  };
  const noteData = { ...data }
  if (!!noteData.contenu_note) {
    noteData.contenu_note = decrypt(data.contenu_note)
  }
  return data ? new NoteDto(noteData) : null;
}

/**
 * Get a note by its title qui n'est pas le note donné
 * @param nomNote - The title of the note to retrieve.
 * @param noteSupabaseId - L'id du note qui n'est pas pris en compte
 * @returns Promise resolving to the note or error.
 */
export async function getNoteByTitleExcluding(nomNote: string, noteSupabaseId: string) {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .neq('status', 'deleted')
      .neq('supabase_id', noteSupabaseId)
      .eq('nom_note', nomNote)
      .limit(1)
      .single();
    if (error) {
      console.log("getNoteByTitle error:", error);
      return null;
    };
    const noteData = { ...data }
    if (!!noteData.contenu_note) {
      noteData.contenu_note = decrypt(data.contenu_note)
    }
    return data ? new NoteDto(noteData) : null;
  } catch {
    return null
  }
}

/**
 * Récupérer des données de résumé depuis la base de données
 * @returns { notesCount, notesThisWeek, upcomingReminders, pendingSync }
 */
export async function getSummaryData(): Promise<SummaryDataType | null> {
  try {
    // 1. Compter le nombre total de notes (hors celles supprimées)
    const { count: notesCount, error: countError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'deleted');

    if (countError) throw countError;

    // 2. Compter les notes créées cette semaine
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Début de semaine (dimanche)
    startOfWeek.setHours(0, 0, 0, 0);

    const { count: notesThisWeek, error: weekError } = await supabase
      .from('notes')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'deleted')
      .gte('date_creation', startOfWeek.toISOString());

    if (weekError) throw weekError;

    // 3. Récupérer les rappels à venir (dans les 7 prochains jours)
    // const now = new Date();
    // const nextWeek = new Date();
    // nextWeek.setDate(now.getDate() + 7);

    // const { data: remindersData, error: remindersError } = await supabase
    //   .from('notes')
    //   .select('rappel')
    //   .neq('status', 'deleted')
    //   .not('rappel', 'is', null)
    //   .gte('rappel', now.toISOString())
    //   .lte('rappel', nextWeek.toISOString());

    // if (remindersError) throw remindersError;
    // const upcomingReminders = remindersData?.length || 0;
    const upcomingReminders = 0;

    // 4. Compter les notes non synchronisées
    const { count: pendingSync, error: syncError } = await supabase
      .from('notes')
      .select('*', { count: "exact", head: true })
      .neq('status', 'deleted')
      .eq('synced', false);

    if (syncError) throw syncError;

    return {
      notesCount: notesCount || 0,
      notesThisWeek: notesThisWeek || 0,
      upcomingReminders,
      pendingSync: pendingSync || 0
    };

  } catch (e) {
    console.error("Error in getSummaryData:", e);
    return null;
  }
}

/**
 * rechercher les notes dont le nom contient le parametre 
 * @param nom - Le terme de recherche pour le nom de la note
 * @returns Promise resolving to an array of notes or error.
 */
export async function searchNotes(nom: string) {
  try {
    // Recherche insensible à la casse avec ilike
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .neq('status', 'deleted')
      .ilike('nom_note', `%${nom}%`)
      .order('date_modification', { ascending: false })
      .limit(20); // Limiter les résultats pour des performances optimales

    if (error) {
      console.error("searchNotes error:", error);
      throw error;
    }

    // Déchiffrer le contenu des notes et mapper vers NoteDto
    return (data ?? []).map((note: any) => {
      const noteData = { ...note };
      if (!!noteData.contenu_note) {
        noteData.contenu_note = decrypt(note.contenu_note);
      }
      return new NoteDto(noteData);
    });

  } catch (error) {
    console.error("Error in searchNotes:", error);
    return [];
  }
}
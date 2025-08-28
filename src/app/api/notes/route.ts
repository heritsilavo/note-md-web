import { NextResponse } from 'next/server';
import { getNotes, addNote, updateNote, deleteNote, getNoteByTitle } from '../../../database/database-service';
import { NoteDto } from '../../../database/note-dto';

export async function GET() {
  try {
    const notes = await getNotes();
    return NextResponse.json(notes);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body || !body.supabase_id || !body.nom_note || !body.contenu_note) return NextResponse.json({ error: 'Invalid note data' }, { status: 400 });
    const existingNoteByTitle = await getNoteByTitle(body.nom_note);
    
    if (existingNoteByTitle) {
       return NextResponse.json({ error: "Ce nom est deja utilisé" }, { status: 409 });
    }

    const noteDto = new NoteDto(body);
    const note = await addNote(noteDto);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const note = await updateNote(id, updates);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const note = await deleteNote(body.id);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
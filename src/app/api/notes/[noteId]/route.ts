import { getNoteById, updateNote, deleteNote } from '@/database/database-service';
import { NextResponse } from 'next/server';

export async function GET(request: Request, context: { params: { noteId: string } }) {
  try {
    const params = await context.params;
    console.log("param:", params);
    
    const note = await getNoteById(params.noteId);
    console.log("note:", note);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { noteId: string } }) {
  try {
    const body = await request.json();
    const note = await updateNote(context.params.noteId, body);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { noteId: string } }) {
  try {
    const note = await deleteNote(context.params.noteId);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

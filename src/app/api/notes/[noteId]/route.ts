import { getNoteById, updateNote, softDeleteNote } from '@/database/database-service-notes';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const params = await context.params;
    const note = await getNoteById(params.noteId);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    const note = await updateNote(params.noteId, body);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ noteId: string }> }
) {
  try {
    const params = await context.params;
    const note = await softDeleteNote(params.noteId);
    return NextResponse.json(note);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
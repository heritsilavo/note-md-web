import React, { Suspense } from "react";
import NoteItem from "./NoteItem";
import { NoteDto } from "@/database/note-dto";

interface NotesCardsProps {
 
}

export default async function NotesCards() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/notes`);
  const notes = await response.json() as NoteDto[];
  
  return (
    <Suspense fallback={<div>Loading notes...</div>}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {notes.map((note, idx) => <NoteItem key={idx} note={note} />)}
      </div>
    </Suspense>
  );
}

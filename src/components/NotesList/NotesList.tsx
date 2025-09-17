import React, { Suspense } from "react";
import { NoteDto } from "@/database/note-dto";
import DynamicNotesList from "./DynamicNoteList";

export default async function NotesList() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const response = await fetch(`${baseUrl}/api/notes`);
  const notes = await response.json() as NoteDto[];
  if (!notes) {
    return <div className="text-center text-gray-500">Aucune note trouvée.</div>
  }
  return (
    <DynamicNotesList notes={notes}></DynamicNotesList>
  );
}

import React from "react";
import NoteItem from "./NoteItem";

export type Note = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  status?: "synchronisé" | "en attente" | "brouillon";
  statusColor?: string;
  attachments?: number;
};

interface NotesCardsProps {
  notes: Note[];
}

export default function NotesCards({ notes }: NotesCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {notes.map((note, idx) => <NoteItem key={idx} note={note} />)}
    </div>
  );
}

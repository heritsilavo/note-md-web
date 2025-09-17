"use client"
import { NoteDto } from "@/database/note-dto";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";

type NoteListItemProps = {
  note: NoteDto
}

export default function NoteListItem({ note }: NoteListItemProps) {
  const router = useRouter();

  const onClickNote = () => {
    router.push(`/note-preview/${note.supabase_id}`);
  }

  return (
    <div 
      onClick={onClickNote} 
      className="bg-white rounded-lg p-6 shadow flex justify-between items-start cursor-pointer hover:shadow-lg active:shadow transition-shadow duration-200"
    >
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-bold text-lg">{note.nom_note}</h3>
          {note.status && (
            <span
              className={
                note.status === "synced"
                  ? "bg-green-200 text-green-800 text-xs px-2 py-1 rounded"
                  : note.status === "modified"
                    ? "bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded"
                    : note.status === "deleted"
                      ? "bg-red-200 text-red-800 text-xs px-2 py-1 rounded"
                      : "bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded"
              }
            >
              {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
            </span>
          )}
        </div>
        
        <span className="text-xs text-gray-500 block mb-2">{note.date_heure_note}</span>
        
        <p className="text-gray-700 text-sm mb-3">
          {note.contenu_note.length > 200 ? note.contenu_note.slice(0, 200) + "..." : note.contenu_note}
        </p>
        
        <div className="flex gap-2 flex-wrap">
          {note.categorie.map((category, i) => (
            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {category}
            </span>
          ))}
          {note.balises.map((tag, i) => (
            <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <button 
        onClick={(e) => { 
          e.stopPropagation();
          router.push(`/note-editor/?action=edit_note&id=${note.supabase_id}`) 
        }} 
        className="cursor-pointer text-blue-700 hover:text-blue-900 p-2 ml-4"
        aria-label="Modifier la note"
      >
        <FiEdit className="w-5 h-5" />
      </button>
    </div>
  )
}
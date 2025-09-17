"use client"
import { NoteDto } from "@/database/note-dto";
import { useRouter } from "next/navigation";
import { FiEdit, FiEye } from "react-icons/fi";

type NoteArrayItemProps = {
  note: NoteDto
}

export default function NoteArrayItem({ note }: NoteArrayItemProps) {
  const router = useRouter();

  const handlePreview = () => {
    router.push(`/note-preview/${note.supabase_id}`);
  }

  const handleEdit = () => {
    router.push(`/note-editor/?action=edit_note&id=${note.supabase_id}`);
  }

  return (
    <tr className="hover:bg-gray-50 cursor-pointer">
      <td className="px-6 py-4 whitespace-nowrap" onClick={handlePreview}>
        <div className="text-sm font-semibold text-gray-900">{note.nom_note}</div>
        <div className="text-sm text-gray-500 truncate max-w-xs">
          {note.contenu_note.length > 100 
            ? note.contenu_note.slice(0, 100) + "..." 
            : note.contenu_note}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={handlePreview}>
        {note.date_heure_note}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap" onClick={handlePreview}>
        {note.status && (
          <span
            className={
              note.status === "synced"
                ? "inline-flex px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800 rounded-full"
                : note.status === "modified"
                  ? "inline-flex px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800 rounded-full"
                  : note.status === "deleted"
                    ? "inline-flex px-2 text-xs font-semibold leading-5 bg-red-100 text-red-800 rounded-full"
                    : "inline-flex px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800 rounded-full"
            }
          >
            {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
          </span>
        )}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={handlePreview}>
        <div className="flex flex-wrap gap-1">
          {note.categorie.map((category, i) => (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {category}
            </span>
          ))}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={handlePreview}>
        <div className="flex flex-wrap gap-1">
          {note.balises.map((tag, i) => (
            <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {tag}
            </span>
          ))}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreview}
            className="cursor-pointer text-blue-600 hover:text-blue-900 p-1"
            aria-label="Voir la note"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={handleEdit}
            className="cursor-pointer text-indigo-600 hover:text-indigo-900 p-1"
            aria-label="Modifier la note"
          >
            <FiEdit className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
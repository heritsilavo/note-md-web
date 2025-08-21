import { NoteDto } from "@/database/note-dto";

type NoteItemProps = {
    note: NoteDto
}

export default function NoteItem({note}: NoteItemProps) {
    return <div className="bg-white rounded-lg p-6 shadow flex flex-col gap-2 cursor-pointer hover:shadow-lg active:shadow transition-shadow duration-200">
          <h3 className="font-bold text-lg">{note.nom_note}</h3>
          <span className="text-xs text-gray-500">{note.date_heure_note}</span>
          <p className="text-gray-700 text-sm overflow-hidden" style={{maxHeight: '4.5em', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'pre-line'}}>
            {note.contenu_note.length > 200 ? note.contenu_note.slice(0, 200) + "..." : note.contenu_note}
          </p>
          <div className="flex gap-2 flex-wrap mt-2">
            {note.balises.map((tag, i) => (
              <span key={i} className="bg-gray-100 text-xs px-2 py-1 rounded">{tag}</span>
            ))}
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
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <a href="#" className="text-blue-700">Voir PJ</a>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button className="text-blue-700 text-xs">Modifier</button>
          </div>
        </div>
}
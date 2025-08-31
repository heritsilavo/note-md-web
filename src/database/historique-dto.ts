import { NoteDto } from "./note-dto";

export class HistoriqueNoteDTO {
    id: string; // ID de l'historique
    note_id: string; // ID de la note associée
    nom_note: string; // Nom de la note
    avant: NoteDto | null;
    apres: NoteDto | null;
    action: 'CREATION' | 'MODIFICATION' | 'SUPPRESSION' | 'SYNCHRONISATION';
    created_at: string; // Date de création de l'historique
    constructor(params: {
        id: string;
        note_id: string;
        nom_note: string;
        avant: NoteDto | null;
        apres: NoteDto | null;
        action: 'CREATION' | 'MODIFICATION' | 'SUPPRESSION' | 'SYNCHRONISATION';
        created_at: string;
    }) {
        this.id = params.id;
        this.note_id = params.note_id;
        this.nom_note = params.nom_note;
        this.avant = params.avant;
        this.apres = params.apres;
        this.action = params.action;
        this.created_at = params.created_at;
    }
} 
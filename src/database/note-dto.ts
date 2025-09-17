export type NoteStatus = "synced" | "modified" | "deleted" | "created";

export class NoteDto {
  supabase_id: string;
  id: string;
  nom_note: string;
  contenu_note: string;
  date_creation: string;
  date_modification: string;
  date_heure_note: string;
  date_sync?: string;
  categorie: string[];
  typenote: string;
  visible_pour_date_seulement: boolean;
  rappel?: string;
  synced: boolean;
  status: NoteStatus;
  user_id: string;
  balises: string[];

  constructor(params: Partial<NoteDto> = {}) {
    this.supabase_id = params.supabase_id ?? "";
    this.id = params.id ?? "";
    this.nom_note = params.nom_note ?? "";
    this.contenu_note = params.contenu_note ?? "";
    this.date_creation = params.date_creation ?? new Date().toISOString();
    this.date_modification = params.date_modification ?? new Date().toISOString();
    this.date_heure_note = params.date_heure_note ?? new Date().toISOString();
    this.date_sync = params.date_sync;
    this.categorie = params.categorie ?? [];
    this.typenote = params.typenote ?? "";
    this.visible_pour_date_seulement = params.visible_pour_date_seulement ?? false;
    this.rappel = params.rappel;
    this.synced = params.synced ?? false;
    this.status = params.status ?? "created";
    this.user_id = params.user_id ?? "";
    this.balises = params.balises ?? [];
  }
}
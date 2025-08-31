import { HistoriqueNoteDTO } from "@/database/historique-dto";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface HistoriqueFilters {
  filtreNote: string;
  dateRange: DateRange;
}

export interface HistoriqueCardProps {
  historique: HistoriqueNoteDTO;
  index: number;
  onRestaurer: (id: string) => void;
  onVoirDetails: (id: string) => void;
}

export interface HistoriqueFiltersProps {
  nomNotes: string[];
  filters: HistoriqueFilters;
  onFilterChange: (filters: Partial<HistoriqueFilters>) => void;
  onReset: () => void;
}

export interface DatePickerComponentProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  showDatePicker: boolean;
  onToggleDatePicker: (show: boolean) => void;
}

export type ActionType = "CREATION" | "MODIFICATION" | "SUPPRESSION" | "SYNCHRONISATION";

export interface HistoriqueActions {
  restaurerVersion: (id: string) => void;
  voirDetails: (id: string) => void;
  reinitialiserFiltres: () => void;
}
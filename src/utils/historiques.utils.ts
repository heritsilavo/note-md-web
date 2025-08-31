import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { HistoriqueNoteDTO } from "@/database/historique-dto";
import { ActionType } from "@/types/historiques.types";

export const getActionColor = (action: ActionType): string => {
  switch (action) {
    case "CREATION":
      return "bg-green-500";
    case "MODIFICATION":
      return "bg-blue-500";
    case "SUPPRESSION":
      return "bg-red-500";
    case "SYNCHRONISATION":
      return "bg-orange-500";
    default:
      return "bg-gray-500";
  }
};

export const getActionBadgeColor = (action: ActionType): string => {
  switch (action) {
    case "CREATION":
      return "bg-green-100 text-green-800";
    case "MODIFICATION":
      return "bg-blue-100 text-blue-800";
    case "SUPPRESSION":
      return "bg-red-100 text-red-800";
    case "SYNCHRONISATION":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy, HH:mm", { locale: fr });
  } catch {
    return dateString;
  }
};

export const getPreviewText = (historique: HistoriqueNoteDTO): string => {
  const contenu =
    historique.apres?.contenu_note || historique.avant?.contenu_note || "";
  const cleanText = contenu.replace(/[#*`>\-\[\]]/g, "").trim();
  return cleanText.length > 150
    ? cleanText.substring(0, 150) + "..."
    : cleanText;
};

export const getDateRangeText = (startDate: Date | null, endDate: Date | null): string => {
  if (startDate && endDate) {
    return `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
  }
  if (startDate) {
    return `Depuis ${format(startDate, "dd/MM/yyyy")}`;
  }
  if (endDate) {
    return `Jusqu'au ${format(endDate, "dd/MM/yyyy")}`;
  }
  return "Sélectionner une date";
};
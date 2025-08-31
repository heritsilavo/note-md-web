import { useEffect, useState, useCallback } from "react";
import { getAllHistoriqueNotes, getHistoriqueNoteById } from "@/database/database-service-historique";
import { getNoteNames } from "@/database/database-service-notes";
import { HistoriqueNoteDTO } from "@/database/historique-dto";
import { HistoriqueFilters, DateRange, HistoriqueActions } from "@/types/historiques.types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useHistorique = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [nomNotes, setNomNotes] = useState<string[]>([]);
  const [historiques, setHistoriques] = useState<HistoriqueNoteDTO[]>([]);
  const [filters, setFilters] = useState<HistoriqueFilters>({
    filtreNote: "",
    dateRange: {
      startDate: null,
      endDate: null,
    },
  });

  const loadDatas = useCallback(async () => {
    setIsLoading(true);
    try {
      const noms = await getNoteNames();
      setNomNotes(noms);
      const { data: histos } = await getAllHistoriqueNotes();
      setHistoriques(histos || []);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatas();
  }, [loadDatas]);

  const isDateInRange = useCallback((dateString: string, { startDate, endDate }: DateRange) => {
    if (!startDate && !endDate) return true;
    const date = new Date(dateString);
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    if (startDate) {
      return date >= startDate;
    }
    if (endDate) {
      return date <= endDate;
    }
    return true;
  }, []);

  const historiquesFiltres = useCallback(() => {
    return historiques.filter((h) => {
      const matchNote =
        !filters.filtreNote || 
        h.nom_note.toLowerCase() == filters.filtreNote.toLowerCase();
      const matchDate = isDateInRange(h.created_at, filters.dateRange);
      return matchNote && matchDate;
    });
  }, [historiques, filters, isDateInRange]);

  const updateFilters = useCallback((newFilters: Partial<HistoriqueFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const reinitialiserFiltres = useCallback(() => {
    setFilters({
      filtreNote: "",
      dateRange: {
        startDate: null,
        endDate: null,
      },
    });
  }, []);

  const restaurerVersion = useCallback((historiqueId: string) => {
    console.log("Restaurer version:", historiqueId);
    // TODO: Implémenter la logique de restauration
  }, []);

  const voirDetails = useCallback(async (historiqueId: string) => {
    setIsLoading(true);
    try {
      const { data: historique, error } = await getHistoriqueNoteById(historiqueId);
      if (error) {
        toast.error("Erreur lors du chargement des détails.");
        console.error("Erreur lors du chargement des détails:", error);
        return;
      }
      if (!historique) {
        toast.error("Historique non trouvé.");
        return;
      }
      // TODO: Afficher les détails dans un modal
    } catch (error) {
      toast.error("Erreur lors du chargement des détails.");
      console.error("Erreur lors du chargement des détails:", error);
    } finally { 
      setIsLoading(false);
    }
  }, []);

  const actions: HistoriqueActions = {
    restaurerVersion,
    voirDetails,
    reinitialiserFiltres,
  };

  return {
    isLoading,
    nomNotes,
    historiques: historiquesFiltres(),
    filters,
    updateFilters,
    actions,
    loadDatas,
  };
};
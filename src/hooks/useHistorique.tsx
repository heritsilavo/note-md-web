import { useEffect, useState, useCallback, useRef } from "react";
import { getAllHistoriqueNotes, getHistoriqueNoteById } from "@/database/database-service-historique";
import { getNoteByTitleExcluding, getNoteNames } from "@/database/database-service-notes";
import { HistoriqueNoteDTO } from "@/database/historique-dto";
import { HistoriqueFilters, DateRange, HistoriqueActions } from "@/types/historiques.types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useModal } from "@heritsilavo/modal/next";
import { NoteDto } from "@/database/note-dto";
import { fetchApi } from "@/utils/fetch-api";
import { generateRandomId } from "@/utils/generate-new-id";

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
  const [triggerRefreshData, setTriggerRefreshData] = useState<Date>(new Date())

  const { setModal } = useModal();

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
  }, [loadDatas, triggerRefreshData]);

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

  const hideModal = () => {
    setModal({ content: null, open: false });
  };

  const confirmRestoreAndRename = async (historique: HistoriqueNoteDTO, newNameValue: string) => {
    hideModal();
    setIsLoading(true);
    console.log("VALUE%%%%% ", newNameValue, historique.note_id);

    const existingNote = await getNoteByTitleExcluding(newNameValue, historique.note_id);
    console.log("EXISTING: ", newNameValue, existingNote);

    if (existingNote) {
      toast.error("Nom déjà utilisé !!! 🙄");
    } else if (!!historique.apres) {
      const newNote: NoteDto = {
        ...historique.apres,
        supabase_id: generateRandomId(),
        nom_note: newNameValue,
        status: "created",
        date_creation: (new Date()).toISOString(),
        date_modification: (new Date()).toISOString(),
        id: "",
        date_sync: "",
        synced: false
      };
      await fetchApi(`/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });
      setTriggerRefreshData(new Date())
    }
    setIsLoading(false);
  };

  const handleRestoreWithModal = useCallback(async (historique: HistoriqueNoteDTO) => {
    let newNameValue = historique.nom_note;

    setModal({
      open: true,
      content: (
        <div className="p-2 flex flex-col justify-center items-center text-gray-600">
          Donner le nouveau nom à utiliser
          <input
            type="text"
            defaultValue={historique.nom_note}
            onChange={(e) => { newNameValue = e.target.value; }}
            className="border p-2 mt-2 w-full"
          />
          <p className="mt-2 text-sm">Notez que cela va créer une nouvelle note avec le même contenu et paramètres</p>
        </div>
      ),
      header: "Nom de note déjà utilisé",
      onConfirm: () => confirmRestoreAndRename(historique, newNameValue),
      animationType: "elastic",
      modalContentClassname: "border-0",
      btnsLabel: { confirm: "Oui, modifier et restaurer", cancel: "Annuler" }
    });
  }, []);

  const confirmRestore = useCallback(async (historiqueId: string) => {
    hideModal();
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

      const noteId = historique.note_id;

      if (historique.action == "CREATION" || historique.action == "MODIFICATION") {
        const historiquForNote = historiques
          .filter(h => h.nom_note == historique.nom_note)
          .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });
        if (historiquForNote.length <= 1) {
          toast.error("La note n'a pa encore eté changé 😃")
          return;
        }
        
        if (historiquForNote[0].id == historique.id) {
          toast.error("Vous utilisez déja cette version 😃")
          return;
        }
      }

      if (historique.action === "SUPPRESSION") {
        const existingNote = await getNoteByTitleExcluding(historique.nom_note, historique.note_id);
        if (existingNote) {
          setTimeout(async () => {
            await handleRestoreWithModal(historique);
          }, 10);
          setIsLoading(false);
          return;
        } else {
          // Restaurer la note supprimée
          const updatedNoteDto: Partial<NoteDto> = {
            status: "modified",
            balises: historique.apres?.balises,
            categorie: historique.apres?.categorie,
            date_modification: new Date().toISOString(),
            contenu_note: historique.apres?.contenu_note,
            rappel: historique.apres?.rappel,
            date_heure_note: historique.apres?.date_heure_note,
            synced: historique.apres?.synced,
            visible_pour_date_seulement: historique.apres?.visible_pour_date_seulement
          };

          await fetchApi(`/api/notes/${noteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedNoteDto),
          });
        }
      } else {
        // Restaurer une modification normale
        const updatedNoteDto: Partial<NoteDto> = {
          balises: historique.apres?.balises,
          categorie: historique.apres?.categorie,
          date_modification: new Date().toISOString(),
          contenu_note: historique.apres?.contenu_note,
          rappel: historique.apres?.rappel,
          status: historique.apres?.status,
          date_heure_note: historique.apres?.date_heure_note,
          synced: historique.apres?.synced,
          visible_pour_date_seulement: historique.apres?.visible_pour_date_seulement
        };

        await fetchApi(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedNoteDto),
        });
      }

      toast.success("Restauration réussie !");
      setTriggerRefreshData(new Date())

    } catch (error) {
      toast.error("Erreur lors de la restauration.");
      console.error("Erreur lors de la restauration:", error);
    } finally {
      setIsLoading(false);
    }
  }, [handleRestoreWithModal, router]);

  const openModal = (historiqueId: string) => {
    setModal({
      open: true,
      content: <div className="p-2 flex justify-center items-center text-gray-600">Concerne le contenu seulement !</div>,
      header: "Confirmer la restauration ?",
      onConfirm: () => confirmRestore(historiqueId),
      animationType: "elastic",
      modalContentClassname: "border-0",
      btnsLabel: { confirm: "Oui, restaurer", cancel: "Annuler" }
    });
  };

  const restaurerVersion = useCallback((historiqueId: string) => {
    openModal(historiqueId);
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
      const dataString = JSON.stringify(historique.apres);
      router.push(`/note-preview/${historique.note_id}?action=note_historique&note_data=${encodeURIComponent(dataString)}`);
    } catch (error) {
      toast.error("Erreur lors du chargement des détails.");
      console.error("Erreur lors du chargement des détails:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

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
    router
  };
};
"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAllHistoriqueNotes } from "@/database/database-service-historique";
import { getNoteNames } from "@/database/database-service-notes";
import { HistoriqueNoteDTO } from "@/database/historique-dto";
import { useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ArrowPathIcon,
  EyeIcon,
  CalendarIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/react";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [nomNotes, setNomNotes] = useState<string[]>([]);
  const [historiques, setHistoriques] = useState<HistoriqueNoteDTO[]>([]);
  const [filtreNote, setFiltreNote] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: showDatePicker,
    onOpenChange: setShowDatePicker,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const loadDatas = async () => {
    setIsLoading(true);
    const noms = await getNoteNames();
    setNomNotes(noms);
    const { data: histos } = await getAllHistoriqueNotes();
    setHistoriques(histos || []);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDatas();
  }, []);

  const getActionColor = (action: string) => {
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

  const getActionBadgeColor = (action: string) => {
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d MMMM yyyy, HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const getPreviewText = (historique: HistoriqueNoteDTO) => {
    const contenu =
      historique.apres?.contenu_note || historique.avant?.contenu_note || "";
    const cleanText = contenu.replace(/[#*`>\-\[\]]/g, "").trim();
    return cleanText.length > 150
      ? cleanText.substring(0, 150) + "..."
      : cleanText;
  };

  const isDateInRange = (dateString: string) => {
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
  };

  const historiquesFiltres = historiques.filter((h) => {
    const matchNote =
      !filtreNote || h.nom_note.toLowerCase().includes(filtreNote.toLowerCase());
    const matchDate = isDateInRange(h.created_at);
    return matchNote && matchDate;
  });

  const reinitialiserFiltres = () => {
    setFiltreNote("");
    setStartDate(null);
    setEndDate(null);
  };

  const restaurerVersion = (historiqueId: string) => {
    console.log("Restaurer version:", historiqueId);
  };

  const voirDetails = (historiqueId: string) => {
    console.log("Voir détails:", historiqueId);
  };

  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${format(startDate, "dd/MM/yyyy")} - ${format(
        endDate,
        "dd/MM/yyyy"
      )}`;
    }
    if (startDate) {
      return `Depuis ${format(startDate, "dd/MM/yyyy")}`;
    }
    if (endDate) {
      return `Jusqu'au ${format(endDate, "dd/MM/yyyy")}`;
    }
    return "Sélectionner une date";
  };

  if (isLoading) {
    return <LoadingSpinner text="Chargement des données..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* En-tête */}
        <div className="mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors">
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            Retour au Tableau de bord
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Historique des Révisions des Notes
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visualisez et restaurez les versions précédentes de vos notes.
              Chaque modification est suivie, vous assurant de ne jamais perdre
              une idée.
            </p>
          </div>
        </div>

        {/* Filtres horizontaux */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filtre par note */}
            <div className="flex-1 min-w-64">
              <select
                value={filtreNote}
                onChange={(e) => setFiltreNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Filtrer par note</option>
                {nomNotes.map((nom, index) => (
                  <option key={index} value={nom}>
                    {nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélecteur d'intervalle de dates */}
            <div className="relative">
              <button
                ref={refs.setReference}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm min-w-48"
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                {getDateRangeText()}
              </button>

              {showDatePicker && (
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date de début
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Sélectionner..."
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        dateFormat="dd/MM/yyyy"
                        locale={fr}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Date de fin
                      </label>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || undefined}
                        placeholderText="Sélectionner..."
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        dateFormat="dd/MM/yyyy"
                        locale={fr}
                      />
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton réinitialiser */}
            <button
              onClick={reinitialiserFiltres}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Réinitialiser les filtres
            </button>
          </div>
        </div>

        {/* Timeline centrée avec alternance gauche/droite */}
        <div className="relative">
          {/* Ligne centrale */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-gray-200" />

          {historiquesFiltres.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                Aucun historique trouvé
              </div>
              <p className="text-gray-500">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className="space-y-10">
              {historiquesFiltres.map((historique, index) => {
                const putLeft = index % 2 === 1; // impaire -> gauche, sinon droite
                const Card = (
                  <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow w-full max-w-md">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {historique.nom_note}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
                              historique.action
                            )}`}
                          >
                            {historique.action}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(historique.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => restaurerVersion(historique.id)}
                          className="flex items-center px-3 py-1.5 text-sm text-white bg-gray-800 hover:bg-gray-900 rounded-md transition-colors"
                        >
                          <ArrowPathIcon className="w-4 h-4 mr-1" />
                          Restaurer
                        </button>
                        <button
                          onClick={() => voirDetails(historique.id)}
                          className="flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          Voir les détails
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-md p-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getPreviewText(historique)}
                      </p>
                    </div>

                    {historique.apres && (
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
                        {historique.apres.categorie &&
                          historique.apres.categorie.length > 0 && (
                            <span>
                              Catégories: {historique.apres.categorie.join(", ")}
                            </span>
                          )}
                        {historique.apres.balises &&
                          historique.apres.balises.length > 0 && (
                            <span>
                              Balises: {historique.apres.balises.join(", ")}
                            </span>
                          )}
                      </div>
                    )}
                  </div>
                );

                return (
                  <div key={historique.id} className="relative flex">
                    {/* Colonne gauche */}
                    {putLeft ? (
                      <>
                        <div className="w-1/2 pr-8 flex justify-end">{Card}</div>
                        {/* Placeholder transparent pour la colonne droite */}
                        <div className="w-1/2 pl-8" />
                      </>
                    ) : (
                      <>
                        {/* Placeholder transparent pour la colonne gauche */}
                        <div className="w-1/2 pr-8" />
                        <div className="w-1/2 pl-8 flex justify-start">{Card}</div>
                      </>
                    )}

                    {/* Point sur la ligne centrale */}
                    <div
                      className={`z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white shadow ${getActionColor(
                        historique.action
                      )}`}
                      aria-hidden
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <button className="flex items-center mx-auto text-gray-600 hover:text-gray-800 transition-colors">
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Retour au Tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}

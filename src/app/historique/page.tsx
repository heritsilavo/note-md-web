"use client";
import HistoriqueFilters from "@/components/Historique/HistoriqueFilters";
import HistoriqueFooter from "@/components/Historique/HistoriqueFooter";
import HistoriqueHeader from "@/components/Historique/HistoriqueHeader";
import HistoriqueTimeline from "@/components/Historique/HistoriqueTimeline";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useHistorique } from "@/hooks/useHistorique";

export default function Page() {
  const {
    isLoading,
    nomNotes,
    historiques,
    filters,
    updateFilters,
    actions,
  } = useHistorique();

  const handleRetourTableauBord = () => {
    // Navigation vers le tableau de bord
    console.log("Navigation vers le tableau de bord");
  };

  if (isLoading) {
    return <LoadingSpinner text="Chargement des données..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <HistoriqueHeader/>
        
        <HistoriqueFilters
          nomNotes={nomNotes}
          filters={filters}
          onFilterChange={updateFilters}
          onReset={actions.reinitialiserFiltres}
        />

        <HistoriqueTimeline
          historiques={historiques}
          actions={actions}
        />

        <HistoriqueFooter onRetourTableauBord={handleRetourTableauBord} />
      </div>
    </div>
  );
}
import React from "react";
import HistoriqueCard from "./HistoriqueCard";
import { HistoriqueNoteDTO } from "@/database/historique-dto";
import { HistoriqueActions } from "@/types/historiques.types";

interface HistoriqueTimelineProps {
  historiques: HistoriqueNoteDTO[];
  actions: HistoriqueActions;
}

const HistoriqueTimeline: React.FC<HistoriqueTimelineProps> = ({
  historiques,
  actions,
}) => {
  if (historiques.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">
          Aucun historique trouvé
        </div>
        <p className="text-gray-500">Essayez de modifier vos filtres</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Ligne centrale */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-1 bg-gray-200" />

      <div className="space-y-10">
        {historiques.map((historique, index) => (
          <HistoriqueCard
            key={historique.id}
            historique={historique}
            index={index}
            onRestaurer={actions.restaurerVersion}
            onVoirDetails={actions.voirDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default HistoriqueTimeline;
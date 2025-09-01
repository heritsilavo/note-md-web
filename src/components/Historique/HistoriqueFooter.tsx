import React from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

interface HistoriqueFooterProps {
  onRetourTableauBord?: () => void;
}

const HistoriqueFooter: React.FC<HistoriqueFooterProps> = ({
  onRetourTableauBord,
}) => {
  return (
    <div className="mt-12 text-center">
      <button 
        onClick={onRetourTableauBord}
        className="cursor-pointer flex items-center mx-auto text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        Retour au Tableau de bord
      </button>
    </div>
  );
};

export default HistoriqueFooter;
import React from "react";
import { ArrowPathIcon, EyeIcon } from "@heroicons/react/24/outline";
import { HistoriqueCardProps } from "@/types/historiques.types";
import {
  getActionBadgeColor,
  getPreviewText,
  getActionColor,
  formatDate,
} from "@/utils/historiques.utils";

const HistoriqueCard: React.FC<HistoriqueCardProps> = ({
  historique,
  index,
  onRestaurer,
  onVoirDetails,
}) => {
  const putLeft = index % 2 === 1;

  const CardContent = (
    <div className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow w-full max-w-md flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900">
            {historique.nom_note}
          </h3>
          <div className="flex flex-col items-start gap-1 mt-1">
            <span className="text-sm text-gray-500">
              {formatDate(historique.created_at)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(
                historique.action
              )}`}
            >
              {historique.action}
            </span>

          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 shrink-0">
          {
            (historique.action != "SYNCHRONISATION") && <button
              onClick={() => onRestaurer(historique.id)}
              className="cursor-pointer flex items-center px-3 py-1.5 text-sm text-white bg-gray-800 hover:bg-gray-900 rounded-md transition-colors shadow-sm"
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Restaurer
            </button>
          }
          <button
            onClick={() => onVoirDetails(historique.id)}
            className="cursor-pointer flex items-center px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            Voir
          </button>
        </div>
      </div>

      {/* CONTENU */}
      <div className="bg-gray-50 rounded-md p-3 overflow-hidden">
        <p className="text-sm text-gray-700 leading-relaxed">
          {getPreviewText(historique)}
        </p>
      </div>

      {/* FOOTER (catégories + balises) */}
      {historique.apres && (
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 border-t pt-2">
          {historique.apres.categorie?.length > 0 && (
            <span>
              <span className="font-medium text-gray-600">Catégories:</span>{" "}
              {historique.apres.categorie.join(", ")}
            </span>
          )}
          {historique.apres.balises?.length > 0 && (
            <span>
              <span className="font-medium text-gray-600">Balises:</span>{" "}
              {historique.apres.balises.join(", ")}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex">
      {putLeft ? (
        <>
          <div className="w-1/2 pr-8 flex justify-end">{CardContent}</div>
          <div className="w-1/2 pl-8" />
        </>
      ) : (
        <>
          <div className="w-1/2 pr-8" />
          <div className="w-1/2 pl-8 flex justify-start">{CardContent}</div>
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
};

export default HistoriqueCard;

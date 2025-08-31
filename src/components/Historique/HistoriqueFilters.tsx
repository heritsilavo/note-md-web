import React, { useState } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import HistoriqueDatePicker from "./HistoriqueDatePicker"
import { HistoriqueFiltersProps } from "@/types/historiques.types";

const HistoriqueFilters: React.FC<HistoriqueFiltersProps> = ({
  nomNotes,
  filters,
  onFilterChange,
  onReset,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleNoteFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ filtreNote: e.target.value });
  };

  const handleDateRangeChange = (dateRange: { startDate: Date | null; endDate: Date | null }) => {
    onFilterChange({ dateRange });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
      <div className="flex flex-wrap items-center gap-4">
        {/* Filtre par note */}
        <div className="flex-1 min-w-64">
          <select
            value={filters.filtreNote}
            onChange={handleNoteFilterChange}
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
        <HistoriqueDatePicker
          dateRange={filters.dateRange}
          onDateRangeChange={handleDateRangeChange}
          showDatePicker={showDatePicker}
          onToggleDatePicker={setShowDatePicker}
        />

        {/* Bouton réinitialiser */}
        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
        >
          <FunnelIcon className="w-4 h-4 mr-2" />
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

export default HistoriqueFilters;
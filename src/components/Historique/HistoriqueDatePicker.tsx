import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import DatePicker from "react-datepicker";
import { useFloating, autoUpdate, offset, flip, shift } from "@floating-ui/react";
import { fr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { DatePickerComponentProps } from "@/types/historiques.types";
import { getDateRangeText } from "@/utils/historiques.utils";

const HistoriqueDatePicker: React.FC<DatePickerComponentProps> = ({
  dateRange,
  onDateRangeChange,
  showDatePicker,
  onToggleDatePicker,
}) => {
  const { refs, floatingStyles } = useFloating({
    open: showDatePicker,
    onOpenChange: onToggleDatePicker,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const handleStartDateChange = (date: Date | null) => {
    onDateRangeChange({
      ...dateRange,
      startDate: date,
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    onDateRangeChange({
      ...dateRange,
      endDate: date,
    });
  };

  return (
    <div className="relative">
      <button
        ref={refs.setReference}
        onClick={() => onToggleDatePicker(!showDatePicker)}
        className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm min-w-48"
      >
        <CalendarIcon className="w-4 h-4 mr-2" />
        {getDateRangeText(dateRange.startDate, dateRange.endDate)}
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
                selected={dateRange.startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
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
                selected={dateRange.endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                minDate={dateRange.startDate || undefined}
                placeholderText="Sélectionner..."
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                dateFormat="dd/MM/yyyy"
                locale={fr}
              />
            </div>
            <button
              onClick={() => onToggleDatePicker(false)}
              className="w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoriqueDatePicker;
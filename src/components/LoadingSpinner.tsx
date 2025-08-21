import React from "react";

export default function LoadingSpinner({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <span className="text-blue-700 font-semibold text-lg">{text}</span>
    </div>
  );
}

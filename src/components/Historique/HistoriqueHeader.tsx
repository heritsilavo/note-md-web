import React from "react";

const HistoriqueHeader = () => {
  return (
    <div className="mb-8">

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
  );
};

export default HistoriqueHeader;
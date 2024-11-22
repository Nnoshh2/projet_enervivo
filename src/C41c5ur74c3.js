 import React from 'react';

const ParcelleSurface = ({ data }) => {
  // Vérifie si la donnée existe et a la structure attendue
  const contenance = data?.features?.[0]?.properties?.contenance;

  // Conversion en hectares
  const contenanceHectares = contenance ? (contenance / 10000).toFixed(2) : null;

  return (
    <div>
      {contenanceHectares !== null ? (
        <p>Surface de la parcelle : {contenanceHectares} ha</p>
      ) : (
        <p>Aucune donnée de surface disponible</p>
      )}
    </div>
  );
};

export default ParcelleSurface;

import React from 'react';

const NumeroParcelle = ({ data }) => {
  // Vérifie si les données existent et ont la structure attendue
  const section = data?.features?.[0]?.properties?.section;
  const numero = data?.features?.[0]?.properties?.numero;

  // Concatène les deux valeurs si elles sont définies
  const numeroComplet = section && numero ? `${section}${numero}` : null;

  return (
    <div>
      {numeroComplet ? (
        <p>Numéro complet de la parcelle : {numeroComplet}</p>
      ) : (
        <p>Informations de la parcelle non disponibles</p>
      )}
    </div>
  );
};

export default NumeroParcelle;

// GlobalContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer le contexte global
const GlobalContext = createContext();

// Fournisseur de contexte pour stocker les informations
export const GlobalProvider = ({ children }) => {
  // Définir l'état global (dans cet exemple, des champs de formulaire)
  const [formData, setFormData] = useState({
    typeHangar: '',          // Ex : Type de hangar
    surfaceHangar: '',       // Ex : Surface du hangar
    totalSurface:'',    // Ajoutez ici d'autres champs de données à stocker
  });

  // Fonction pour mettre à jour l'état des champs
  const updateFormData = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <GlobalContext.Provider value={{ formData, updateFormData }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook personnalisé pour accéder au contexte dans d'autres composants
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

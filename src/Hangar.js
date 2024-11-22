import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

const Hangar = forwardRef(({onSurfacehangarUpdate,onTypeHangarUpdate}, ref) => { 
  const [surfaceHangar, setSurfHangar] = useState('');
  const [typeHangar, setTypeHangar] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
  };

  const handleButtonClick1 = () => {
    navigate('/stepchoice'); // Redirige vers la page étape-2
  };

  const localisation = 'sans localisation';
  const totalSurface = 'Projet de hangar, pas de surface agriPV';
  const numParcelles = 'pas de parcelles, projet de hangar';

  const handleButtonClick2 = () => {
    // Vérifier si le type de hangar est sélectionné

    if (!typeHangar) {
      setShowErrorMessage(true); // Affiche le message d'erreur
      
    } else {
      setShowErrorMessage(false); // Réinitialiser l'erreur
      navigate('/etape-2', {
        state: {localisation, totalSurface, typeHangar, surfaceHangar, numParcelles}, // Passe les données à l'étape suivante
      }); // Rediriger si le champ est rempli
    }
  };

  return (
    <div className="home-container">
      <div className="left-container">
        <div className="left-image">
          <img src="/hangar.jpg" alt="Image d'illustration" className="left-image" />
        </div>
      </div>
      <div className="right-container">
        <div className="text-container">
          <div className="image-banner">
            <img src="logo_enervivo.png" alt="Image banner" className="banner-image" />
          </div>
          <h1>Parlons de votre futur hangar !</h1>
          <h2>Nous vous recontacterons pour discuter plus en détail de votre projet.</h2>
          <p></p>
          <form className="form-container" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="typehangar">Type de hangar *</label>
              <select
                ref={ref} // Attachement du ref à l'élément select
                id="typehangar"
                name="typehangar"
                value={typeHangar} // Valeur sélectionnée dans la liste déroulante
                onChange={(e) => {
                  setTypeHangar(e.target.value);
                  setShowErrorMessage(false); // Réinitialise l'erreur dès que l'utilisateur fait un choix
                }}
              >
                <option value="">Sélectionnez un type</option>
                <option value="monopente">Monopente</option>
                <option value="bipente">Bipente</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="surfacehangar">Superficie souhaitée (m²) *</label>
              <input
                ref={ref} // Attachement du ref à l'élément input
                type="text"
                id="surfacehangar"
                name="surfacehangar"
                placeholder="Entrez la superficie souhaitée"
                value={surfaceHangar}
                onChange={(e) => {setSurfHangar(e.target.value)}}
              />
            </div>
          </form>
          <p></p>

          {/* Afficher le message d'erreur uniquement si nécessaire */}
          {showErrorMessage && (
            <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>
              Vous devez sélectionner un type de hangar.
            </p>
          )}
          <p></p>
          <div className="position_boutons_p2">
            <button className="previous-button" onClick={handleButtonClick1}>
              Précédent
            </button>
            <button className="next-button" onClick={handleButtonClick2}>
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Hangar;

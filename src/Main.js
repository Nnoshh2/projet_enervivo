 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/

import React, { useRef, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import MapComponent from './MapComponent';
import AddressCompletion from './AddressCompletion';

function Main() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [localisation, setLocalisation] = useState([]);
  
  const handleButtonClick1 = () => {
    navigate('/stepchoice');
  };

  const typeHangar = 'pas de hangar, projet agriPV'
  const surfaceHangar = 'pas de surface, projet agriPV'

  const handleButtonClick2 = () => {
    if (totalSurface < 1) {
      setShowErrorMessage(true);
    } else {
      navigate('/etape-2',{
        state: {localisation, totalSurface, typeHangar, surfaceHangar, numParcelles}, 
      });
    }
  };

  const handleMapClick = (coordinate, params) => {
  };

  useEffect(() => {
    const addressInput = document.getElementById('address-input');
    addressInput.addEventListener('address_selected', (event) => {
      const { latitude, longitude } = event.detail;
      setLocalisation([latitude, longitude]);
      console.log('Address selected:', latitude, longitude);
      if (mapRef.current) {
        mapRef.current.centerMapTo(latitude, longitude);
      }

    });

    return () => {
      addressInput.removeEventListener('address_selected', () => {});
    };
  }, []);

  const [totalSurface, setTotalSurface] = useState(0);

  const handleSurfaceUpdate = (surface) => {
    setTotalSurface(surface);
  };

  const [numParcelles, setNumParcelles] = useState(0);
  const handleNumParcellesUpdate = (parcelles) => {
    setNumParcelles(parcelles);
  };

  const safeNumParcelles = Array.isArray(numParcelles) ? numParcelles : [];

  return (
    <div className="home-container">
      <div className="left-container">
          <MapComponent ref={mapRef} className="map" onMapClick={handleMapClick} onSurfaceUpdate={handleSurfaceUpdate} onNumParcellesUpdate={handleNumParcellesUpdate} />
      </div>
      <div className="right-container">
        <h1>Où se situe votre terrain ?</h1>
        <h2>Entrez votre adresse pour faciliter la sélection de vos parcelles cadastrales </h2>
        <div class="">
          <input
            class="addressbar-input"
            id="address-input"
            type="text"
            placeholder="Recherchez votre adresse..."
          />
          <div id="suggestions-container"></div> 
          <AddressCompletion
            containerId="address-input"
            suggestionsContainerId="suggestions-container"
          />
        </div>
        <p></p>
        <h2>Sélectionnez/Déselectionnez vos parcelles en cliquant dessus, tout simplement !</h2>
        <div className="num_parcelles">
          {safeNumParcelles.map((parcelle, index) => (
            <div key={index} className="parcelle_container">
              Parcelle {parcelle}
            </div>
            ))}
        </div>
        <div className = "surf_parcelles">
          <div>{totalSurface} ha</div>
        </div>
        <br></br>
        <div className="position_boutons_p2">
          <button className="previous-button" onClick={handleButtonClick1}>Précédent</button>
          <button className="next-button" onClick={handleButtonClick2}>
            Suivant 
          </button>
          </div>
          {showErrorMessage && (
            <p className="error-message">
              La surface totale doit être supérieure à 1 hectare pour continuer.
            </p>
          )}
      </div>
    </div>
  );
}
export default Main;

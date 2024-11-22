 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/

import React, { useRef, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';



function Step3() { 
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault(); 
    };

    const handleButtonClickE = () => {
        window.location.href = 'https://enervivo.fr'; 
      };

      return (
        <div className="home-container">
          <div className='left-container'>
            <img src="/image_ovin_agripv2.jpg" alt="Image d'illustration" className="home-image" />
          </div>
          <div className='right-container'>
            <div className="text-container">
              <div className="image-banner">
                  <img src="logo_enervivo.png" alt="Image banner" className="banner-image" />
                </div>
              <h1>Mail envoyé !</h1>
              <h2>Nous allons vous recontacter rapidement !</h2>
              
              <p></p>
              <p></p>
              <div className="position_boutons_p2">
              <button onClick={handleButtonClickE}>Retour au site Enervivo</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

export default Step3;

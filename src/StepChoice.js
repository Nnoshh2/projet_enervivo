 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/

import React, { useRef, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

function StepChoice() { 
    const navigate = useNavigate();

    const [image, setImage] = useState("/image_base.png"); 

    const handleButtonClick1 = () => {
        navigate('/hangar'); 
      };
    
    const handleButtonClick2 = () => {
        navigate('/main'); 
      };


      const handleMouseEnter1 = () => {
        setImage("/hangar.jpg"); 
      };
    
      const handleMouseLeave1 = () => {
        setImage("/image_base.png"); 
      };
    
      const handleMouseEnter2 = () => {
        setImage("/image_ovin_agripv.jpg"); 
      };
    
      const handleMouseLeave2 = () => {
        setImage("/image_base.png"); 
      };



      return (
        <div className="home-container">
          <div className='left-container'>
            <div className='left-image'>
            <img src={image} alt="Image d'illustration" className="left-image" />
            </div>
          </div>
          <div className='right-container'>
            <div className="text-container">
              <div className="image-banner">
                  <img src="logo_enervivo.png" alt="Image banner" className="banner-image" />
                </div>
              <h1>Quel est le type de projet qui vous intéresse ?</h1>
              <h2>EnerVivo propose 2 principaux types de projet, soumis à évaluation du Bureau d'Etudes d'EnerVivo : un hangar entièrement financé, ou un projet agrivoltaïque pour protéger vos cultures et vous fournir un revenu complémentaire.</h2>
              
              <p></p>
              <div className="position_boutons_p2">
              <button className="next-button" onClick={handleButtonClick1} onMouseEnter={handleMouseEnter1} 
          onMouseLeave={handleMouseLeave1}>Je veux un hangar</button>
              <button className="next-button" onClick={handleButtonClick2} onMouseEnter={handleMouseEnter2} 
          onMouseLeave={handleMouseLeave2}>Je veux un projet agrivoltaïque</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
export default StepChoice;
// Home.js
 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/




import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';


function Home() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/stepchoice'); 
  };

  return (
    <div className="home-container">
      <div className='left-container'>
        <img src="/IMG20220822080722.jpg" alt="Image d'illustration" className="home-image" />
      </div>
      <div className='right-container'>
        <div className="text-container">
          <div className="image-banner">
              <img src="logo_enervivo.png" alt="Image banner" className="banner-image" />
            </div>
          <h1>Prêt à simuler votre installation ?</h1>
          <p className="description">
            <h2>Nous allons vous poser 1 unique question à propos de votre projet. </h2>
            <h3>Durée estimée : 1 min !</h3>
          </p>
          <p className="contact-info">
            <h2>Suivez les instructions sur les prochaines pages ! Si vous rencontrez le moindre problème n’hésitez pas à nous contacter au 06 26 23 92 73.</h2>
          </p>
          <button className="next-button" onClick={handleButtonClick}>C'est parti !</button>
        </div>
      </div>
    </div>
  );
}

export default Home;

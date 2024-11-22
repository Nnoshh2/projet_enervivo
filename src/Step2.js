 /* Application web codée en React par Noé LAROCHE pour EnerVivo
 Pour toute question ou renseignement : laroche.noe@orange.fr*/

import React, { useRef, useEffect,useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './Main.css';
import MapComponent from './MapComponent';

function Step2() { 
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [telephone, setTelephone] = useState('');
    const navigate = useNavigate();
    
    
    const location = useLocation();
    const {localisation, totalSurface, typeHangar, surfaceHangar, numParcelles} = location.state || {}; // Récupère les données de l'étape précédente


    const handleSubmit = (e) => {
      e.preventDefault();
    };

    const handleButtonClick1 = () => {
        navigate('/stepchoice');
      };
    
    const [emailSent, setEmailSent] = useState(false);

    const handleSendEmail = () => {
      SendEmail1();
      SendEmail2();
    };

    const SendEmail1 = async () => {
      try {
        const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: `${email}`,
            subject: 'Votre projet agrivoltaïque avec EnerVivo',
            html: `
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  /* Styles en ligne sont préférables pour les e-mails */
                  body {
                    font-family: Arial, sans-serif; /* Polices standard en fallback */
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #fffef8;
                  }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fffef8;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    font-size: 24px;
                    color: #1C7862;
                    text-align: center;
                  }
                  p {
                    margin: 10px 0;
                    font-size: 16px;
                  }
                  ul {
                    margin: 10px 0;
                    padding-left: 20px;
                  }
                  ul li {
                    margin: 5px 0;
                    font-size: 16px;
                  }
                  a {
                    color: #00B685;
                    text-decoration: none;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
                  .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #555;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Bonjour ${prenom} !,</h1>
                  <p>
                    Nous vous remercions d’avoir pris le temps de remplir notre formulaire et de vous intéresser aux solutions agrivoltaïques proposées par <strong>EnerVivo</strong>.
                  </p>
                  <p>
                    Chez EnerVivo, nous accompagnons les agriculteurs dans la valorisation de leurs terrains et bâtiments grâce à des installations photovoltaïques adaptées à leurs besoins. Notre objectif est de vous offrir une solution clé en main, durable et rentable, tout en contribuant à la transition énergétique.
                  </p>
                  <h2>Prochaines étapes :</h2>
                  <ul>
                    <li><strong>Analyse de votre projet :</strong> Nous examinons les informations que vous nous avez fournies pour évaluer la faisabilité et les opportunités de votre projet.</li>
                    <li><strong>Prise de contact personnalisée :</strong> Le chargé de développement responsable de votre projet vous contactera sous peu pour discuter de vos attentes et répondre à vos questions.</li>
                    <li><strong>Proposition sur mesure :</strong> Nous élaborerons une offre adaptée à votre activité et à vos ambitions.</li>
                  </ul>
                  <p>
                    En attendant, n’hésitez pas à consulter notre site web : 
                    <a href="https://enervivo.fr" target="_blank">enervivo.fr</a> 
                    ou à nous contacter directement si vous avez des questions ou souhaitez en savoir plus.
                  </p>
                  <p>
                    Nous sommes ravis de vous accompagner dans cette démarche et de contribuer ensemble à un avenir plus vert et responsable.
                  </p>
                  <p>
                    <strong>Cordialement,</strong><br>
                    L'équipe de développement d'EnerVivo
                  </p>
                  <p style="text-align: center; margin-top: 20px;">
                    <img src="https://enervivo.fr/wp-content/uploads/2022/09/2_Logotype_vert-foret-e1664460441226.png" alt="Logo EnerVivo" style="width: 150px; height: auto;">
                  </p>
                  <div class="footer">
                    <p>&copy; 2024 EnerVivo - Tous droits réservés</p>
                  </div>
                </div>
              </body>
            </html>

            `,
          }),
        });

        if (response.ok) {
          setEmailSent(true);
          navigate('/etape-3'); 
        } else {
          alert('Erreur lors de l\'envoi de l\'e-mail.');
        }
      } catch (error) {
        console.error('Erreur :', error);
      }
      };

      
    const SendEmail2 = async () => {
      try {
        const response = await fetch('http://localhost:5000/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: `laroche.noe@orange.fr`,
            subject: 'Nouveau prospect',
            html: `
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  /* Styles en ligne sont préférables pour les e-mails */
                  body {
                    font-family: Arial, sans-serif; /* Polices standard en fallback */
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    background-color: #fffef8;
                  }
                  .container {
                    max-width: 600px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fffef8;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    font-size: 24px;
                    color: #1C7862;
                    text-align: center;
                  }
                  p {
                    margin: 10px 0;
                    font-size: 16px;
                  }
                  ul {
                    margin: 10px 0;
                    padding-left: 20px;
                  }
                  ul li {
                    margin: 5px 0;
                    font-size: 16px;
                  }
                  a {
                    color: #00B685;
                    text-decoration: none;
                  }
                  a:hover {
                    text-decoration: underline;
                  }
                  .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #555;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>Informations prospect :</h1>
                  <p>
                  Prenom : ${prenom}<br>
                  Nom : ${nom}<br>
                  Email : ${email}<br>
                  Telephone : ${telephone}<br>
                  Localisation : ${localisation}<br>
                  Surface : ${totalSurface}<br>
                  Numéros de parcelles : ${numParcelles}<br>
                  Surface hangar : ${surfaceHangar}<br>
                  Type de hangar : ${typeHangar}<br>
                  
                  </p>
                  
                  
                  <div class="footer">
                    <p>&copy; 2024 EnerVivo - Tous droits réservés - Informations confidentielles</p>
                  </div>
                </div>
              </body>
            </html>

            `,
          }),
        });

        if (response.ok) {
          setEmailSent(true);
          navigate('/etape-3');
        } else {
          alert('Erreur lors de l\'envoi de l\'e-mail.');
        }
      } catch (error) {
        console.error('Erreur :', error);
      }
      };

      return (
        
        <div className="home-container">
      <div className='left-container'>
            <div className='left-image'>
            <img src="/image_ovin_agripv2.jpg" alt="Image d'illustration" className="left-image" />
            </div>
          </div>
          <div className='right-container'>
            <div className="text-container">
              <div className="image-banner">
                  <img src="logo_enervivo.png" alt="Image banner" className="banner-image" />
                </div>
              <h1>Quelles sont vos coordonnées ?</h1>
              <h2>Vous recevrez un récapitulatif directement dans votre boîte mail !</h2>
              <form className="form-container" onSubmit={handleSubmit}>
                  <div className="input-group">
                      <label htmlFor="prenom">Prénom *</label>
                      <input
                          type="text"
                          id="prenom"
                          name="prenom"
                          placeholder="Entrez votre prénom"
                          value={prenom}
                          onChange={(e) => setPrenom(e.target.value)}
                      />
                  </div>
                  <div className="input-group">
                      <label htmlFor="nom">Nom *</label>
                      <input
                          type="text"
                          id="nom"
                          name="nom"
                          placeholder="Entrez votre nom"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                      />
                  </div>
                  <div className="input-group">
                      <label htmlFor="email">Email *</label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Entrez votre email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                      />
                  </div>
                  <div className="input-group">
                      <label htmlFor="telephone">Numéro de téléphone *</label>
                      <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          placeholder="Entrez votre téléphone"
                          value={telephone}
                          onChange={(e) => setTelephone(e.target.value)}
                      />
                  </div>
              </form>
              <p></p>
              <p></p>
              <div className="hiddenmap">
              <MapComponent style={{ display: 'none' }}/>
              </div>
              <div className="position_boutons_p2">
              <button className="previous-button" onClick={handleButtonClick1}>Précédent</button>
              <button className="next-button" onClick={handleSendEmail}>Envoyer mon dossier !</button>
              </div>
              <div className='confidentiel'>
              En remplissant ce formulaire, vous consentez à ce que EnerVivo collecte et utilise les données personnelles que vous avez fournies, telles que votre nom, prénom, adresse email et informations de projet, dans le cadre de notre activité. Ces données sont utilisées exclusivement pour vous contacter, répondre à vos demandes, vous proposer des solutions adaptées et vous tenir informé de nos services. EnerVivo s'engage à respecter la confidentialité de vos informations et à les protéger conformément à la législation en vigueur sur la protection des données personnelles. Vos données ne seront en aucun cas partagées avec des tiers à des fins commerciales sans votre consentement préalable. Vous pouvez à tout moment accéder à vos données, les rectifier ou demander leur suppression en nous contactant à l'adresse suivante : contact@enervivo.fr. En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
              </div>

            </div>
          </div>
        </div>
      );
    }
export default Step2;
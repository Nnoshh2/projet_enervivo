const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: '805d9a001@smtp-brevo.com', 
      pass: 'cK5CEw1U43fL7rXW'      
    }
  });

// Route pour envoyer des e-mails
app.post('/send-email', (req, res) => {
  const { to, subject, html } = req.body;

  const mailOptions = {
    from: 'contact@enervivo.fr',
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'email :', error);
      res.status(500).send('Erreur lors de l\'envoi de l\'email.');
    } else {
      console.log('Email envoyé :', info.response);
      res.status(200).send('Email envoyé avec succès.');
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
});

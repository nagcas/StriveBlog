// Definizione della funzione middleware per il controllo dell'email
const controlEmail = (req, res, next) => {
  // Email autorizzata (hardcoded)
  const email = 'autorizzato@gmail.com';
  
  // Estrazione dell'email dell'utente dagli headers della richiesta
  const emailUser = req.headers['user-email'];

  // Confronto tra l'email autorizzata e quella dell'utente
  if (email === emailUser) {
    // Se le email corrispondono, passa al prossimo middleware
    next();
  } else {
    // Se le email non corrispondono, invia una risposta di errore
    res.status(403).json({ message: 'Unauthorized user...' });
  }
};

// Esportazione della funzione middleware
export default controlEmail;
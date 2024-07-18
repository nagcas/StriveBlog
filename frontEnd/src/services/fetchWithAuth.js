const fetchWithAuth = async (url, options = {}) => {
  // Recupera il token dal localStorage
  const token = localStorage.getItem("token");

  // Prepara gli headers di default, includendo il Content-Type
  const headers = {
    // Spread degli headers esistenti
    ...options.headers,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // Se esiste un token, lo aggiunge agli headers
  if (token) {
    // Aggiunge l'header di autorizzazione con il token
    headers['Authorization'] = `Bearer ${token}`;
    // Log del token per debugging
    console.log("Token inviato:", token);
  }

  try {
    // Effettua la richiesta fetch con gli headers e le opzioni fornite
    const response = await fetch(url, {
      // Spread delle opzioni esistenti
      ...options,
      // Aggiunge gli headers preparati
      headers,
    });

    // Verifica se la risposta è ok (status 200-299)
    if (!response.ok) {
      // Lancia un errore se la risposta non è ok
      throw new Error('Errore nella richiesta');
    }

    // Converte la risposta in JSON
    return await response.json();
  } catch (error) {
    console.error('Errore nella richiesta:', error);
    throw error; // Rilancia l'errore per gestirlo dove viene chiamata la funzione
  }
};

export default fetchWithAuth;

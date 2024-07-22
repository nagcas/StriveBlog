// Importa useState da React per gestire lo stato locale
import { useState } from 'react';
// Importa il contesto creato per la gestione dell'autenticazione e dello stato dell'utente
import { Context } from './Context.js';

// Componente AuthProvider che fornisce lo stato di autenticazione e l'autore ai componenti figli
export const AuthProvider = ({ children }) => {

  // Stato per memorizzare i dettagli dell'autore/log-in
  const [authorLogin, setAuthorLogin] = useState({});
  // Stato per gestire se l'utente è loggato o meno
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    // Provider del contesto che rende disponibili i valori agli altri componenti
    <Context.Provider value={{ 
      authorLogin,  // Dettagli dell'autore attualmente loggato
      setAuthorLogin,  // Funzione per aggiornare i dettagli dell'autore
      isLoggedIn,  // Stato che indica se l'utente è loggato
      setIsLoggedIn  // Funzione per aggiornare lo stato di login dell'utente
    }}>
      {children}
    </Context.Provider>
  );
};




// Importa createContext da React per creare contesti condivisi
import { createContext } from 'react';

// Crea un contesto per l'autenticazione e lo stato dell'utente
// Questo contesto può essere utilizzato per fornire e consumare dati relativi all'autenticazione dell'utente
export const Context = createContext();

// Crea un contesto per la gestione del tema dell'applicazione
// Questo contesto può essere utilizzato per fornire e consumare i dati relativi al tema (es. 'light' o 'dark')
export const ThemeContext = createContext();

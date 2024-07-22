import './BlogFooter.css'; // Importa il file CSS per gli stili del footer

import React, { useContext } from 'react'; // Importa React e il hook useContext
import { Container } from 'react-bootstrap'; // Importa Container da React-Bootstrap per la disposizione del layout
import { ThemeContext } from '../../modules/Context'; // Importa il contesto per il tema

const Footer = (props) => {
  // Utilizza il contesto per ottenere il tema attuale
  const [themeCtx] = useContext(ThemeContext);

  return (
    // Imposta la classe del footer in base al tema corrente
    <footer className={'bg-' + themeCtx + ' d-flex align-items-center text-center footer'}>
      <Container 
        // Imposta le classi del Container in base al tema corrente
        className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link' : 'text-dark text-center nav-link px-2 item-link'}
      >
        {/* Mostra l'anno corrente e il copyright */}
        {`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}
      </Container>
    </footer>
  );
};

export default Footer; // Esporta il componente Footer


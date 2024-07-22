import './NotFound.css'; // Importa gli stili per la pagina di errore 404.

import React from 'react'; // Importa React.
import { Button, Container } from 'react-bootstrap'; // Importa i componenti di Bootstrap.
import { Link } from 'react-router-dom'; // Importa il componente Link per la navigazione.
import video from '../../assets/Video WhatsApp 2024-07-19 ore 23.51.01_93b88d2d.mp4'; // Importa il video da visualizzare.

function NotFound() {
  return (
    <Container className='page-not-found'> {/* Contenitore principale con classe per stili specifici */}
      <div className='content'> {/* Contenitore per il contenuto della pagina */}
        <video width='80%' height='auto' controls autoPlay muted loop> {/* Video incorporato */}
          <source src={video} type='video/mp4' /> {/* Sorgente del video */}
          Your browser does not support the video tag. {/* Messaggio di fallback se il browser non supporta i video */}
        </video>
        <h5>by Maria Alessandra Chiaravalloti 🥰🥰🥰</h5> {/* Credito del video */}
        <h4>Opps! Page not found</h4> {/* Titolo dell'errore 404 */}
        <p>Sorry, the page you're looking for doesn't exist.</p> {/* Messaggio di errore */}
        <Button
          as={Link} // Usa il componente Link per la navigazione.
          to='/' // Percorso della home page.
          variant='dark' // Variante scura per il pulsante.
          className='btn-standard' // Classe per gli stili personalizzati del pulsante.
        >
          Back to Home {/* Testo del pulsante */}
        </Button>
      </div>
    </Container>
  );
};

export default NotFound; // Esporta il componente NotFound.

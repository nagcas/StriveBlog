import './Home.css'; // Importa gli stili per il componente Home.

import React, { useContext } from 'react'; // Importa React e il hook useContext.
import { Container } from 'react-bootstrap'; // Importa il componente Container di Bootstrap.
import BlogList from '../../components/blog/blog-list/BlogList'; // Importa il componente per la lista dei blog.
import HeroBlog from '../../components/Hero/HeroBlog'; // Importa il componente dell'eroe del blog.
import { ThemeContext } from '../../modules/Context'; // Importa il contesto per il tema.

const Home = ({ search, handleSearch }) => {

  // Usa il contesto per ottenere e aggiornare il tema corrente.
  const [themeCtx, setThemeCtx] = useContext(ThemeContext);
  
  return (
    <>
      <HeroBlog search={search} handleSearch={handleSearch} /> {/* Mostra il componente HeroBlog con le proprietà di ricerca e gestione della ricerca */}
      <Container fluid='sm' bg={themeCtx} data-bs-theme={themeCtx}> {/* Contenitore con classe Bootstrap e tema dinamico */}
        <BlogList search={search} handleSearch={handleSearch} /> {/* Mostra la lista dei blog con le proprietà di ricerca e gestione della ricerca */}
      </Container>
    </>  
  );
};

export default Home; // Esporta il componente Home.


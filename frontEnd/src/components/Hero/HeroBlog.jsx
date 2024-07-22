import './HeroBlog.css'; // Importa il file CSS per gli stili della sezione hero

import SearchPosts from '../Search/SearchPosts'; // Importa il componente di ricerca dei post
import { Container } from 'react-bootstrap'; // Importa Container da React-Bootstrap per il layout responsive

function HeroBlog({ search, handleSearch }) {
  
  return (
    <Container fluid className='hero-section'>
      {/* Contenitore principale della sezione hero */}
      <div className='hero-content'>
        {/* Titolo della sezione hero */}
        <h1>Welcome Strive Blog</h1>
        {/* Descrizione della sezione hero */}
        <p>
          Discover articles, stories and insights on the world of technology, health, science and much more.
        </p>
        {/* Componente per la ricerca dei post */}
        <SearchPosts search={search} handleSearch={handleSearch} />
      </div>
    </Container>
  );
};

export default HeroBlog; // Esporta il componente HeroBlog

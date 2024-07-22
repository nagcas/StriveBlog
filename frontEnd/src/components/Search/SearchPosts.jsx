// Importazione dei componenti necessari da React-Bootstrap e icone da react-icons
import { useContext } from 'react';
import { Container, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { ThemeContext } from '../../modules/Context';

// Componente per la ricerca dei post
function SearchPosts({ search, handleSearch }) {

  // Ottieni il contesto del tema corrente
  const [themeCtx, setThemeCtx] = useContext(ThemeContext);

  return (
    <Container bg={themeCtx} data-bs-theme={themeCtx}>
      {/* Gruppo di input per la ricerca */}
      <InputGroup>
        {/* Icona della ricerca, viene visualizzata all'interno dell'InputGroup */}
        <InputGroup.Text className='btn-standard'>
          <FaSearch />
        </InputGroup.Text>

        {/* Campo di input per la ricerca */}
        <Form.Control
          type='search' 
          aria-label='input search'  // Descrizione per gli screen reader
          placeholder='Search by post and author...'  // Testo mostrato quando il campo è vuoto
          value={search}  // Valore attuale del campo di input, passato come prop
          onChange={handleSearch}  // Funzione di callback chiamata quando il valore cambia
          className='me-3 btn-standard'  // Classi CSS per styling
        />
      </InputGroup>
    </Container>
  );
}

export default SearchPosts;

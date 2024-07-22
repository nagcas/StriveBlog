// Importazione dei componenti necessari da React-Bootstrap
import { useContext } from 'react';
import { Container, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { ThemeContext } from '../../modules/Context';


function SearchPosts({ search, handleSearch }) {

  const [themeCtx, setThemeCtx] = useContext(ThemeContext);

  return (
    <Container bg={themeCtx} data-bs-theme={themeCtx}>
      <InputGroup>
        <InputGroup.Text className='btn-standard'><FaSearch /></InputGroup.Text>
        <Form.Control
          type='search' 
          aria-label='input seacrh'
          placeholder='Search by post and author...' 
          value={search} 
          onChange={handleSearch}
          className='me-3 btn-standard'
        />
      </InputGroup>
    </Container>
  );
}

export default SearchPosts;
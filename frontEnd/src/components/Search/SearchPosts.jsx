// Importazione dei componenti necessari da React-Bootstrap
import { Container, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';


function SearchPosts({ search, handleSearch }) {
  return (
    <Container>
      <InputGroup>
        <InputGroup.Text><FaSearch /></InputGroup.Text>
        <Form.Control
          type='search' 
          aria-label='input seacrh'
          placeholder='Search posts...' 
          value={search} 
          onChange={handleSearch}
          className='me-3'
        />
      </InputGroup>
    </Container>
  );
}


export default SearchPosts;
import './HeroBlog.css';

import SearchPosts from '../Search/SearchPosts';
import { Container } from 'react-bootstrap';

function HeroBlog({ search, handleSearch }) {
  
  return (
    <Container fluid className='hero-section'>
      <div className='hero-content'>
        <h1>Welcome Strive Blog</h1>
        <p>
        Discover articles, stories and insights on the world of technology, health, science and much more.</p>
      <SearchPosts search={search} handleSearch={handleSearch} />
      </div>
    </Container>
  );
};

export default HeroBlog;
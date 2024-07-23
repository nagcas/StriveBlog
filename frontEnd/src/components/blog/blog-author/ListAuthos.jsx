import './BlogAuthor.css';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Container, Col, Image, Pagination, Row, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ViewAuthor from './ViewAuthor';
import fetchWithAuth from '../../../services/fetchWithAuth';
import defaultAvatar from '../../../assets/default-avatar.jpg';
import { Context } from '../../../modules/Context.js';

const BlogAuthor = () => {
  // Accesso allo stato di login dal contesto globale
  const { isLoggedIn } = useContext(Context);

  // Definizione dell'URL API con fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Stati per gestire gli autori, lo spinner e la paginazione
  const [authors, setAuthors] = useState([]);
  const [isSpinner, setIsSpinner] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(16);
  const [totalAuthor, setTotalAuthor] = useState('');

  // Funzione per recuperare gli autori dall'API
  const getFetchAuthor = useCallback(async () => {
    setIsSpinner(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/authors?page=${currentPage}&limit=${limit}`);
      setAuthors(response.authors);
      setTotalPages(response.totalPages);
      setTotalAuthor(response.totalAuthors);
    } catch (error) {
      console.error('Error calling endpoint', error);
      // Qui potresti gestire l'errore, ad esempio mostrando un messaggio all'utente
    } finally {
      setIsSpinner(false);
    }
  }, [API_URL, currentPage, limit]);

  // Effetto per caricare gli autori quando l'utente è loggato o cambiano i parametri di paginazione
  useEffect(() => {
    if (isLoggedIn) {
      getFetchAuthor();
    }
  }, [isLoggedIn, getFetchAuthor]);

  return (
    <Container className='content-authors'>
      <h1 className='blog-main-title mb-3 text-center'>List of authors</h1>
      {isLoggedIn ? (
        <>
          {/* Controllo se ci sono autori prima di mostrare lo spinner */}
          {totalAuthor === 0 ? (
            <Alert variant='warning' className='mt-3 text-center'>No authors present in the database...</Alert>
          ) : (
            <>
              {/* Spinner di caricamento */}
              <div className='d-flex justify-content-center mx-4'>
                {isSpinner && <Spinner animation='border' variant='secondary' className='mx-5' />}
              </div>
              {/* Griglia degli autori */}
              <Row className='mt-3'>
                {authors.map((author) => (
                  <Col md={6} lg={3} className='mb-4' key={author._id}>
                    <div className='author-card'>
                      <Image
                        className='author-avatar'
                        src={author.avatar || defaultAvatar}
                        alt={`Avatar of ${author.name}`}
                      />
                      <div className='author-name'>
                        <h6>{author.name} {author.lastname}</h6>
                        <p className='text-muted'>{author.email}</p>
                      </div>
                      <div className='d-flex flex-column justify-content-center align-items-center'>
                        <ViewAuthor id={author._id} />
                        {/* Qui potrebbero essere inseriti i componenti EditAuthor e DeleteAuthor */}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              {/* Componente di paginazione */}
              <Pagination className='float-end'>
                <Pagination.First
                  className='btn-pagination'
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  className='btn-pagination'
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                />
                {Array.from({ length: totalPages }, (_, index) => (
                  <Pagination.Item
                    className='btn-pagination'
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  className='btn-pagination'
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  className='btn-pagination'
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
              {/* Selezione del numero di elementi per pagina */}
              <div className='my-3'>
                <span>Authors for page:</span>
                <select
                  className='ms-2'
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                >
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={24}>24</option>
                </select>
              </div>
            </>
          )}
        </>
      ) : (
        // Messaggio mostrato quando l'utente non è loggato
        <Alert className='mt-4 text-center' variant='light'>
          To view the list of authors,{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link> 
            or{' '} 
          <Link to={'/login'} className='link-register'>
            LOGIN{' '}
          </Link>
          is required.
        </Alert>
      )}
    </Container>
  );
};

export default BlogAuthor;



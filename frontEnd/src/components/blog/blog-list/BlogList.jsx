import React, { useEffect, useState, useCallback, useContext } from 'react'; // Importa i hooks di React necessari
import { Button, Col, Container, Pagination, Row, Spinner } from 'react-bootstrap'; // Importa i componenti di React-Bootstrap
import BlogItem from '../blog-item/BlogItem'; // Importa il componente BlogItem
import BlogCardPlaceholder from '../../blogPlaceholder/BlogCardPlaceholder'; // Importa il componente BlogCardPlaceholder
import fetchWithAuth from '../../../services/fetchWithAuth.js'; // Importa la funzione fetchWithAuth per le richieste HTTP autenticati
import { Link } from 'react-router-dom'; // Importa il componente Link per la navigazione
import { Context } from '../../../modules/Context.js'; // Importa il contesto dell'applicazione

const BlogList = ({ search }) => { // Definisce il componente BlogList e accetta una prop di ricerca
  
  const URL = 'http://localhost:5001/api'; // URL di base dell'API
  const API_URL = process.env.REACT_APP_API_URL || URL; // Usa l'URL dell'API da una variabile d'ambiente, se disponibile, altrimenti usa l'URL locale

  const { isLoggedIn } = useContext(Context); // Usa il hook useContext per accedere ai dati del contesto, inclusa l'informazione se l'utente è loggato

  const [listPosts, setListPosts] = useState([]); // Stato per la lista dei post
  const [isSpinner, setisSpinner] = useState(false); // Stato per il controllo dello spinner di caricamento
  const [loading, setLoading] = useState(true); // Stato per il controllo del caricamento iniziale

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1); // Stato per la pagina corrente
  const [totalPages, setTotalPages] = useState(1); // Stato per il totale delle pagine
  const [limit, setLimit] = useState(16); // Stato per il limite di post per pagina

  // Funzione per recuperare i post, memorizzata usando useCallback per evitare ricreazioni inutili
  const getFetchPosts = useCallback(async () => {
    setisSpinner(true); // Mostra lo spinner di caricamento

    try {
      const data = await fetchWithAuth(`${API_URL}/blogPosts?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`); // Effettua la richiesta HTTP per ottenere i post
      setListPosts(data.posts); // Imposta la lista dei post nello stato
      setTotalPages(data.totalPages); // Imposta il totale delle pagine nello stato
    } catch (error) {
      console.error('Errore', error); // Gestione dell'errore
    } finally {
      setisSpinner(false); // Nasconde lo spinner di caricamento
      setLoading(false); // Imposta il caricamento iniziale a false
    }
  }, [API_URL, currentPage, limit]); // Dipendenze del useCallback

  // Effettua la chiamata per recuperare i post quando il componente viene montato o quando API_URL, getFetchPosts cambiano
  useEffect(() => {
    getFetchPosts();
  }, [API_URL, getFetchPosts]);

  // Creare i placeholder per il caricamento
  const placeholders = [];
  for (let i = 0; i < limit; i++) {
    placeholders.push(
      <Col key={i} md={4} lg={3} style={{ marginBottom: 50 }}>
        <BlogCardPlaceholder /> {/* Componente placeholder */}
      </Col>
    );
  }

  return (
    <>
      {/* Spinner di caricamento */}
      <div className='d-flex justify-content-center m-3'>
        {isSpinner && <Spinner animation='border' variant='secondary' />}
      </div>
      
      {/* Bottone per creare un nuovo post, visibile solo se l'utente è loggato */}
      {isLoggedIn && (
        <Container className='d-flex justify-content-end mb-4'>
          <Button
            as={Link} to='/new'
            variant='dark'
            aria-label='new post'
            size='md'
            className='me-3 btn-standard'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              fill='currentColor'
              className='bi bi-plus-lg me-3'
              viewBox='0 0 16 16'
            >
              <path d='M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z' />
            </svg>
            New Post
          </Button>
        </Container>
      )}

      {/* Elenco dei post */}
      <Row>
        {loading
          ? placeholders // Mostra i placeholder durante il caricamento
          : listPosts
              .filter((post) => 
                post.title.toLowerCase().includes(search.toLowerCase()) || 
                post.author.email.toLowerCase().includes(search.toLowerCase())
              ) // Filtra i post in base alla ricerca
              .map((post) => (
                <Col key={post._id} md={4} lg={3} style={{ marginBottom: 50 }}>
                  <BlogItem key={post._id} {...post} getFetchPosts={getFetchPosts} /> {/* Componente BlogItem */}
                </Col>
              ))}
      </Row>

      {/* Paginazione */}
      <Pagination className='float-end'>
        <Pagination.First
          className='btn-pagination'
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1} // Disabilitato se già sulla prima pagina
        />

        <Pagination.Prev
          className='btn-pagination'
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1} // Disabilitato se già sulla prima pagina
        />

        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            className='btn-pagination'
            key={index + 1}
            active={index + 1 === currentPage} // Evidenzia la pagina corrente
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          className='btn-pagination'
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages} // Disabilitato se già sull'ultima pagina
        />

        <Pagination.Last
          className='btn-pagination'
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages} // Disabilitato se già sull'ultima pagina
        />
      </Pagination>

      {/* Selezione del numero di elementi per pagina */}
      <div className='my-3'>
        <span>Posts for page:</span>
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
  );
};

export default BlogList; // Esporta il componente BlogList per l'uso in altri file




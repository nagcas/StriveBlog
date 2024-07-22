import './Blog.css'; // Importa gli stili per il componente Blog.

import React, { useCallback, useEffect, useState } from 'react'; // Importa hook React necessari.
import { Alert, Container, Image, Spinner } from 'react-bootstrap'; // Importa componenti di Bootstrap.
import { Link, useParams } from 'react-router-dom'; // Importa hook per il routing.
import BlogAuthor from '../../components/blog/blog-author/BlogAuthor'; // Importa il componente per visualizzare l'autore del blog.
import BlogLike from '../../components/likes/BlogLike'; // Importa il componente per i like del blog.
import CommentList from '../../components/commentArea/CommentList'; // Importa il componente per la lista dei commenti.
import fetchWithAuth from '../../services/fetchWithAuth'; // Importa la funzione per le chiamate API con autenticazione.
import { Context } from '../../modules/Context.js'; // Importa il contesto per lo stato di autenticazione.
import { useContext } from 'react'; // Importa hook per accedere al contesto.
import formatData from '../../services/formatDate.js'; // Importa la funzione per formattare le date.
import defaultBlog from '../../assets/default-avatar.jpg'; // Importa l'immagine di default per il blog.

const Blog = () => {
  // Ottiene lo stato di autenticazione dal contesto.
  const { isLoggedIn } = useContext(Context);

  // Ottiene l'ID del blog dalla URL.
  const { id } = useParams();

  // URL predefinito per le API.
  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL; // URL dell'API configurabile tramite variabile d'ambiente.

  // Stati per il blog, i commenti e il caricamento.
  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Funzione per caricare i dati del blog e dei commenti.
  const fetchBlog = useCallback(async () => {
    setLoading(true); // Imposta lo stato di caricamento su vero.
    try {
      // Effettua una chiamata API per ottenere i dati del blog.
      const response = await fetchWithAuth(`${API_URL}/blogPosts/${id}`);
      // Imposta i dati del blog e i commenti nello stato.
      setBlog(response);
      setComments(response.comments || []); // Imposta i commenti, o un array vuoto se non ci sono commenti.
    } catch (error) {
      // Gestisce eventuali errori di caricamento.
      console.error('Errore', error);
    } finally {
      // Imposta lo stato di caricamento su falso dopo il caricamento.
      setLoading(false);
    }
  }, [API_URL, id]);

  // Effetto per caricare i dati del blog quando il componente viene montato.
  useEffect(() => {
    fetchBlog(); // Chiama la funzione per caricare i dati del blog.
  }, [fetchBlog]); // Ricarica i dati quando cambia fetchBlog.

  // Funzione per aggiornare i commenti.
  const updateComments = (newComments) => {
    setComments(newComments); // Aggiorna lo stato dei commenti.
  };

  // Mostra uno spinner di caricamento mentre i dati sono in fase di recupero.
  if (loading) {
    return (
      <div className='text-center'>
        <Spinner animation='border' variant='secondary' className='mx-5' /> {/* Spinner di Bootstrap */}
      </div>
    );
  }

  return (
    <div className='blog-details-root'>
      <Container>
        {/* Immagine di copertura del blog */}
        <Image
          className='blog-details-cover'
          src={blog.cover ? blog.cover : defaultBlog} // Mostra l'immagine di default se blog.cover non esiste.
          alt={blog.title} // Fornisce un testo alternativo per l'immagine.
          fluid
        />
        <h1 className='blog-details-title'>{blog.title}</h1> {/* Titolo del blog */}

        <div className='blog-details-container'>
          <div className='blog-details-author'>
            <BlogAuthor {...blog.author} /> {/* Componente per visualizzare l'autore del blog */}
          </div>
          <div className='blog-details-info'>
            <div>
              {formatData(blog.createdAt, 'it')} {/* Data di creazione formattata */}
            </div>
            <div>{blog.readTime?.value} {blog.readTime?.unit}</div> {/* Tempo di lettura */}
            <div style={{ marginTop: 20 }}>
              <BlogLike defaultLikes={['123']} onChange={console.log} /> {/* Componente per i like */}
            </div>
          </div>
        </div>
        
        <div className='content-post' dangerouslySetInnerHTML={{ __html: blog.content }}></div> {/* Contenuto del post */}
        {isLoggedIn ? (
          <CommentList id={blog._id} comments={comments} updateComments={updateComments} />
        ) : (
          <Alert className='mt-4 text-center' variant='light'>
            To view and leave a comment,{' '} 
            <Link to='/register' className='link-register'>
              REGISTRATION{' '}
            </Link> 
              or{' '} 
            <Link to='/login' className='link-login'>
              LOGIN{' '}
            </Link>
            is required.
          </Alert> 
        )}
      </Container>
    </div>
  );
};

export default Blog; // Esporta il componente Blog.





import './BlogItem.css'; // Importa lo stile specifico per il componente BlogItem

import { Button, Card } from 'react-bootstrap'; // Importa i componenti Button e Card da react-bootstrap per creare l'interfaccia utente
import { Link } from 'react-router-dom'; // Importa il componente Link da react-router-dom per la navigazione
import BlogAuthor from '../blog-author/BlogAuthor'; // Importa il componente BlogAuthor per visualizzare i dettagli dell'autore del blog
import DeletePost from './DeletePost'; // Importa il componente DeletePost per gestire la cancellazione del post
import { FaEdit } from 'react-icons/fa'; // Importa l'icona FaEdit da react-icons per il bottone di modifica
import { Context } from '../../../modules/Context.js'; // Importa il contesto dell'applicazione per accedere alle informazioni di login
import { useContext } from 'react'; // Importa il hook useContext da React per utilizzare il contesto
import defaultCover from '../../../assets/blog_default.jpg';

const BlogItem = (props) => {
  
  // Destruttura le proprietà passate al componente BlogItem
  const { title, category, cover, author, _id, getFetchPosts } = props;
  
  // Usa il hook useContext per accedere ai dati del contesto, inclusi authorLogin e isLoggedIn
  const { authorLogin, isLoggedIn } = useContext(Context);

  return (
    <Card className='blog-card'> {/* Inizia una Card di react-bootstrap con una classe CSS personalizzata */}
      <Link to={`/blogPosts/${_id}`} className='blog-link'> {/* Link al dettaglio del post del blog */}
        {/* Mostra la categoria del post */}
        <span className='category float-start m-2'>{category}</span>
        {/* Immagine di copertina del post */}
        <Card.Img 
          variant='top' 
          src={cover ? cover : defaultCover}
          alt={cover ? 'Image cover' : 'Image cover default'}
          className='blog-cover' 
          />
        <Card.Body> {/* Corpo della Card */}
          {/* Titolo del post */}
          <Card.Title className='card-title'>{title}</Card.Title>
        </Card.Body>
        <Card.Subtitle className='p-2'> {/* Sottotitolo della Card che contiene i dettagli dell'autore */}
          <BlogAuthor {...author} /> {/* Componente che mostra i dettagli dell'autore */}
        </Card.Subtitle>
      </Link>
      {/* Se l'utente è loggato e l'email dell'utente loggato corrisponde all'email dell'autore del post, mostra i pulsanti di modifica e cancellazione */}
      {isLoggedIn && (authorLogin.email === author.email) && ( 
        <Card.Footer> {/* Footer della Card che contiene i pulsanti */}
          <div className='d-flex justify-content-center p-2 gap-3 button-card-item'>
            {/* Bottone per modificare il post */}
            <Button variant='outline-warning' className='btn-standard' as={Link} to={`/editPost/${_id}`}>
              <FaEdit className='fa-icon'/> {/* Icona di modifica */}
              Edit
            </Button>
            {/* Componente per cancellare il post */}
            <DeletePost id={_id} title={title} getFetchPosts={getFetchPosts} />
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default BlogItem; // Esporta il componente BlogItem per l'uso in altri file




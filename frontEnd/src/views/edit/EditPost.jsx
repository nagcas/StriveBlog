import './EditPost.css'; // Importa gli stili per il componente EditPost.

import React, { useContext, useEffect, useState } from 'react'; // Importa hook React necessari.
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'; // Importa componenti di Bootstrap.
import { Link, useNavigate, useParams } from 'react-router-dom'; // Importa hook per il routing.
import fetchWithAuth from '../../services/fetchWithAuth'; // Importa la funzione per le chiamate API con autenticazione.
import { Context } from '../../modules/Context'; // Importa il contesto per lo stato di autenticazione.
import { FaHome, FaRegSave, FaRegTimesCircle, FaSave } from 'react-icons/fa'; // Importa icone per i pulsanti.

function EditPost() {
  
  const navigate = useNavigate(); // Hook per navigare tra le pagine.
  const { id } = useParams(); // Ottiene l'ID del post dalla URL.

  const URL = 'http://localhost:5001/api'; // URL predefinito per le API.
  const API_URL = process.env.REACT_APP_API_URL || URL; // URL dell'API configurabile tramite variabile d'ambiente.

  const [message, setMessage] = useState(false); // Stato per il messaggio di successo.
  const [stateButton, setStateButton] = useState(true); // Stato per abilitare/disabilitare i pulsanti.
  const [errors, setErrors] = useState({}); // Stato per gli errori di validazione.
  const [coverFile, setCoverFile] = useState(null); // Stato per il file di copertura.

  const { authorLogin, isLoggedIn } = useContext(Context); // Ottiene lo stato di autenticazione e le informazioni dell'autore dal contesto.

  // Stato iniziale del post con valori predefiniti.
  const initialState = {
    title: '',
    category: '',
    readTime: {
      value: 1,
      unit: ''
    },
    author: {
      email: authorLogin.email || ''
    },
    content: '',
    cover: '',
  };

  const [editPost, setEditPost] = useState(initialState); // Stato per il post in fase di modifica.

  // Effetto per caricare i dati del post all'avvio del componente.
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetchWithAuth(`${API_URL}/blogPosts/${id}`);
        setEditPost(response); // Imposta i dati del post nello stato.
      } catch (error) {
        console.error('Post not loaded correctly...', error); // Gestisce eventuali errori di caricamento.
      }
    };
    fetchPostData(); // Chiama la funzione per caricare i dati del post.
  }, [API_URL, id]); // Ricarica i dati quando cambia API_URL o id.

  // Funzione per gestire le modifiche ai campi del modulo.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'readTimeValue') {
      setEditPost({ ...editPost, readTime: { ...editPost.readTime, value: parseInt(value) } });
    } else if (name === 'readTimeUnit') {
      setEditPost({ ...editPost, readTime: { ...editPost.readTime, unit: value } });
      setErrors((prevErrors) => ({
        ...prevErrors,
        readTimeUnit: ''
      }));
    } else if (name === 'authorEmail') {
      setEditPost({ ...editPost, author: { ...editPost.author, email: value } });
      setErrors((prevErrors) => ({
        ...prevErrors,
        authorEmail: ''  
      }));
    } else {
      setEditPost({ ...editPost, [name]: value });
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Funzione per validare i dati del modulo.
  const validate = () => {
    const newErrors = {};
    if (!editPost.category.trim()) {
      newErrors.category = 'You must enter a category...';
    }
    if (!editPost.title.trim()) {
      newErrors.title = 'You must enter a title...';
    }
    if (!editPost.readTime.unit.trim()) {
      newErrors.readTimeUnit = 'You must enter a unit time...';
    }
    if (!editPost.content.trim()) {
      newErrors.content = 'You must enter content...';
    }
    return newErrors;
  };

  // Funzione per gestire il cambio del file di copertura.
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]); // Imposta il file di copertura nello stato.
  };

  // Funzione per gestire la sottomissione del modulo di modifica.
  const handleEditPost = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo.

    const validationErrors = validate(); // Valida i dati del modulo.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Mostra gli errori di validazione.
      return;
    }
  
    setErrors({}); // Resetta gli errori.

    try {
      const response = await fetchWithAuth(`${API_URL}/blogPosts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' // Tipo di contenuto per la richiesta PATCH.
        },
        body: JSON.stringify(editPost),
      });
      console.log(response); // Mostra la risposta della richiesta.
      setMessage(true); // Mostra un messaggio di successo.
      setStateButton(false); // Disabilita i pulsanti.
    } catch (err) {
      console.log('Error editing post...', err); // Gestisce eventuali errori.
    } finally {
      setTimeout(() => {
        setMessage(false); // Nasconde il messaggio di successo.
        setStateButton(true); // Riabilita i pulsanti.
        navigate('/'); // Naviga alla pagina principale.
      }, 1500);
    }
  };
  
  // Funzione per resettare il modulo di modifica.
  const handleResetForm = () => {
    setEditPost(initialState); // Resetta il modulo ai valori iniziali.
    //setCoverFile(null); // (Commentato) Potrebbe essere usato per resettare il file di copertura.
    setErrors({}); // Resetta gli errori.
  };

  return (
    <Container className='new-blog-container'>
      {(isLoggedIn && authorLogin) ? ( // Controlla se l'utente è autenticato e ha effettuato il login.
        <Form className='mt-5' onSubmit={handleEditPost}> {/* Modulo per modificare il post */}
          <h4 className='text-center edit-title'>Edit Post id: {id}</h4> {/* Titolo del modulo */}
          <p className='mx-2 mt-2 float-end'>Fields marked with * are mandatory.</p> {/* Indicazione sui campi obbligatori */}
          <Form.Group controlId='blog-form-title' className='mt-3'>
            <Form.Label className='fw-bold'>*Title</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit shadow'
              type='text'
              name='title'
              aria-label='title'
              placeholder='Enter the title...'
              value={editPost.title}
              onChange={handleInputChange}
              autoFocus
            />

            {errors.title && <p className='text-danger'>{errors.title}</p>} {/* Mostra errore se presente */}

          </Form.Group>

          <Form.Group controlId='blog-form-category' className='mt-3'>
            <Form.Label className='fw-bold'>*Category</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit shadow'
              as='select'
              name='category'
              aria-label='category'
              value={editPost.category}
              onChange={handleInputChange}
            >
              <option value=''>Select a category</option>
              <option value='Tech'>Tech</option>
              <option value='Technology'>Technology</option>
              <option value='Health'>Health</option>
              <option value='Science'>Science</option>
              <option value='Business'>Business</option>
            </Form.Control>

            {errors.category && <p className='text-danger'>{errors.category}</p>} {/* Mostra errore se presente */}
          
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId='blog-form-readtime' className='mt-3'>
              <Form.Label className='fw-bold'>Numeric time value <span className='text-muted'>(default 1)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-edit shadow'
                  type='number'
                  name='readTimeValue'
                  min='1'
                  placeholder='Enter reading time in numbers...'
                  value={editPost.readTime.value}
                  onChange={handleInputChange}
                />
                
                {errors.readTime && <p className='text-danger'>{errors.readTime.value}</p>} {/* Mostra errore se presente */}
              
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='blog-form-readunit' className='mt-3'>
              <Form.Label className='fw-bold'>*Reading time <span className='text-muted'>(hours, minutes, seconds)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-edit shadow'
                  as='select'
                  name='readTimeUnit'
                  aria-label='readTimeUnit'
                  value={editPost.readTime.unit}
                  onChange={handleInputChange}
                >
                  <option value=''>Select a reading time</option>
                  <option value='seconds'>seconds</option>
                  <option value='minutes'>minutes</option>
                  <option value='hours'>hours</option>
                </Form.Control>

                {errors.readTimeUnit && <p className='text-danger'>{errors.readTimeUnit}</p>} {/* Mostra errore se presente */}

              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId='blog-form-author' className='mt-3'>
            <Form.Label className='fw-bold'>Author</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit shadow'
              type='email'
              name='authorEmail'
              placeholder={authorLogin.email}
              value={editPost.author.email}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId='blog-form-content' className='mt-3'>
            <Form.Label className='fw-bold'>*Content</Form.Label>
            <Form.Control
              className='border-0 input-edit shadow'
              as='textarea'
              name='content'
              style={{ height: '150px' }}
              placeholder='Enter article text...'
              value={editPost.content}
              onChange={handleInputChange}
            />
            
            {errors.content && <p className='text-danger'>{errors.content}</p>} {/* Mostra errore se presente */}

          </Form.Group>

          <Form.Group controlId='blog-form-cover' className='mt-3'>
            <Form.Label className='fw-bold'>Cover <span className='text-muted'>(in the absence of a cover, a default one is inserted)</span></Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit p-4 shadow'
              type='file'
              name='cover'
              aria-label='cover'
              onChange={handleFileChange}
            />
          </Form.Group>

          {message && <Alert className='mt-3 text-center' variant='success'>Post updated successfully...</Alert>} {/* Mostra il messaggio di successo */}

          {stateButton && 
            <Form.Group className='d-flex mt-3 justify-content-end'>
              <Button
                className='me-3 btn-standard btn-edit shadow'
                as={Link}
                to='/'
                type='buttom'
                aria-label='button back to home'
                variant='outline-dark'
              >
                <FaHome /> Back to Home
              </Button>
              <Button
                className='me-3 btn-standard btn-edit shadow'
                type='reset' 
                variant='outline-dark'
                aria-label='button reset'
                onClick={handleResetForm}
              >
                <FaRegTimesCircle /> Reset
              </Button>
              <Button
                className='btn-standard btn-edit shadow'
                type='submit'
                variant='outline-success'
                aria-label='button save'
              >
                <FaSave /> Save
              </Button>
            </Form.Group>
          }
        </Form>
      ) : (
        <Alert className='mt-4 text-center' variant='light'>
          To edit a post,{' '}
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
}

export default EditPost; // Esporta il componente EditPost.



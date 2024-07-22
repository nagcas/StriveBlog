import './New.css'; // Importa gli stili per il componente NewBlogPost.

import React, { useContext, useState } from 'react'; // Importa React e i hook useContext e useState.
import { Link, useNavigate } from 'react-router-dom'; // Importa i hook e componenti per la navigazione.
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap'; // Importa i componenti di Bootstrap.
import fetchWithAuth from '../../services/fetchWithAuth'; // Importa la funzione per le richieste API protette.
import { Context } from '../../modules/Context'; // Importa il contesto per la gestione dello stato.
import { FaHome, FaRegSave, FaRegTimesCircle, FaSave } from 'react-icons/fa'; // Importa le icone.

const NewBlogPost = () => {
  
  const { isLoggedIn, authorLogin } = useContext(Context); // Ottiene lo stato di login e informazioni dell'autore dal contesto.
  const navigate = useNavigate(); // Hook per la navigazione programmatica.

  const URL = 'http://localhost:5001/api'; // URL di base per le richieste API.
  const API_URL = process.env.REACT_APP_API_URL || URL; // URL API configurato tramite variabile d'ambiente.

  const [message, setMessage] = useState(false); // Stato per il messaggio di successo.
  const [stateButton, setStateButton] = useState(true); // Stato per la gestione della disabilitazione dei pulsanti.
  const [errors, setErrors] = useState({}); // Stato per gli errori di validazione.
  const [coverFile, setCoverFile] = useState(null); // Stato per il file della copertura dell'articolo.

  // Stato iniziale per il nuovo post.
  const initialState = {
    title: '',
    category: '',
    readTime: {
      value: 1,
      unit: ''
    },
    author: {
      email: authorLogin.email
    },
    content: '',
    cover: ''
  };

  const [newPost, setNewPost] = useState(initialState); // Stato per i dati del nuovo post.

  // Gestisce i cambiamenti nei campi di input.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'readTimeValue') {
      setNewPost({ ...newPost, readTime: { ...newPost.readTime, value: parseInt(value) } });
    } else if (name === 'readTimeUnit') {
      setNewPost({ ...newPost, readTime: { ...newPost.readTime, unit: value } });
      setErrors((prevErrors) => ({ ...prevErrors, readTimeUnit: '' }));
    } else {
      setNewPost({ ...newPost, [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  // Valida i dati del nuovo post.
  const validate = () => {
    const newErrors = {};
    if (!newPost.category.trim()) {
      newErrors.category = 'You must enter a category...'; // Errore se la categoria è vuota.
    }
    if (!newPost.title.trim()) {
      newErrors.title = 'You must enter a title...'; // Errore se il titolo è vuoto.
    }
    if (!newPost.readTime.unit.trim()) {
      newErrors.readTimeUnit = 'You must enter a unit time...'; // Errore se l'unità di tempo è vuota.
    }
    if (!newPost.content.trim()) {
      newErrors.content = 'You must enter content...'; // Errore se il contenuto è vuoto.
    }
    return newErrors;
  };

  // Gestisce il cambiamento del file di copertura.
  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  // Crea un oggetto FormData per inviare i dati del post al server.
  const createFormData = () => {
    const formData = new FormData();
    formData.append('category', newPost.category);
    formData.append('title', newPost.title);
    formData.append('cover', coverFile); // Aggiunge il file di copertura.
    formData.append('readTime.value', newPost.readTime.value);
    formData.append('readTime.unit', newPost.readTime.unit);
    formData.append('author.email', newPost.author.email);
    formData.append('content', newPost.content);
    return formData;
  };

  // Gestisce l'invio del modulo per creare un nuovo post.
  const savePost = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo.

    const validationErrors = validate(); // Valida i dati del post.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Imposta gli errori di validazione.
      return;
    }

    setErrors({}); // Pulisce gli errori.

    const formData = createFormData(); // Crea il FormData con i dati del post.

    try {
      // Invia i dati del post al server.
      await fetchWithAuth(`${API_URL}/blogPosts`, {
        method: 'POST',
        body: formData,
      });

      setMessage(true); // Mostra il messaggio di successo.
      setStateButton(false); // Disabilita i pulsanti.
      setNewPost(initialState); // Resetta lo stato del post.
      setCoverFile(null); // Pulisce il file di copertura.
    } catch (error) {
      console.error('Post not sent correctly...', error); // Gestisce gli errori nella chiamata API.
    } finally {
      // Reindirizza alla home page dopo un breve intervallo.
      setTimeout(() => {
        setMessage(false); // Nasconde il messaggio di successo.
        setStateButton(true); // Abilita di nuovo i pulsanti.
        navigate('/'); // Reindirizza alla home page.
      }, 1500);
    }
  };

  // Gestisce il reset del modulo di creazione del post.
  const handleResetForm = () => {
    setNewPost(initialState); // Resetta i dati del post.
    setCoverFile(null); // Pulisce il file di copertura.
    setErrors({}); // Pulisce gli errori.
  };

  return (
    <Container className='new-blog-container'>
      {isLoggedIn ? (
        // Se l'utente è loggato, mostra il modulo di creazione del post.
        <Form className='mt-5' onSubmit={savePost}>
          <h4 className='text-center title-new'>New Post</h4> {/* Titolo del modulo */}
          <p className='float-end text-muted'>Fields marked with * are mandatory.</p> {/* Indica i campi obbligatori */}

          {/* Campo per il titolo del post */}
          <Form.Group controlId='blog-form-title' className='mt-3'>
            <Form.Label className='fw-bold'>*Title</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              type='text'
              name='title'
              aria-label='title'
              placeholder='Enter the title...'
              value={newPost.title}
              autoFocus
              onChange={handleInputChange}
            />
            {errors.title && <p className='text-danger'>{errors.title}</p>} {/* Mostra errore titolo */}
          </Form.Group>

          {/* Campo per la categoria del post */}
          <Form.Group controlId='blog-form-category' className='mt-3'>
            <Form.Label className='fw-bold'>*Category</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              as='select'
              name='category'
              aria-label='category'
              value={newPost.category}
              onChange={handleInputChange}
            >
              <option value=''>Select a category</option>
              <option value='Tech'>Tech</option>
              <option value='Technology'>Technology</option>
              <option value='Health'>Health</option>
              <option value='Science'>Science</option>
              <option value='Business'>Business</option>
            </Form.Control>
            {errors.category && <p className='text-danger'>{errors.category}</p>} {/* Mostra errore categoria */}
          </Form.Group>

          <Row>
            <Col md={6}>
              {/* Campo per il valore numerico del tempo di lettura */}
              <Form.Group controlId='blog-form-readtime' className='mt-3'>
                <Form.Label className='fw-bold'>Numeric time value <span className='text-muted'>(default 1)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-new shadow'
                  type='number'
                  name='readTimeValue'
                  aria-label='readTimeValue'
                  min='1'
                  placeholder='Enter reading time in numbers...'
                  value={newPost.readTime.value}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              {/* Campo per l'unità di tempo di lettura */}
              <Form.Group controlId='blog-form-readunit' className='mt-3'>
                <Form.Label className='fw-bold'>*Reading time <span className='text-muted'>(hours, minutes, seconds)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-new shadow'
                  as='select'
                  name='readTimeUnit'
                  aria-label='readTimeUnit'
                  value={newPost.readTime.unit}
                  onChange={handleInputChange}
                >
                  <option value=''>Select a reading time</option>
                  <option value='seconds'>seconds</option>
                  <option value='minutes'>minutes</option>
                  <option value='hours'>hours</option>
                </Form.Control>
                {errors.readTimeUnit && <p className='text-danger'>{errors.readTimeUnit}</p>} {/* Mostra errore unità di tempo */}
              </Form.Group>
            </Col>
          </Row>

          {/* Campo per l'email dell'autore */}
          <Form.Group controlId='blog-form-author' className='mt-3'>
            <Form.Label className='fw-bold'>Author</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              type='email'
              name='authorEmail'
              aria-label='author email'
              placeholder={authorLogin.email}
              value={newPost.author.email}
              readOnly
            />
          </Form.Group>

          {/* Campo per il contenuto del post */}
          <Form.Group controlId='blog-form-content' className='mt-3'>
            <Form.Label className='fw-bold'>*Content</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              as='textarea'
              name='content'
              aria-label='content'
              style={{ height: '150px' }}
              placeholder='Enter article text...'
              value={newPost.content}
              onChange={handleInputChange}
            />
            {errors.content && <p className='text-danger'>{errors.content}</p>} {/* Mostra errore contenuto */}
          </Form.Group>

          {/* Campo per il file di copertura */}
          <Form.Group controlId='blog-form-cover' className='mt-3'>
            <Form.Label className='fw-bold'>Cover <span className='text-muted'>(in the absence of a cover, a default one is inserted)</span></Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new input-cover shadow'
              type='file'
              name='cover'
              aria-label='cover'
              onChange={handleFileChange}
            />
          </Form.Group>

          {/* Pulsanti di azione */}
          {stateButton && (
            <Form.Group className='d-flex mt-3 justify-content-end'>
              <Button
                className='btn-standard mt-3 btn-new shadow'
                as={Link}
                to={'/'}
                type='button'
                aria-label='button back to home'
                variant='outline-dark'
              >
                <FaHome /> Back to Home
              </Button>

              <Button
                className='btn-standard mt-3 btn-new shadow'
                type='reset'
                aria-label='button reset'
                variant='outline-dark'
                onClick={handleResetForm}
              >
                <FaRegTimesCircle /> Reset
              </Button>

              <Button
                className='btn-standard mt-3 btn-new shadow'
                aria-label='button save'
                variant='outline-success'
                type='submit'
              >
                <FaSave /> Save
              </Button>
            </Form.Group>
          )}

          {message && <Alert className='mt-3 text-center' variant='success'>Post created successfully...</Alert>} {/* Mostra il messaggio di successo */}
          
        </Form>
      ) : (
        // Se l'utente non è loggato, mostra un avviso e i link per la registrazione o il login.
        <Alert className='mt-4 text-center' variant='light'>
          To view the list of authors, is required{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link> 
          or{' '} 
          <Link to={'/login'} className='link-register'>
            LOGIN{' '}
          </Link>
          required.
        </Alert>
      )}
    </Container>
  );
};

export default NewBlogPost; // Esporta il componente NewBlogPost.



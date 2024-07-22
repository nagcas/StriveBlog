import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import fetchWithAuth from '../../../services/fetchWithAuth';
import { FaRegTimesCircle, FaSave } from 'react-icons/fa';

function CreateAuthor({ getFetchAuthor }) {
  // Definizione dell'URL API con fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Stati per gestire il modale, i messaggi, gli errori e lo stato del pulsante
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [stateButton, setStateButton] = useState(true);

  // Funzioni per gestire l'apertura e la chiusura del modale
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Stato per il nuovo autore con campi vuoti iniziali
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    lastname: '',
    email: '',
    birthdate: '',
    avatar: ''
  });

  // Gestisce i cambiamenti nei campi del form
  function handleChange(e) {
    const { name, value } = e.target;
    setNewAuthor(prev => ({
      ...prev,
      [name]: value
    }));
    // Resetta lo specifico errore quando l'utente modifica il campo
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }

  // Funzione di validazione del form
  const validate = () => {
    const newErrors = {};
    ['name', 'lastname', 'email', 'birthdate'].forEach(field => {
      if (!newAuthor[field].trim()) {
        newErrors[field] = `You must enter a ${field}...`;
      }
    });
    return newErrors;
  };

  // Gestisce il submit del form
  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    
    // Valida il form prima di inviare
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      // Invia i dati al server utilizzando fetchWithAuth
      await fetchWithAuth(`${API_URL}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAuthor),
      });

      // Gestisce il successo dell'operazione
      setMessage(true);
      setStateButton(false);
      setNewAuthor({
        name: '',
        lastname: '',
        email: '',
        birthdate: '',
        avatar: ''
      });
    } catch (error) {
      console.error('Dati non inviati correttamente', error);
      // Qui potresti gestire l'errore, ad esempio impostando un messaggio di errore
    } finally {
      // Chiude il modale e resetta gli stati dopo un breve delay
      setTimeout(() => {
        handleClose();
        setMessage(false);
        setStateButton(true);
        getFetchAuthor(); // Aggiorna la lista degli autori
      }, 1500);
    }
  };

  // Resetta il form e chiude il modale
  const handleResetClose = () => {
    handleClose();
    setNewAuthor({
      name: '',
      lastname: '',
      email: '',
      birthdate: '',
      avatar: ''
    });
  };

  return (
    <>
      {/* Pulsante per aprire il modale */}
      <Button
        className='btn-standard' 
        aria-label='button create author'
        variant='dark'
        onClick={handleShow}
      >
        <svg
          className='bi bi-plus-lg me-3'
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
        >
          <path d='M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z' />
        </svg>
        Create Author
      </Button>

      {/* Modale per creare un nuovo autore */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Create Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleSaveSubmit}>
            {/* Campi del form per i dettagli dell'autore */}
            {/* Ogni campo ha la sua logica di validazione e gestione degli errori */}
            {/* ... (i campi del form sono omessi per brevità) ... */}
            
            {/* Messaggio di successo */}
            {message && <Alert className='m-3 text-center' variant='success'>Author created successfully...</Alert>}
            
            {/* Footer del modale con pulsanti */}
            {stateButton && 
              <Modal.Footer>
                <Button
                  className='me-3 btn-standard' 
                  aria-label='button cancel'
                  variant='dark'
                  onClick={handleResetClose}
                >
                  <FaRegTimesCircle /> Cancel
                </Button>
                
                <Button
                  className='btn-standard'
                  type='submit' 
                  aria-label='button save'
                  variant='outline-success' 
                >
                  <FaSave /> Save
                </Button>
              </Modal.Footer>
            }
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateAuthor;
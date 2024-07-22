import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaRegTimesCircle, FaSave } from 'react-icons/fa';
import fetchWithAuth from '../../../services/fetchWithAuth';
import formatData from '../../../services/formatDate';

function EditAuthor({ author, updateAuthor }) {
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

  // Stato per l'autore da modificare, inizializzato con i dati attuali
  const [editAuthor, setEditAuthor] = useState({
    _id: author._id,
    name: author.name,
    lastname: author.lastname,
    email: author.email,
    birthdate: author.birthdate,
    avatar: author.avatar
  });

  // Gestisce i cambiamenti nei campi del form
  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditAuthor(prev => ({
      ...prev,
      [name]: value
    }));
    // Resetta lo specifico errore quando l'utente modifica il campo
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Funzione di validazione del form
  const validate = () => {
    const newErrors = {};
    ['name', 'lastname', 'email', 'birthdate'].forEach(field => {
      if (!editAuthor[field].trim()) {
        newErrors[field] = `You must enter a ${field}...`;
      }
    });
    return newErrors;
  }

  // Gestisce il submit del form per modificare l'autore
  const handleEditAuthor = async (e) => {
    e.preventDefault();

    // Valida il form prima di inviare
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      // Invia i dati aggiornati al server utilizzando fetchWithAuth
      await fetchWithAuth(`${API_URL}/authors/${author._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editAuthor),
      });
      
      // Gestisce il successo dell'operazione
      setMessage(true);
      setStateButton(false);
    } catch (error) {
      console.error('Errore invio dati', error);
      // Qui potresti gestire l'errore, ad esempio mostrando un messaggio all'utente
    } finally {
      // Chiude il modale e aggiorna i dati dopo un breve delay
      setTimeout(() => {
        setMessage(false);
        setStateButton(true);
        handleClose();
        updateAuthor(editAuthor);
      }, 1500);
    }
  };
  
  return (
    <>
      {/* Pulsante per aprire il modale di modifica */}
      <Button
        className='mt-2 me-3 btn-standard' 
        aria-label='button edit'
        variant='outline-warning' 
        onClick={handleShow}
      >
        <FaEdit className='fa-icon'/> Edit
      </Button>

      {/* Modale per modificare l'autore */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleEditAuthor}>
            {/* Campi del form per i dettagli dell'autore */}
            {/* Ogni campo ha la sua logica di validazione e gestione degli errori */}
            {/* ... (i campi del form sono omessi per brevità) ... */}
            
            {/* Messaggio di successo */}
            {message && <Alert className='m-3 text-center' variant='success'>Author updated successfully...</Alert>}
        
            {/* Footer del modale con pulsanti */}
            {stateButton &&
              <Modal.Footer>
                <Button
                  className='me-3 btn-standard' 
                  aria-label='button cancel'
                  variant='dark' 
                  onClick={handleClose}
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

export default EditAuthor;
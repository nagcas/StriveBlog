import { useContext, useState } from 'react'; // Hook di React per gestire stato e contesto
import { Alert, Button, Form, Modal } from 'react-bootstrap'; // Componenti di React-Bootstrap per UI
import { FaEdit, FaRegTimesCircle, FaSave } from 'react-icons/fa'; // Icone FontAwesome
import fetchWithAuth from '../../services/fetchWithAuth'; // Funzione per effettuare richieste API autenticate
import { Context } from '../../modules/Context'; // Contesto per ottenere informazioni sull'utente

function EditComment({ id, comment, commentId, updateComments }) {
  const { authorLogin } = useContext(Context); // Ottiene informazioni sull'utente loggato dal contesto

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const [show, setShow] = useState(false); // Stato per la visibilità del modal
  const [message, setMessage] = useState(false); // Stato per il messaggio di conferma
  const [stateButton, setStateButton] = useState(true); // Stato per gestire l'abilitazione/disabilitazione dei bottoni
  const [errors, setErrors] = useState({}); // Stato per memorizzare eventuali errori di validazione

  const handleClose = () => setShow(false); // Chiude il modal
  const handleShow = () => setShow(true); // Mostra il modal

  const [editComment, setEditComment] = useState({
    _id: authorLogin._id,
    name: authorLogin.name,
    email: authorLogin.email,
    content: comment.content,
  });

  // Gestisce le modifiche ai campi del modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditComment({
      ...editComment,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Funzione per la validazione del commento
  const validate = () => {
    const newErrors = {};
    if (!editComment.content.trim()) {
      newErrors.content = 'You must enter a comment...'; // Messaggio di errore se il campo contenuto è vuoto
    }
    return newErrors;
  };

  // Gestisce l'invio del modulo di modifica
  const handleEditSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await fetchWithAuth(`${API_URL}/blogPosts/${id}/comments/${commentId}`, {
        method: 'PATCH', // Metodo HTTP per aggiornare il commento
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editComment), // Corpo della richiesta con il commento aggiornato
      });
      
      setMessage(true); // Mostra il messaggio di successo
      setStateButton(false); // Disabilita i bottoni per evitare ulteriori modifiche
      updateComments((prevComments) => 
        prevComments.map((comm) => (comm._id === comment._id ? { ...comm, content: editComment.content } : comm))
      ); // Aggiorna il commento nella lista del componente padre
    } catch (error) {
      console.error('Errore invio dati', error); // Log degli errori
    } finally {
      setTimeout(() => {
        setMessage(false); // Nasconde il messaggio di successo dopo un timeout
        setStateButton(true); // Riabilita i bottoni
        handleClose(); // Chiude il modal
      }, 1500);
    }
  };

  // Gestisce la chiusura del modal e il reset degli errori
  const handleResetClose = () => {
    handleClose();
    setErrors({});
  };

  return (
    <>
      <Button
        className='me-3 btn-standard'
        aria-label='button edit'
        variant='outline-warning'
        onClick={handleShow} // Mostra il modal quando cliccato
      >
        <FaEdit className='fa-icon' /> Edit
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className='mb-3' controlId='edit-comment-id'>
              <Form.Label className='fw-bold'>ID</Form.Label>
              <Form.Control 
                className='form-control-plaintext border-0 border-bottom mb-4'
                name='id'
                placeholder={authorLogin._id}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='edit-comment-name'>
              <Form.Label className='fw-bold'>*Name</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='name'
                aria-label='name'
                value={editComment.name}
                placeholder={authorLogin.name}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='edit-comment-email'>
              <Form.Label className='fw-bold'>*Email</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='email'
                name='email'
                aria-label='email'
                value={editComment.email}
                placeholder={authorLogin.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='edit-comment-content'>
              <Form.Label className='fw-bold'>*Content</Form.Label>
              <Form.Control
                className='border-0'
                type='text'
                as={'textarea'}
                name='content'
                aria-label='content'
                value={editComment.content}
                placeholder='Insert your comment...'
                onChange={handleChange} // Gestisce le modifiche al contenuto
                required
              />

              {errors.content && <p className='text-danger'>{errors.content}</p>} {/* Mostra errori di validazione */}

            </Form.Group>

            {message && <Alert className='m-3 text-center' variant='success'>Comment updated successfully...</Alert>} {/* Mostra messaggio di successo */}
            
            {stateButton && (
              <Modal.Footer>
                <Button
                  className='me-3 btn-standard'
                  aria-label='button cancel'
                  variant='dark'
                  onClick={handleResetClose} // Chiude il modal e resetta gli errori
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
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditComment;


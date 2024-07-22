import { useContext, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaRegTimesCircle, FaTrashAlt } from 'react-icons/fa';
import fetchWithAuth from '../../../services/fetchWithAuth';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../../modules/Context';

function DeleteAuthor({ author }) {
  // Accesso al contesto globale per gestire lo stato di login
  const { setIsLoggedIn } = useContext(Context);
  // Hook per la navigazione programmatica
  const navigate = useNavigate();

  // Definizione dell'URL API con fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  // Stato per controllare la visibilità del modale
  const [show, setShow] = useState(false);

  // Funzioni per gestire l'apertura e la chiusura del modale
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Funzione per gestire l'eliminazione dell'autore
  const handleDeleteAuthor = async () => {
    try {
      // Richiesta DELETE autenticata per eliminare l'autore
      await fetchWithAuth(`${API_URL}/authors/${author._id}`, {
        method: 'DELETE',
      });

      // Chiude il modale dopo l'eliminazione
      handleClose();

      // Effettua il logout dell'utente
      setIsLoggedIn(false);
      localStorage.removeItem('token');

      // Reindirizza l'utente alla home page
      navigate('/');

      // Emette un evento di storage per aggiornare altri componenti
      window.dispatchEvent(new Event('storage'));
      
    } catch (error) {
      console.error('Error:', error);
      // Qui potresti gestire l'errore, ad esempio mostrando un messaggio all'utente
    }
  };

  return (
    <>
      {/* Pulsante per aprire il modale di conferma */}
      <Button
        className='mt-2 btn-standard m-auto shadow' 
        aria-label='button delete'
        variant='outline-danger' 
        onClick={handleShow}
      >
        <FaTrashAlt className='fa-icon'/> Delete
      </Button>

      {/* Modale di conferma per l'eliminazione */}
      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Author</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <p>Are you sure you want to delete: <span className='fw-bold'>{author.name} {author.lastname}</span> ?</p>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          {/* Pulsante per annullare l'eliminazione */}
          <Button
            className='me-3 btn-standard' 
            size='lg'
            aria-label='button no'
            variant='dark' 
            onClick={handleClose}
          >
            <FaRegTimesCircle /> No
          </Button>
          {/* Pulsante per confermare l'eliminazione */}
          <Button
            className='btn-standard' 
            size='lg'
            aria-label='button yes'
            variant='outline-success' 
            onClick={handleDeleteAuthor}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteAuthor;
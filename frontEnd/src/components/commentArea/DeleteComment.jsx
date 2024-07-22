import { useState } from 'react'; // Hook di React
import { Button, Modal } from 'react-bootstrap'; // Componenti di React-Bootstrap
import { FaRegTimesCircle, FaTrashAlt } from 'react-icons/fa'; // Icone FontAwesome
import fetchWithAuth from '../../services/fetchWithAuth'; // Funzione per richieste API autenticate

function DeleteComment({ id, commentId, updateComments }) {
  const [show, setShow] = useState(false); // Stato per la visibilità del modal

  // Funzioni per gestire la visibilità del modal
  const handleClose = () => setShow(false); 
  const handleShow = () => setShow(true);

  // URL dell'API
  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  // Funzione per eliminare un commento
  const deleteComment = async () => {
    try {
      await fetchWithAuth(`${API_URL}/blogPosts/${id}/comments/${commentId}`, {
        method: 'DELETE',
      });
      // Rimuove il commento eliminato dalla lista nel componente padre
      updateComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error:', error); // Log degli errori
    } finally {
      handleClose(); // Chiude il modal dopo l'operazione
    }
  };

  return (
    <>
      <Button
        className='btn-standard'
        aria-label='button delete'
        variant='outline-danger'
        onClick={handleShow} // Mostra il modal quando cliccato
      >
        <FaTrashAlt className='fa-icon' /> Delete
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <p>Are you sure you want to delete?</p>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          <Button
            className='me-3 btn-standard'
            size='lg'
            aria-label='button no'
            variant='dark'
            onClick={handleClose} // Chiude il modal senza fare nulla
          >
            <FaRegTimesCircle /> No
          </Button>
          <Button
            className='btn-standard'
            size='lg'
            aria-label='button yes'
            variant='outline-success'
            onClick={deleteComment} // Elimina il commento e chiude il modal
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteComment;

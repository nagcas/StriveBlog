import { useState } from 'react'; // Importa il hook useState da React per gestire lo stato locale nel componente
import { Button, Modal } from 'react-bootstrap'; // Importa i componenti Button e Modal da react-bootstrap per creare l'interfaccia utente
import { FaRegTimesCircle, FaTrashAlt } from 'react-icons/fa'; // Importa le icone FaRegTimesCircle e FaTrashAlt da react-icons per i pulsanti
import fetchWithAuth from '../../../services/fetchWithAuth'; // Importa la funzione fetchWithAuth per fare richieste HTTP autenticati


function DeletePost({ id, title, getFetchPosts }) {
  // Definisce la costante URL con l'URL di base dell'API
  const URL = 'http://localhost:5001/api';
  // Usa l'URL dell'API da una variabile d'ambiente, se disponibile, altrimenti usa l'URL locale
  const API_URL = process.env.REACT_APP_API_URL || URL;

  // Stato per controllare la visibilità del modal, inizialmente impostato a false (modal nascosto)
  const [show, setShow] = useState(false);

  // Funzione per chiudere il modal, impostando lo stato show a false
  const handleClose = () => setShow(false);
  
  // Funzione per aprire il modal, impostando lo stato show a true
  const handleShow = () => setShow(true);
  
  // Funzione per gestire la cancellazione del post
  const handleDeletePost = async () => {
    try {
      // Effettua una richiesta DELETE autenticata per cancellare il post specificato dall'ID
      await fetchWithAuth(`${API_URL}/blogPosts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'multipart/form-data' // Header per specificare il tipo di contenuto
        }
      });
    } catch (error) {
      // Gestione dell'errore in caso la richiesta fallisca
      console.error(error);
    } finally {
      // Chiude il modal e aggiorna la lista dei post dopo la cancellazione
      handleClose();
      getFetchPosts();
    }
  };
  
  return (
    <>
      {/* Bottone per aprire il modal di conferma cancellazione */}
      <Button
        className='btn-standard' // Classe CSS per lo stile del bottone
        aria-label='button delete' // Etichetta aria per l'accessibilità
        variant='outline-danger' // Variante del bottone per uno stile di pericolo
        onClick={handleShow} // Assegna la funzione handleShow all'evento onClick
      >
        {/* Icona del cestino e testo del bottone */}
        <FaTrashAlt className='fa-icon'/> Delete
      </Button>

      {/* Modal di conferma cancellazione */}
      <Modal size='lg' show={show} onHide={handleClose}> {/* Modal con dimensione large */}
        <Modal.Header closeButton> {/* Header del modal con il bottone per chiudere */}
          <Modal.Title>Delete post</Modal.Title> {/* Titolo del modal */}
        </Modal.Header>
        <Modal.Body className='text-center'> {/* Corpo del modal con testo centrato */}
          Are you sure you want to delete the post: <span className='fw-bold'>{title}</span>? {/* Messaggio di conferma cancellazione */}
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'> {/* Footer del modal con pulsanti centrati */}
          {/* Bottone per chiudere il modal senza cancellare */}
          <Button
            className='me-3 btn-standard' // Classe CSS per lo stile del bottone
            size='lg' // Dimensione del bottone grande
            aria-label='button no' // Etichetta aria per l'accessibilità
            variant='dark' // Variante del bottone per uno stile scuro
            onClick={handleClose} // Assegna la funzione handleClose all'evento onClick
          >
            {/* Icona del cerchio con X e testo del bottone */}
            <FaRegTimesCircle /> No
          </Button>
          {/* Bottone per confermare la cancellazione */}
          <Button
            className='btn-standard' // Classe CSS per lo stile del bottone
            size='lg' // Dimensione del bottone grande
            aria-label='button yes' // Etichetta aria per l'accessibilità
            variant='outline-success' // Variante del bottone per uno stile di successo
            onClick={handleDeletePost} // Assegna la funzione handleDeletePost all'evento onClick
          >
            Yes {/* Testo del bottone */}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeletePost; // Esporta il componente DeletePost per l'uso in altri file

import { useState } from 'react'; // Importa l'hook useState di React.
import { Alert, Button, Form, Modal } from 'react-bootstrap'; // Importa componenti di Bootstrap.
import { FaPencilAlt, FaRegTimesCircle, FaSave } from 'react-icons/fa'; // Icone per modificare, annullare e salvare.
import fetchWithAuth from '../../services/fetchWithAuth'; // Funzione per effettuare chiamate API con autenticazione.

function UpdateAvatar({ authorLogin, updatedAuthor }) {
  const URL = 'http://localhost:5001/api'; // URL dell'API.
  const API_URL = process.env.REACT_APP_API_URL || URL; // Usa l'URL dell'API dall'ambiente o il valore predefinito.

  const [show, setShow] = useState(false); // Stato per gestire la visibilità del modal.
  const [avatarFile, setAvatarFile] = useState(null); // Stato per memorizzare il file dell'avatar.
  const [stateButton, setStateButton] = useState(true); // Stato per abilitare/disabilitare i pulsanti.
  const [message, setMessage] = useState(false); // Stato per visualizzare messaggi di successo.
  const [errors, setErrors] = useState(false); // Stato per gestire errori.

  // Funzione per chiudere il modal.
  const handleClose = () => setShow(false);

  // Funzione per mostrare il modal.
  const handleShow = () => setShow(true);

  // Funzione per gestire il cambiamento del file dell'avatar.
  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]); // Memorizza il file selezionato.
    setErrors(false); // Reset degli errori.
  };

  // Funzione per salvare l'avatar.
  const saveAvatar = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo.

    // Controlla se un file è stato selezionato.
    if (!avatarFile) {
      setErrors(true); // Mostra un errore se nessun file è stato selezionato.
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile); // Aggiunge il file al FormData.

    try {
      // Effettua una richiesta PATCH per aggiornare l'avatar dell'autore.
      const response = await fetchWithAuth(`${API_URL}/authors/${authorLogin._id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });

      setStateButton(false); // Disabilita i pulsanti durante l'aggiornamento.
      setMessage(true); // Mostra un messaggio di successo.
    } catch (error) {
      console.error('Error updating avatar:', error); // Log dell'errore.
    } finally {
      setTimeout(() => {
        handleClose(); // Chiude il modal dopo 1.5 secondi.
        setMessage(false); // Nasconde il messaggio di successo.
        setStateButton(true); // Riabilita i pulsanti.
      }, 1500);
    }
  };

  return (
    <>
      <Button variant='light' onClick={handleShow} className='btn-avatar btn-standard'>
        <FaPencilAlt /> {/* Icona per modificare l'avatar */}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Avatar</Modal.Title> {/* Titolo del modal */}
        </Modal.Header>
        <Form onSubmit={saveAvatar} className='modal-user'>
          <Form.Group controlId='profile-avatar' className='mt-3'>
            <Form.Label className='fw-bold'>Avatar Image</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-avatar shadow'
              type='file'
              name='avatar'
              onChange={handleFileChange} // Gestisce il cambiamento del file.
              accept='image/*' // Limita i file caricabili ai soli tipi di immagini.
            />

            {message && <Alert className='m-3 text-center' variant='success'>Avatar updated successfully...</Alert>}
            {errors && <Alert className='m-3 text-center' variant='danger'>Please select a file first...</Alert>}
          
          </Form.Group>
          {stateButton && ( // Mostra i pulsanti solo se stateButton è true.
            <Modal.Footer>
              <Button 
                variant='outline-dark' 
                className='btn-standard' 
                onClick={handleClose}>
                <FaRegTimesCircle /> Cancel {/* Pulsante per annullare */}
              </Button>
              <Button 
                variant='outline-success' 
                className='btn-standard'
                type='submit'>
                <FaSave /> Save {/* Pulsante per salvare */}
              </Button>
            </Modal.Footer>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateAvatar; // Esporta il componente UpdateAvatar.


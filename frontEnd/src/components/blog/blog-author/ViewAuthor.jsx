import { useState } from 'react'; // Importa il hook useState da React per gestire lo stato locale nel componente
import { Card, Image, ListGroup, Modal } from 'react-bootstrap'; // Importa i componenti Card, Image, ListGroup e Modal da react-bootstrap per creare l'interfaccia utente
import fetchWithAuth from '../../../services/fetchWithAuth'; // Importa la funzione fetchWithAuth per fare richieste HTTP autenticati

import defaultAvatar from '../../../assets/default-avatar.jpg'; // Importa l'immagine predefinita dell'avatar da mostrare se non è disponibile un avatar dell'autore
import { FaEye, FaTimes } from 'react-icons/fa'; // Importa le icone FaEye e FaTimes da react-icons per l'uso nel pulsante e nel modal
import formatData from '../../../services/formatDate'; // Importa la funzione formatDate per formattare le date in modo leggibile


function ViewAuthor({ id }) {
  
  const URL = 'http://localhost:5001/api'; // URL base per l'API locale
  const API_URL = process.env.REACT_APP_API_URL || URL; // Utilizza l'URL dell'API dalla variabile d'ambiente, se disponibile, altrimenti usa l'URL locale

  const [viewAuthor, setViewAuthor] = useState(''); // Stato per memorizzare i dati dell'autore visualizzati
  const [show, setShow] = useState(false); // Stato per controllare la visibilità del modal

  // Funzione per chiudere il modal, impostando lo stato show a false
  const handleClose = () => setShow(false); 

  // Funzione per aprire il modal e caricare i dettagli dell'autore
  const handleShow = async () => {
    setShow(true); // Mostra il modal impostando lo stato show a true
    
    try {
      // Effettua una richiesta GET autenticata per ottenere i dettagli dell'autore usando l'ID fornito
      const response = await fetchWithAuth(`${API_URL}/authors/${id}`); 
      
      // Aggiorna lo stato con i dati dell'autore ricevuti dalla risposta dell'API
      setViewAuthor(response);
    } catch (error) {
      // Gestione dell'errore in caso la richiesta fallisca, ad esempio se l'autore non esiste
      console.error('Autore non presente', error);
    }
  };
  

  return (
    <>
      {/* Bottone per visualizzare i dettagli dell'autore */}
      <button
        className='btn me-3 btn-outline-primary btn-standard' // Classi per lo stile del bottone
        aria-label='button view author' // Etichetta aria per l'accessibilità
        onClick={handleShow} // Assegna la funzione handleShow all'evento onClick
      >
        {/* Icona dell'occhio e testo del bottone */}
        <FaEye className='fa-icon' /> View
      </button>

      {/* Modal che si apre quando show è true */}
      <Modal show={show} onHide={handleClose}> {/* Funzione handleClose assegnata all'evento onHide per chiudere il modal */}
        <Modal.Header closeButton> {/* Header del modal con il bottone per chiudere */}
          <Modal.Title>View info Author</Modal.Title> {/* Titolo del modal */}
        </Modal.Header>
        <Modal.Body> {/* Corpo del modal */}
          <Card className='m-0'> {/* Card che contiene i dettagli dell'autore */}
            <ListGroup variant='flush'> {/* ListGroup per una lista senza bordi */}
              {viewAuthor && ( // Condizionale: visualizza i dettagli solo se viewAuthor contiene dati
                <>
                  {/* Immagine dell'autore, usa l'avatar se disponibile, altrimenti usa l'immagine predefinita */}
                  <Image
                    className='author-avatar m-4' // Classe CSS per lo stile dell'immagine
                    src={viewAuthor.avatar ? viewAuthor.avatar : defaultAvatar} // Controlla se viewAuthor.avatar è disponibile
                    alt={viewAuthor.avatar ? 'Image author' : 'Image author default'} // Testo alternativo per l'immagine
                    roundedCircle // Stile per rendere l'immagine circolare
                  />
                  {/* Visualizza l'ID dell'autore */}
                  <ListGroup.Item>id: <span className='fw-bold'>{id}</span></ListGroup.Item>
                  {/* Visualizza il nome dell'autore */}
                  <ListGroup.Item>Name: <span className='fw-bold'>{viewAuthor.name}</span></ListGroup.Item>
                  {/* Visualizza il cognome dell'autore */}
                  <ListGroup.Item>Lastname: <span className='fw-bold'>{viewAuthor.lastname}</span></ListGroup.Item>
                  {/* Visualizza la data di nascita dell'autore formattata */}
                  <ListGroup.Item>
                    Birthdate: <span className='fw-bold'>{formatData(viewAuthor.birthdate, 'it')}</span> {/* Formatta la data di nascita */}
                  </ListGroup.Item>
                  {/* Visualizza l'email dell'autore */}
                  <ListGroup.Item>Email: <span className='fw-bold'>{viewAuthor.email}</span></ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Card>
        </Modal.Body>
        <Modal.Footer> {/* Footer del modal */}
          <button
            className='btn btn-dark btn-standard' // Classe CSS per lo stile del bottone
            onClick={handleClose} // Assegna la funzione handleClose all'evento onClick
          >
            <FaTimes /> Close {/* Icona della X e testo del bottone */}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewAuthor; // Esporta il componente ViewAuthor per l'uso in altri file


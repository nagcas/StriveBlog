import './Profile.css'; // Importa il foglio di stile per il componente Profile.
import { useContext, useEffect, useState } from 'react'; // Importa gli hook di React.
import { Alert, Button, Col, Container, Form, Image, Row } from 'react-bootstrap'; // Importa componenti di Bootstrap.
import { Context } from '../../modules/Context.js'; // Importa il contesto per lo stato dell'autore.
import defaultAvatar from '../../assets/default-avatar.jpg'; // Immagine predefinita per l'avatar.
import { Link } from 'react-router-dom'; // Importa il componente Link per la navigazione.
import fetchWithAuth from '../../services/fetchWithAuth.js'; // Funzione per fare chiamate API con autenticazione.
import formatData from '../../services/formatDate.js'; // Funzione per formattare le date.
import DeleteAuthor from '../../components/blog/blog-author/DeleteAuthor.jsx'; // Componente per eliminare l'autore.
import { FaRegSave, FaRegTimesCircle } from 'react-icons/fa'; // Icone per le azioni di salvataggio e annullamento.
import UpdateAvatar from './UpdateAvatar.jsx'; // Componente per aggiornare l'avatar dell'autore.

function Profile() {
  const { isLoggedIn, authorLogin, setAuthorLogin } = useContext(Context); // Ottieni lo stato dell'autore dal contesto.

  const URL = 'http://localhost:5001/api'; // URL dell'API.
  const API_URL = process.env.REACT_APP_API_URL || URL; // Usa l'URL dell'API dall'ambiente o il valore predefinito.

  const [message, setMessage] = useState(false); // Stato per visualizzare messaggi di successo.
  const [errors, setErrors] = useState({}); // Stato per memorizzare errori di validazione.

  // Stato iniziale per l'editing del profilo, con valori predefiniti per evitare input non controllati.
  const [editProfile, setEditProfile] = useState({
    name: authorLogin.name || '',
    lastname: authorLogin.lastname || '',
    email: authorLogin.email || '',
    birthdate: formatData(authorLogin.birthdate) || '',
    avatar: authorLogin.avatar || '',
  });

  // Aggiorna lo stato del profilo quando l'oggetto authorLogin cambia.
  useEffect(() => {
    if (authorLogin) {
      setEditProfile({
        name: authorLogin.name || '',
        lastname: authorLogin.lastname || '',
        email: authorLogin.email || '',
        birthdate: formatData(authorLogin.birthdate) || '',
        avatar: authorLogin.avatar || '',
      });
    }
  }, [authorLogin]);

  // Gestisce i cambiamenti nei campi del profilo.
  const handleChangeProfile = (e) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
      [name]: value
    });
    // Reset specifico errore per il campo modificato
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Funzione per validare i dati del profilo.
  const validate = () => {
    const newErrors = {};
    if (!editProfile.name.trim()) {
      newErrors.name = 'You must enter a name...'; // Errore se il nome non è inserito.
    }
    if (!editProfile.lastname.trim()) {
      newErrors.lastname = 'You must enter a lastname...'; // Errore se il cognome non è inserito.
    }
    if (!editProfile.email.trim()) {
      newErrors.email = 'You must enter an email...'; // Errore se l'email non è inserita.
    }
    if (!editProfile.birthdate.trim()) {
      newErrors.birthdate = 'You must enter a date of birth...'; // Errore se la data di nascita non è inserita.
    }
    return newErrors;
  };

  // Gestisce l'aggiornamento del profilo.
  const handleEditProfile = async (e) => {
    e.preventDefault(); // Previene l'invio del modulo predefinito.

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Imposta gli errori di validazione.
      return;
    }

    try {
      // Effettua una richiesta PATCH per aggiornare il profilo dell'autore.
      await fetchWithAuth(`${API_URL}/authors/${authorLogin._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editProfile),
      });

      setMessage(true); // Mostra un messaggio di successo.
    } catch (error) {
      console.error('Errore invio dati', error); // Log dell'errore.
    } finally {
      setTimeout(() => {
        setMessage(false); // Nasconde il messaggio dopo 1.5 secondi.
        setAuthorLogin({ ...authorLogin, ...editProfile }); // Aggiorna lo stato dell'autore nel contesto.
      }, 1500);
    }
  };

  // Funzione per aggiornare l'autore e il profilo.
  const updatedAuthor = (updatedProfile) => {
    setEditProfile(updatedProfile);
    setAuthorLogin(updatedProfile);
  };

  return (
    <Container className='content-profile'> {/* Contenitore principale per il profilo */}
      {(authorLogin && isLoggedIn) ? ( // Mostra il profilo solo se l'utente è autenticato
        <Row>
          <Col md={4}> {/* Colonna per l'immagine e l'azione di eliminazione */}
            <div className='content-image'>
              <h5 className='title-image'>Image Profile</h5>
              <div className='content-image-profile'>
                <Image
                  src={authorLogin.avatar ? authorLogin.avatar : defaultAvatar} // Mostra l'avatar dell'autore o l'avatar predefinito.
                  alt={authorLogin.avatar ? 'Image author' : 'Image author default'}
                  className='img-profile shadow'
                  roundedCircle
                />
                <UpdateAvatar authorLogin={authorLogin} updatedAuthor={updatedAuthor} /> {/* Componente per aggiornare l'avatar */}
              </div>
              <p className='text-center'>{authorLogin.name} {authorLogin.lastname}</p>
              <p className='text-muted text-center'>Account created on {formatData(authorLogin.createdAt, 'it')}</p>
              <h5 className='title-image'>Delete Account</h5>
              <DeleteAuthor author={authorLogin} /> {/* Componente per eliminare l'account */}
            </div>
          </Col>

          <Col md={8}> {/* Colonna per i dati del profilo */}
            <div className='content-dati'>
              <h5 className='title-dati'>Profile Author</h5>
              <Form onSubmit={handleEditProfile}> {/* Modulo per l'aggiornamento del profilo */}
                <Form.Group className='mb-3' controlId='edit-author-id'>
                  <Form.Label className='fw-bold'>ID</Form.Label>
                  <Form.Control
                    className='form-control-plaintext'
                    name='id'
                    placeholder={authorLogin._id}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-name'>
                  <Form.Label className='fw-bold'>Name</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='text'
                    name='name'
                    aria-label='name'
                    value={editProfile.name || ''}
                    placeholder='Insert your name...'
                    onChange={handleChangeProfile}
                  />
                  {errors.name && <p className='text-danger'>{errors.name}</p>}
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-lastname'>
                  <Form.Label className='fw-bold'>Lastname</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='text'
                    name='lastname'
                    aria-label='lastname'
                    value={editProfile.lastname || ''}
                    placeholder='Insert your lastname...'
                    onChange={handleChangeProfile}
                  />
                  {errors.lastname && <p className='text-danger'>{errors.lastname}</p>}
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-email'>
                  <Form.Label className='fw-bold'>Email</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='email'
                    name='email'
                    aria-label='email'
                    value={editProfile.email || ''}
                    placeholder='Insert your email...'
                    onChange={handleChangeProfile}
                  />
                  {errors.email && <p className='text-danger'>{errors.email}</p>}
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-birthdate'>
                  <Form.Label className='fw-bold'>Birthdate</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='date'
                    name='birthdate'
                    aria-label='birthdate'
                    value={editProfile.birthdate || ''}
                    onChange={handleChangeProfile}
                  />
                  {errors.birthdate && <p className='text-danger'>{errors.birthdate}</p>}
                </Form.Group>

                {message && <Alert className='m-3 text-center' variant='success'>Author updated successfully...</Alert>}

                <div className='d-flex justify-content-center'>
                  <Button
                    className='me-3 btn-standard btn-profile shadow'
                    aria-label='button cancel'
                    variant='outline-dark'
                    as={Link}
                    to='/'
                  >
                    <FaRegTimesCircle /> Cancel
                  </Button>
                  <Button
                    className='btn-standard btn-profile shadow'
                    type='submit'
                    aria-label='button save'
                    variant='outline-success'
                  >
                    <FaRegSave /> Save
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      ) : (
        <Alert className='mt-4 text-center' variant='light'>
          To view profile,{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link>
          or{' '}
          <Link to={'/login'} className='link-login'>
            LOGIN{' '}
          </Link>
          is required.
        </Alert>
      )}
    </Container>
  );
}

export default Profile; // Esporta il componente Profile.



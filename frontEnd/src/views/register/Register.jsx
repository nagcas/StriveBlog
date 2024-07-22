import './Register.css'; // Importa il foglio di stile specifico per il componente.

import { useState } from 'react'; // Importa l'hook useState di React.
import { Alert, Button, Container, Form } from 'react-bootstrap'; // Importa componenti di Bootstrap.
import { useNavigate } from 'react-router-dom'; // Hook per la navigazione.
import fetchWithAuth from '../../services/fetchWithAuth.js'; // Funzione per effettuare chiamate API con autenticazione.
import { FaArrowRight, FaRegTimesCircle } from 'react-icons/fa'; // Icone per registrare e resettare.

function Register() {
  const URL = 'http://localhost:5001/api'; // URL dell'API.
  const API_URL = process.env.REACT_APP_API_URL || URL; // Usa l'URL dell'API dall'ambiente o il valore predefinito.

  const navigate = useNavigate(); // Hook per navigare verso un'altra pagina.

  const [errors, setErrors] = useState({}); // Stato per memorizzare errori di validazione.
  const [message, setMessage] = useState(false); // Stato per visualizzare un messaggio di successo.

  const [register, setRegister] = useState({
    name: '',
    lastname: '',
    email: '',
    birthdate: '',
    avatar: '',
    password: ''
  }); // Stato per memorizzare i dati del modulo di registrazione.

  // Gestisce i cambiamenti nei campi di input del modulo.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegister({
      ...register,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Reset dell'errore specifico.
  };

  // Funzione per validare la data di nascita.
  const validateBirthdate = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
    const minDate = new Date('1900-01-01');

    const age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const isOldEnough = age > 18 || (age === 18 && currentDate >= new Date(birthDateObj.setFullYear(birthDateObj.getFullYear() + 18)));

    if (birthDateObj < minDate) {
      return 'Birthdate cannot be before January 1, 1900.'; // Errore se la data è prima del 1900.
    } else if (!isOldEnough) {
      return 'You must be at least 18 years old.'; // Errore se l'età è inferiore a 18 anni.
    }
    return '';
  };

  // Funzione per validare il modulo.
  const validate = () => {
    const newErrors = {};
    if (!register.name.trim()) {
      newErrors.name = 'You must enter a name.'; // Errore se il nome è vuoto.
    }
    if (!register.lastname.trim()) {
      newErrors.lastname = 'You must enter a lastname.'; // Errore se il cognome è vuoto.
    }
    if (!register.email.trim()) {
      newErrors.email = 'You must enter an email.'; // Errore se l'email è vuota.
    }
    if (!register.birthdate.trim()) {
      newErrors.birthdate = 'You must enter a birthdate.'; // Errore se la data di nascita è vuota.
    } else {
      const birthdateError = validateBirthdate(register.birthdate);
      if (birthdateError) {
        newErrors.birthdate = birthdateError; // Aggiunge l'errore se la data di nascita non è valida.
      }
    }
    if (!register.password.trim()) {
      newErrors.password = 'You must enter a password.'; // Errore se la password è vuota.
    }
    return newErrors;
  };

  // Funzione per gestire l'invio del modulo.
  const handleSaveSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo.
    const validationErrors = validate(); // Esegue la validazione.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Mostra gli errori di validazione.
      return;
    }
    setErrors({}); // Pulisce gli errori se non ci sono.
    try {
      // Effettua una richiesta POST per registrare un nuovo autore.
      await fetchWithAuth(`${API_URL}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(register),
      });
      setMessage(true); // Mostra un messaggio di successo se la registrazione è riuscita.
    } catch (error) {
      console.log(error); // Log dell'errore se la richiesta fallisce.
    } finally {
      setTimeout(() => {
        setRegister({
          name: '',
          lastname: '',
          email: '',
          birthdate: '',
          avatar: '',
          password: ''
        }); // Resetta i dati del modulo.
        setMessage(false); // Nasconde il messaggio di successo.
        navigate('/login'); // Reindirizza l'utente alla pagina di login.
      }, 1500);
    }
  };

  // Funzione per resettare il modulo.
  const handleResetForm = () => {
    setRegister({
      name: '',
      lastname: '',
      email: '',
      birthdate: '',
      avatar: '',
      password: ''
    }); // Resetta i dati del modulo.
    setErrors({}); // Pulisce gli errori.
  };

  return (
    <Container className='register-container'>
      <h2 className='text-center title-register'>Register</h2>
      <Form className='mt-5' onSubmit={handleSaveSubmit}>
        {/* Campo per il nome */}
        <Form.Group controlId='register-form-name' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Name</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='text'
            name='name'
            aria-label='name'
            placeholder='Insert your name...'
            value={register.name}
            autoFocus
            onChange={handleInputChange}
          />
          {errors.name && <p className='text-danger'>{errors.name}</p>}
        </Form.Group>

        {/* Campo per il cognome */}
        <Form.Group controlId='register-form-lastname' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Lastname</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='text'
            name='lastname'
            aria-label='lastname'
            placeholder='Insert your lastname...'
            value={register.lastname}
            onChange={handleInputChange}
          />
          {errors.lastname && <p className='text-danger'>{errors.lastname}</p>}
        </Form.Group>

        {/* Campo per l'email */}
        <Form.Group controlId='register-form-email' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Email</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='email'
            name='email'
            aria-label='email'
            placeholder='Insert your email...'
            value={register.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className='text-danger'>{errors.email}</p>}
        </Form.Group>

        {/* Campo per la data di nascita */}
        <Form.Group controlId='register-form-birthdate' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Birthdate</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='date'
            name='birthdate'
            max={new Date().toISOString().split('T')[0]} // Imposto la data massima di inserimento a oggi
            aria-label='birthdate'
            placeholder='Insert your birthdate...'
            value={register.birthdate}
            onChange={handleInputChange}
          />
          {errors.birthdate && <p className='text-danger'>{errors.birthdate}</p>}
        </Form.Group>

        {/* Campo per la password */}
        <Form.Group controlId='register-form-password' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Password</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='password'
            name='password'
            aria-label='password'
            placeholder='Insert your password...'
            value={register.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className='text-danger'>{errors.password}</p>}
        </Form.Group>
        
        {message && <Alert className='m-3 text-center' variant='success'>Registration was successful...</Alert>}

        {/* Pulsanti per inviare o resettare il modulo */}
        <Form.Group className='mt-3 btn-content'>
          <Button
            className='btn-standard btn-register mt-3 shadow'
            type='submit'
            aria-label='button save'
            variant='outline-success'
          >
            <FaArrowRight /> Register {/* Pulsante per registrarsi */}
          </Button>
          <Button
            className='btn-standard btn-register mt-3 shadow'
            type='reset'
            aria-label='button reset'
            variant='outline-dark'
            onClick={handleResetForm}
          >
            <FaRegTimesCircle /> Reset {/* Pulsante per resettare */}
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Register; // Esporta il componente Register.


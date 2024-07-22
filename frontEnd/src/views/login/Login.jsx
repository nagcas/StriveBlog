import './Login.css'; // Importa gli stili per il componente Login.

import React, { useState, useEffect } from 'react'; // Importa React e i hook useState e useEffect.
import { Alert, Button, Container, Form } from 'react-bootstrap'; // Importa i componenti di Bootstrap.
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Importa i hook e componenti per la navigazione.
import { FaArrowRight, FaGithub, FaRegTimesCircle, FaGoogle } from 'react-icons/fa'; // Importa le icone.

function Login() {

  const URL = 'http://localhost:5001/api'; // URL di base per le richieste API.
  const API_URL = process.env.REACT_APP_API_URL || URL; // URL API configurato tramite variabile d'ambiente.

  const navigate = useNavigate(); // Hook per la navigazione programmatica.
  const location = useLocation(); // Hook per ottenere l'oggetto della posizione corrente.

  const [message, setMessage] = useState(false); // Stato per il messaggio di successo.
  const [errors, setErrors] = useState({}); // Stato per gli errori di validazione.

  const [login, setLogin] = useState({
    email: '',
    password: ''
  }); // Stato per i dati di login.

  // Gestisce i cambiamenti nei campi di input.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Pulisce l'errore per il campo modificato.
  };

  // Valida i dati di login.
  const validate = () => {
    const newErrors = {};
    if (!login.email.trim()) {
      newErrors.email = 'You must enter an email..'; // Errore se l'email è vuota.
    }
    if (!login.password.trim()) {
      newErrors.password = 'You must enter a password...'; // Errore se la password è vuota.
    }
    return newErrors;
  };

  // Gestisce l'invio del modulo di login.
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del modulo.

    const validationErrors = validate(); // Valida i dati.
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Imposta gli errori di validazione.
      return;
    }

    setErrors({}); // Pulisce gli errori.

    try {
      // Invia i dati di login al server.
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        setErrors({ form: 'Login error, account non-existent...' }); // Errore se la risposta non è OK.
        throw new Error('Login error...');
      }

      const data = await response.json(); // Ottiene i dati di risposta.
      setErrors(false); // Pulisce gli errori.
      setMessage(true); // Mostra il messaggio di successo.
      localStorage.setItem('token', data.token); // Salva il token nel localStorage.
      window.dispatchEvent(new Event('storage')); // Notifica ad altri script dell'aggiornamento del localStorage.
      setTimeout(() => {
        setMessage(false); // Nasconde il messaggio dopo un breve intervallo.
        navigate('/'); // Reindirizza alla home page.
      }, 1500);

    } catch (error) {
      console.error('Error in login API call:', error); // Gestisce gli errori della chiamata API.
    }
  };

  // Gestisce il reset del modulo di login.
  const handleResetLogin = () => {
    setLogin({
      email: '',
      password: '',
    });
    setErrors({}); // Pulisce gli errori.
  };

  // Gestisce la logica di autenticazione tramite token passato come parametro nella query string.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token); // Salva il token nel localStorage.
      window.dispatchEvent(new Event('storage')); // Notifica ad altri script dell'aggiornamento del localStorage.
      navigate('/'); // Reindirizza alla home page.
    }
  }, [location, navigate]);

  // Gestisce il login tramite Google.
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`; // Reindirizza al flusso di login di Google.
  };

  // Gestisce il login tramite GitHub.
  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/auth/github`; // Reindirizza al flusso di login di GitHub.
  };

  return (
    <Container className='login-container'>
      <h2 className='text-center title-login'>Login</h2> {/* Titolo del modulo di login */}
      <Form className='mt-5' onSubmit={handleLoginSubmit}> {/* Modulo di login con gestione dell'invio */}

        <Form.Group controlId='login-form-email' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Email</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-login shadow'
            type='email'
            name='email'
            aria-label='email'
            placeholder='Insert your email...'
            value={login.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className='text-danger'>{errors.email}</p>} {/* Mostra errore email */}
        </Form.Group>

        <Form.Group controlId='login-form-password' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Password</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-login shadow'
            type='password'
            name='password'
            aria-label='password'
            placeholder='Insert your password...'
            value={login.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className='text-danger'>{errors.password}</p>} {/* Mostra errore password */}
        </Form.Group>

        {errors.form && <Alert className='m-3 text-center' variant='danger'>{errors.form}</Alert>} {/* Mostra errore generale del modulo */}
        {message && <Alert className='m-3 text-center' variant='success'>I sign in successfully...</Alert>} {/* Mostra messaggio di successo */}

        <Form.Group className='mt-3'>
          <Button
            className='btn-standard m-auto btn-login mt-3 shadow'
            type='submit'
            aria-label='button save'
            variant='outline-success'
          >
            <FaArrowRight /> Login
          </Button>
          <Button
            className='btn-standard m-auto btn-login mt-3 shadow'
            type='reset'
            aria-label='button reset'
            variant='outline-dark'
            onClick={handleResetLogin}
          >
            <FaRegTimesCircle /> Reset
          </Button>
          <Button
            variant='outline-dark'
            className='btn-standard btn-google mt-3 m-auto btn-login shadow'
            onClick={handleGoogleLogin}
          >
            <FaGoogle className='logo-google' />
            Continue with Google
          </Button>
          <Button
            variant='outline-dark'
            className='btn-standard btn-google mt-3 m-auto btn-login shadow'
            onClick={handleGitHubLogin}
          >
            <FaGithub className='logo-github' />
            Continue with GitHub
          </Button>
        </Form.Group>
        <p className='text-center text-muted mt-3'>
          You are not registered go to{' '}
          <Link to={'/register'} className='link-register'>
            REGISTER
          </Link>
        </p> {/* Link per la registrazione */}
      </Form>
    </Container>
  );
}

export default Login; // Esporta il componente Login.


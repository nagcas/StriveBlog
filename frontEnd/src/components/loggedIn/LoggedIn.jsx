import './LoggedIn.css';

import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Button, Image, Dropdown } from 'react-bootstrap';
import { Context, ThemeContext } from '../../modules/Context.js';
import defaultAvatar from '../../assets/default-avatar.jpg';
import { FaAddressBook, FaArrowRight, FaIdCard, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

function LoggedIn() {
  // Ottieni il contesto del tema e la funzione per modificarlo
  const [themeCtx, setThemeCtx] = useContext(ThemeContext);
  
  // Hook per navigare programmaticamente tra le pagine
  const navigate = useNavigate();

  // URL di base per le API
  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  // Ottieni il contesto dell'autore e le funzioni per aggiornare lo stato di login e dell'autore
  const { isLoggedIn, setIsLoggedIn, authorLogin, setAuthorLogin } = useContext(Context);

  useEffect(() => {
    // Funzione per controllare se l'utente è loggato basandosi sulla presenza del token
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Se il token è presente, l'utente è considerato loggato
          setIsLoggedIn(true);
        } catch (error) {
          // Se c'è un errore con il token, rimuovilo e considera l'utente come non loggato
          console.error('Token non valido', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } else {
        // Se il token non è presente, l'utente non è loggato
        setIsLoggedIn(false);
      }
    };

    // Verifica lo stato di login all'avvio
    checkLoginStatus();
    
    // Aggiungi eventi per rilevare modifiche nel localStorage e nello stato di login
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('loginStateChange', checkLoginStatus);

    // Rimuovi gli eventi quando il componente viene smontato per evitare perdite di memoria
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, [setIsLoggedIn]);

  useEffect(() => {
    // Funzione per recuperare i dati dell'autore loggato
    const fetchAuthor = async () => {
      try {
        // Richiedi i dati dell'autore utilizzando il token di autenticazione
        const userData = await fetchWithAuth(`${API_URL}/auth/me`);
        setAuthorLogin(userData); // Aggiorna il contesto dell'autore con i dati ricevuti
      } catch (error) {
        // Se c'è un errore nel recupero dei dati, mostra un errore e reindirizza alla pagina di login
        console.error('Errore nel recupero dei dati utente:', error);
        navigate('/login'); // Redirige l'utente alla pagina di login in caso di errore
      }
    };

    // Recupera i dati dell'autore solo se l'utente è loggato
    if (isLoggedIn) {
      fetchAuthor();
    }
  }, [isLoggedIn, navigate, setAuthorLogin, API_URL]);

  // Funzione per gestire il logout dell'utente
  const handleLogout = () => {
    localStorage.removeItem('token'); // Rimuove il token di autenticazione dal localStorage
    setIsLoggedIn(false); // Aggiorna lo stato di login a falso
    navigate('/'); // Reindirizza alla homepage
    window.dispatchEvent(new Event('storage')); // Notifica ad altri ascoltatori che il logout è avvenuto
  };

  return (
    <>
      {/* Se l'utente è loggato e i dati dell'autore sono disponibili, mostra il menu di benvenuto */}
      {(isLoggedIn && authorLogin) ? (
        <>
          <Dropdown>
            <Dropdown.Toggle className='bg-transparent border-0' variant='light' id='dropdown-basic'>
              {/* Mostra il nome dell'autore e la sua immagine di profilo */}
              <span 
                className={themeCtx === 'dark' ? 'text-white author-benvenuto fw-bold' : 'text-dark author-benvenuto fw-bold'}
              >
                Welcome {authorLogin.name}
              </span>
              <Image 
                className='image-avatar'
                src={authorLogin.avatar ? authorLogin.avatar : defaultAvatar}
                alt={authorLogin.avatar ? 'Image author' : 'Image author default'}
                roundedCircle 
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {/* Link per accedere al profilo e alla lista degli autori */}
              <Dropdown.Item as={Link} to='/profile'><FaIdCard /> Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to='/authors'><FaAddressBook /> List Authors </Dropdown.Item>
              <Dropdown.Divider />
              {/* Opzione per il logout */}
              <Dropdown.Item onClick={handleLogout}><FaSignOutAlt /> LogOut</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      ) : (
        // Se l'utente non è loggato, mostra i pulsanti per registrarsi e fare login
        <>
          <Button as={Link} to='/register' variant='outline-primary btn-standard register-navbar' className='me-1'>
            <FaSignInAlt /> Register
          </Button>
          <Button as={Link} to='/login' variant='outline-success btn-standard login-navbar'>
            <FaArrowRight /> LogIn
          </Button>
        </>
      )}
    </>
  );
}

export default LoggedIn;


    

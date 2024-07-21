import { useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Button, Image, Dropdown } from 'react-bootstrap';
import { Context } from '../../modules/Context.js';
import defaultAvatar from '../../assets/default-avatar.jpg';
import { FaAddressBook, FaArrowRight, FaIdCard, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';


function LoggedIn() {
  
  const navigate = useNavigate();

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const { isLoggedIn, setIsLoggedIn, authorLogin, setAuthorLogin } = useContext(Context);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Token non valido', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('loginStateChange', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, [setIsLoggedIn]);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const userData = await fetchWithAuth(`${API_URL}/auth/me`);
        setAuthorLogin(userData);
      } catch (error) {
        console.error('Errore nel recupero dei dati utente:', error);
        navigate('/login');
      }
    };

    if (isLoggedIn) {
      fetchAuthor();
    }
  }, [isLoggedIn, navigate, setAuthorLogin, API_URL]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <>
      {(isLoggedIn && authorLogin) ? (
        <>
        <Dropdown>
          <Dropdown.Toggle className='bg-transparent border-0' variant='light' id='dropdown-basic'>
            <span className='author-benvenuto fw-bold'>Welcome {authorLogin.name}</span>
            <Image 
              className='image-avatar'
              src={authorLogin.avatar ? authorLogin.avatar : defaultAvatar}
              alt={authorLogin.avatar ? 'Image author' : 'Image author default'}
              roundedCircle 
            />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to='/profile'><FaIdCard /> Profile</Dropdown.Item>
            <Dropdown.Item as={Link} to='/authors'><FaAddressBook /> List Authors </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}><FaSignOutAlt /> LogOut</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </>
      ) : (
        <>
          <Button as={Link} to='/register' variant='outline-primary btn-standard' className='me-3'><FaSignInAlt /> Register</Button>
          <Button as={Link} to='/login' variant='outline-success btn-standard'><FaArrowRight /> LogIn</Button>
        </>
      )}
    </>
)};

export default LoggedIn;

    

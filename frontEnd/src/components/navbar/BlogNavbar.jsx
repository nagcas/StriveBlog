import './BlogNavbar.css';

import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';
import LoggedIn from '../loggedIn/LoggedIn';
import { ThemeContext } from '../../modules/Context'; 
import { useContext } from 'react';
import { MdOutlineWbSunny } from 'react-icons/md';
import { IoMoonOutline } from 'react-icons/io5';

// Componente NavBar per la navigazione del blog
const NavBar = (props) => {
  // Ottieni il contesto del tema e la funzione per modificarlo
  const [themeCtx, setThemeCtx] = useContext(ThemeContext);

  return (
    <Navbar expand='lg' className='bg-body-tertiary fixed-top blog-navbar' bg={themeCtx} data-bs-theme={themeCtx}>
      <Container>
        {/* Logo del blog, cambia in base al tema */}
        <Navbar.Brand as={Link} to='/'>
          <img 
            className='blog-navbar-brand' 
            alt='Logo Strive' 
            src={themeCtx === 'dark' ? logoLight : logoDark}
          />
        </Navbar.Brand>

        {/* Sezione di navigazione che si espande su schermi grandi */}
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='me-auto'>
            {/* Link di navigazione con styling condizionale basato sul tema */}
            <Link className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link nav-menu' : 'text-dark text-center nav-link px-2 item-link nav-menu'} to='/'>Home</Link>
            <Link className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link nav-menu' : 'text-dark text-center nav-link px-2 item-link nav-menu'} to='/authors'>Authors</Link>
            <Link className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link nav-menu' : 'text-dark text-center nav-link px-2 item-link nav-menu'} to='/about'>About</Link>
          </Nav>
        </Navbar.Collapse>

        {/* Componente per gestire lo stato di login dell'utente */}
        <LoggedIn />

        {/* Bottone per cambiare il tema */}
        <Button variant='dark' className='mx-1 btn-theme' onClick={() => {
          // Cambia il tema tra 'light' e 'dark' quando il bottone viene cliccato
          themeCtx === 'light' ? setThemeCtx('dark') : setThemeCtx('light');
        }}>
          {/* Mostra l'icona corrispondente al tema corrente */}
          {themeCtx === 'dark' ? <IoMoonOutline /> : <MdOutlineWbSunny /> }
        </Button>

        {/* Bottone per espandere/collassare il menu di navigazione su schermi piccoli */}
        <Navbar.Toggle aria-controls='navbarScroll' />
      </Container>
    </Navbar>
  );
}

export default NavBar;



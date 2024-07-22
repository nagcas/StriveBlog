import './BlogNavbar.css';

import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import LoggedIn from '../loggedIn/LoggedIn';
import { ThemeContext } from '../../modules/Context'; 
import { useContext } from 'react';
import { MdOutlineWbSunny } from 'react-icons/md';
import { IoMoonOutline } from 'react-icons/io5';


const NavBar = (props) => {

  const [themeCtx, setThemeCtx] = useContext(ThemeContext);

  return (
    <Navbar expand='lg' className='bg-body-tertiary fixed-top blog-navbar' bg={themeCtx} data-bs-theme={themeCtx}>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <img className='blog-navbar-brand' alt='Logo Strive' src={logo} />
        </Navbar.Brand>
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='me-auto'>
            <Link className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link nav-menu' : 'text-dark text-center nav-link px-2 item-link nav-menu'} to='/'>Home</Link>
            <Link className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link nav-menu' : 'text-dark text-center nav-link px-2 item-link nav-menu'} to='/authors'>Authors</Link>
            <Link className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link nav-menu' : 'text-dark text-center nav-link px-2 item-link nav-menu'} to='/about'>About</Link>
          </Nav>
        </Navbar.Collapse>
        <LoggedIn />
        {/* Bottone per cambiare il tema */}
        <Button variant='dark' className='mx-3' onClick={() => {
          // Cambio del tema al click del bottone
          themeCtx === 'light' ? setThemeCtx('dark') : setThemeCtx('light');
        }}>
          {/* Icona del tema corrente */}
          {themeCtx === 'dark' ? <IoMoonOutline /> : <MdOutlineWbSunny /> } 
        </Button>
        <Navbar.Toggle aria-controls='navbarScroll' />
      </Container>
    </Navbar>
  );
}

export default NavBar;


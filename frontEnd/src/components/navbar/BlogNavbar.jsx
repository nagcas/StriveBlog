import './BlogNavbar.css';

import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import LoggedIn from '../loggedIn/LoggedIn';


const NavBar = (props) => {

  return (
    <Navbar expand='lg' className='bg-body-tertiary fixed-top blog-navbar'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          <img className='blog-navbar-brand' alt='Logo Strive' src={logo} />
        </Navbar.Brand>
        <Navbar.Collapse id='navbarScroll'>
          <Nav className='me-auto'>
            <Link className='nav-link nav-menu' to='/'>Home</Link>
            <Link className='nav-link nav-menu' to='/authors'>Authors</Link>
            <Link className='nav-link nav-menu' to='/about'>About</Link>
          </Nav>
        </Navbar.Collapse>
        <LoggedIn />
        <Navbar.Toggle aria-controls='navbarScroll' />
      </Container>
    </Navbar>
  );
}

export default NavBar;


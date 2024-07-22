import './BlogFooter.css';

import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import { ThemeContext } from '../../modules/Context';


const Footer = (props) => {

  const [themeCtx] = useContext(ThemeContext);
  
  return (
    <footer className={'bg-' + themeCtx + ' d-flex align-items-center text-center footer'}>
      <Container className={themeCtx === 'dark' ? 'text-white text-center nav-link px-2 item-link' : 'text-dark text-center nav-link px-2 item-link'}>
        {`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}
        </Container>
    </footer>
  );
};

export default Footer;

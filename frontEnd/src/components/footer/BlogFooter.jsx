import './BlogFooter.css';

import React from 'react';
import { Container } from 'react-bootstrap';


const Footer = (props) => {
  
  return (
    <footer className='d-flex align-items-center text-center footer'>
      <Container>{`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}</Container>
    </footer>
  );
};

export default Footer;

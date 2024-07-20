import './NotFound.css';

import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import video from '../../assets/Video WhatsApp 2024-07-19 ore 23.51.01_93b88d2d.mp4'


function NotFound() {

  return (
    <Container className='page-not-found'>
      <div className='content'>
        <video width="80%" height="auto" controls autoplay muted loop>
          <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
        </video>
        <h5>by Maria Alessandra Chiaravalloti 🥰🥰🥰</h5>
        <h4>Opps! Page not found</h4>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <Button
          as={Link}
          to='/'
          variant='dark'
          className='btn-standard'
        >
          Back to Home
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;

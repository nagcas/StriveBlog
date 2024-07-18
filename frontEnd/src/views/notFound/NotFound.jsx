import './NotFound.css';

import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container className='page-not-found'>
      <div className='content'>
        <h1>4🤯4</h1>
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

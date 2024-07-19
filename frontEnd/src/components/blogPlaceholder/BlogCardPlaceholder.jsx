import './BlogCardPlaceholder.css';

import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';


const BlogCardPlaceholder = () => {
  return (
    <Card className='blog-card shadow mt-4'>
      <div className='blog-link'>
        <Placeholder as={Card.Img} variant='top' className='blog-cover' />
        <Card.Body>
          <Placeholder as={Card.Title} className='card-title' animation='glow'>
            <Placeholder xs={6} />
          </Placeholder>
          <Placeholder as='span' className='category' animation='glow'>
          </Placeholder>
        </Card.Body>
        <Card.Subtitle className='p-2'>
          <Placeholder as='span' animation='glow'>
            <Placeholder xs={7} className='image-author' /> <Placeholder xs={4} />
          </Placeholder>
        </Card.Subtitle>
      </div>
      <Card.Footer>
        <div className='d-flex justify-content-end p-2 gap-3'>
          <Placeholder variant='outline-warning' className='btn-standard' disabled>
            Edit
          </Placeholder>
          <Placeholder variant='outline-danger' className='btn-standard' disabled>
            Delete
          </Placeholder>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default BlogCardPlaceholder;
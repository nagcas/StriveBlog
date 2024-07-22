import './BlogCardPlaceholder.css'; // Importa il file CSS per il componente BlogCardPlaceholder

import React from 'react'; // Importa la libreria React
import { Card, Placeholder } from 'react-bootstrap'; // Importa i componenti Card e Placeholder da React-Bootstrap

const BlogCardPlaceholder = () => {
  // Definisce il componente funzionale BlogCardPlaceholder
  return (
    <Card className='blog-card shadow mt-4'>
      {/* Card che rappresenta il placeholder per un blog post */}
      <div className='blog-link'>
        <Placeholder as={Card.Img} variant='top' className='blog-cover' />
        {/* Placeholder per l'immagine di copertina */}
        <Card.Body>
          {/* Corpo della card */}
          <Placeholder as={Card.Title} className='card-title' animation='glow'>
            {/* Placeholder per il titolo, con animazione 'glow' */}
            <Placeholder xs={6} />
            {/* Placeholder per il testo del titolo */}
          </Placeholder>
          <Placeholder as='span' className='category' animation='glow'>
            {/* Placeholder per la categoria, con animazione 'glow' */}
          </Placeholder>
        </Card.Body>
        <Card.Subtitle className='p-2'>
          {/* Sottotitolo della card */}
          <Placeholder as='span' animation='glow'>
            {/* Placeholder per l'autore, con animazione 'glow' */}
            <Placeholder xs={7} className='image-author' /> <Placeholder xs={4} />
            {/* Placeholder per l'immagine dell'autore e il nome */}
          </Placeholder>
        </Card.Subtitle>
      </div>
      <Card.Footer>
        {/* Footer della card */}
        <div className='d-flex justify-content-end p-2 gap-3'>
          {/* Contenitore per i pulsanti di azione */}
          <Placeholder variant='outline-warning' className='btn-standard' disabled>
            Edit
          </Placeholder>
          {/* Placeholder per il pulsante 'Edit' */}
          <Placeholder variant='outline-danger' className='btn-standard' disabled>
            Delete
          </Placeholder>
          {/* Placeholder per il pulsante 'Delete' */}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default BlogCardPlaceholder; // Esporta il componente BlogCardPlaceholder per l'uso in altri file

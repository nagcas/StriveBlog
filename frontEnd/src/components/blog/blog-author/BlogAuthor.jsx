import './BlogAuthor.css';
import React, { useEffect, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import defaultAvatar from '../../../assets/default-avatar.jpg';

const BlogAuthor = ({ email }) => {
  // Definizione dell'URL API con fallback
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    // Funzione per recuperare gli autori dall'API
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${API_URL}/authors`);
        if (!response.ok) throw new Error('Errore nella risposta del server');
        const data = await response.json();
        setAuthors(data.authors);
      } catch (error) {
        console.error('Errore nel recupero degli autori:', error);
        // Qui potresti gestire l'errore, ad esempio impostando uno stato di errore
      }
    };

    fetchAuthors();
  }, [API_URL]);

  // Trova l'autore corrente o restituisce un oggetto vuoto
  const currentAuthor = authors.find(author => author.email === email) || {};

  return (
    <Row>
      <Col xs="auto" className="pe-0">
        <Image 
          className="blog-author" 
          src={currentAuthor.avatar || defaultAvatar}
          alt={`Avatar di ${currentAuthor.name || 'utente sconosciuto'}`}
          roundedCircle 
        />
      </Col>
      <Col className="m-2">
        <div>di</div>
        <h6 className="text-muted">{currentAuthor.name || email}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;

import './BlogAuthor.css';

import React, { useEffect, useState } from 'react';
import { Col, Image, Row } from 'react-bootstrap';
import defaultAvatar from '../../../assets/default-avatar.jpg';


const BlogAuthor = (props) => {
  
  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const [authors, setAuthors] = useState([]);
  const { email } = props;

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${API_URL}/authors`);
        const data = await response.json();
        //console.log(data.authors);
        setAuthors(data.authors);
        console.log(data.authors);
      } catch (error) {
        console.error('Errore nella richiesta', error);
      }
    };

    fetchAuthors();
  }, [API_URL]);

  /**
   * avatar.find((user) => user.email === email):

    avatar è un array che contiene oggetti, ciascuno rappresentante un autore.
    .find((user) => user.email === email) è un metodo degli array in JavaScript che cerca nel'array avatar il primo elemento che soddisfa la condizione specificata nella funzione di callback.
    La funzione di callback (user) => user.email === email verifica se l'email dell'utente (user.email) corrisponde all'email passata come prop al componente (email).
    Se trova un oggetto che soddisfa questa condizione, .find restituisce quell'oggetto. Se nessun oggetto soddisfa la condizione, .find restituisce undefined.
    
    || {}:

    L'operatore logico OR (||) viene utilizzato qui per fornire un valore di fallback.
    Se .find non trova un oggetto corrispondente e restituisce undefined, il valore undefined verrà considerato 'falso' in un contesto booleano.
    In tal caso, l'operatore OR restituirà il secondo operando {}, cioè un oggetto vuoto.
    Se invece .find trova un oggetto corrispondente, restituirà quell'oggetto, e l'operatore OR non avrà effetto.
   */


  const currentAuthor = authors.find((author) => author.email === email) || {};


  return (
    <Row>
      <Col xs={'auto'} className='pe-0'>
        <Image 
          className='blog-author' 
          src={currentAuthor.avatar ? currentAuthor.avatar : defaultAvatar}
          alt={currentAuthor.avatar ? 'Image user' : 'Image user default'} 
          roundedCircle 
        />
      </Col>
      <Col className='m-2'>
        <div>di</div>
        <h6 className='text-muted'>{email}</h6>
      </Col>
    </Row>
  );
};

export default BlogAuthor;

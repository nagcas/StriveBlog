import React, { useState, useEffect } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { Button } from 'react-bootstrap';

// ID dell'utente attualmente loggato
const yourUserId = '123';

function BlogLike({ defaultLikes, onChange }) {
  // Stato per gestire i like del post
  const [likes, setLikes] = useState(defaultLikes);
  // Verifica se l'utente ha già messo mi piace a questo post
  const iLikedThisArticle = likes.includes(yourUserId);

  // Funzione per gestire il click sul pulsante di like
  const toggleLike = () => {
    let updatedLikes;
    if (iLikedThisArticle) {
      // Rimuove il like se l'utente ha già messo mi piace
      updatedLikes = likes.filter((id) => id !== yourUserId);
    } else {
      // Aggiunge il like se l'utente non ha ancora messo mi piace
      updatedLikes = [...likes, yourUserId];
    }
    // Aggiorna lo stato dei like
    setLikes(updatedLikes);
    // Chiama la funzione di callback se fornita
    onChange && onChange(updatedLikes);
  };

  // Effetto collaterale per chiamare la funzione di callback quando i like cambiano
  useEffect(() => {
    onChange && onChange(likes);
  }, [likes, onChange]);

  return (
    <div>
      <Button
        onClick={toggleLike} // Gestisce il click sul pulsante di like
        aria-label='button like' // Fornisce un'etichetta per l'accessibilità
        variant={iLikedThisArticle ? 'dark' : 'outline-dark'} // Cambia il colore del pulsante in base allo stato del like
        className='btn-standard'
      >
        <AiOutlineLike /> {`${likes.length} like${likes.length !== 1 ? 's' : ''}`}
      </Button>
    </div>
  );
}

export default BlogLike; // Esporta il componente BlogLike



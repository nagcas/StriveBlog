import React, { useState, useEffect } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { Button } from 'react-bootstrap';

const yourUserId = '123';

function BlogLike({ defaultLikes, onChange }) {
  const [likes, setLikes] = useState(defaultLikes);
  const iLikedThisArticle = likes.includes(yourUserId);

  const toggleLike = () => {
    let updatedLikes;
    if (iLikedThisArticle) {
      updatedLikes = likes.filter((id) => id !== yourUserId);
    } else {
      updatedLikes = [...likes, yourUserId];
    }
    setLikes(updatedLikes);
    onChange && onChange(updatedLikes);
  };

  useEffect(() => {
    onChange && onChange(likes);
  }, [likes, onChange]);

  return (
    <div>
      <Button
        onClick={toggleLike}
        aria-label='button like'
        variant={iLikedThisArticle ? 'dark' : 'outline-dark'}
        className='btn-standard'
      >
        <AiOutlineLike /> {`${likes.length} like${likes.length !== 1 ? 's' : ''}`}
      </Button>
    </div>
  );
}

export default BlogLike;


import './BlogItem.css';

import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BlogAuthor from '../blog-author/BlogAuthor';
import DeletePost from './DeletePost';
import { FaEdit } from 'react-icons/fa';
import { Context } from '../../../modules/Context.js';
import { useContext } from 'react';


const BlogItem = (props) => {
  
  const { title, category, cover, author, _id, getFetchPosts } = props;

  const { authorLogin, isLoggedIn } = useContext(Context);

  return (
    <Card className='blog-card'>
      <Link to={`/blogPosts/${_id}`} className='blog-link'>
        <span className='category float-start m-2'>{category}</span>
        <Card.Img variant='top' src={cover} className='blog-cover' />
        <Card.Body>
          <Card.Title className='card-title'>{title}</Card.Title>
        </Card.Body>
        <Card.Subtitle className='p-2'>
          <BlogAuthor {...author} />
        </Card.Subtitle>
      </Link>
      {isLoggedIn && (authorLogin.email === author.email) && ( 
        <Card.Footer>
          <div className='d-flex justify-content-center p-2 gap-3 button-card-item'>
            <Button variant='outline-warning' className='btn-standard' as={Link} to={`/editPost/${_id}`}>
              <FaEdit className='fa-icon'/>
              Edit
            </Button>
            <DeletePost id={_id} title={title} getFetchPosts={getFetchPosts} />
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default BlogItem;



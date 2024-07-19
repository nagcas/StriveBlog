import './Blog.css';

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Container, Image, Spinner } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import BlogAuthor from '../../components/blog/blog-author/BlogAuthor';
import BlogLike from '../../components/likes/BlogLike';
import CommentList from '../../components/commentArea/CommentList';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context.js';
import { useContext } from 'react';
import formatData from '../../services/formatDate.js';


const Blog = (props) => {

  const { isLoggedIn } = useContext(Context);

  const params = useParams();
  const { id } = params;

  const URL = 'http://localhost:5001/api';
  const API_URL = (import.meta.env && import.meta.env.URL) || URL;

  const [blog, setBlog] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API_URL}/blogPosts/${id}`);
      console.log(response);
      setBlog(response);
      setComments(response.comments);
    } catch (error) {
      console.error('Errore', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (loading) {
    return (
      <div>
        <Spinner animation='border' variant='secondary' className='mx-5' />
      </div>
    );
  } else {
    return (
      <div className='blog-details-root'>
        <Container>
          <Image className='blog-details-cover' src={blog.cover} fluid />
          <h1 className='blog-details-title'>{blog.title}</h1>

          <div className='blog-details-container'>
            <div className='blog-details-author'>
              <BlogAuthor {...blog.author} />
            </div>
            <div className='blog-details-info'>
              <div>
                {formatData(blog.createdAt, 'it')}
              </div>
              <div>{blog.readTime?.value} {blog.readTime?.unit}</div>
              <div style={{ marginTop: 20 }}>
                <BlogLike defaultLikes={['123']} onChange={console.log} />
              </div>
            </div>
          </div>
          
          <div className='content-post' dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          {isLoggedIn ? 
            <CommentList id={blog._id} comments={comments} fetchBlog={fetchBlog} />
          :
          <Alert className='mt-4 text-center' variant='light'>
            To view and leave a comment,{' '} 
            <Link to={'/register'} className='link-register'>
              REGISTRATION{' '}
            </Link> 
              or{' '} 
            <Link to={'/login'} className='link-login'>
              LOGIN{' '}
            </Link>
            is required.
          </Alert> 
          }
        </Container>
      </div>
    );
  }
};

export default Blog;



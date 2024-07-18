import './EditPost.css';

import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context';

function EditPost() {
  
  const navigate = useNavigate();
  const { id } = useParams();

  const URL = `http://localhost:5001/api/blogPosts/${id}`;

  const [message, setMessage] = useState(false);
  const [stateButton, setStateButton] = useState(true);
  const [errors, setErrors] = useState({});

  const { authorLogin, isLoggedIn } = useContext(Context);

  const initialState =
    {
      title: '',
      category: '',
      readTime: {
        value: 1,
        unit: ''
      },
      author: {
        email: authorLogin.email || ''
      },
      content: '',
      cover: '',
    };

  const [editPost, setEditPost] = useState(initialState);


  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetchWithAuth(URL);
        setEditPost(response);
        console.log(response);
      } catch (error) {
        console.error('Post not loaded correctly...', error);
      }
    };
    fetchPostData();
  }, [URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'readTimeValue') {
      setEditPost({ ...editPost, readTime: { ...editPost.readTime, value: parseInt(value) } });
    } else if (name === 'readTimeUnit') {
      setEditPost({ ...editPost, readTime: { ...editPost.readTime, unit: value } });
      setErrors((prevErrors) => ({
        ...prevErrors,
        readTimeUnit: ''
      }));
    } else if (name === 'authorEmail') {
      setEditPost({ ...editPost, author: { ...editPost.author, email: value } 
    });
      
      setErrors((prevErrors) => ({
        ...prevErrors,
        authorEmail: ''  
      }));
    } else {
      setEditPost({ ...editPost, [name]: value });
      
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!editPost.category.trim()) {
      newErrors.category = 'You must enter a category...';
    }
    if (!editPost.title.trim()) {
      newErrors.title = 'You must enter a title...';
    }
    if (!editPost.readTime.unit.trim()) {
      newErrors.readTimeUnit = 'You must enter a unit time...';
    }
    if (!editPost.content.trim()) {
      newErrors.content = 'You must enter content...';
    }
    return newErrors;
  };

  
  const handleEditPost = async (e) => {
    e.preventDefault();
  
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setErrors({});
  
    try {
      const response = await fetchWithAuth(URL, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json' // importante bisogna cambiare con multipart/form-data
        },
        body: JSON.stringify(editPost),
      });
      console.log(response);
      setMessage(true);
      setStateButton(false);
    } catch (err) {
      console.log('Error editing post...', err);
    } finally {
      setTimeout(() => {
        setMessage(false);
        setStateButton(true);
        navigate('/');
      }, 1500);
    }
  };
  
  const handleResetForm = () => {
    setEditPost(initialState);
    //setCoverFile(null);
    setErrors({});
  };

  return (
    <Container className='new-blog-container'>
      {(isLoggedIn && authorLogin) ? (
        <Form className='mt-5' onSubmit={handleEditPost}>
          <h4 className='text-center edit-title'>Edit Post id: {id}</h4>
          <p className='mx-2 mt-2 float-end'>Fields marked with * are mandatory.</p>
          <Form.Group controlId='blog-form-title' className='mt-3'>
            <Form.Label className='fw-bold'>*Title</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit shadow'
              type='text'
              name='title'
              aria-label='title'
              placeholder='Enter the title...'
              value={editPost.title}
              onChange={handleInputChange}
              autoFocus
            />

            {errors.title && <p className='text-danger'>{errors.title}</p>}

          </Form.Group>

          <Form.Group controlId='blog-form-category' className='mt-3'>
            <Form.Label className='fw-bold'>*Category</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit shadow'
              as='select'
              name='category'
              aria-label='category'
              value={editPost.category}
              onChange={handleInputChange}
            >
              <option value=''>Select a category</option>
              <option value='Tech'>Tech</option>
              <option value='Technology'>Technology</option>
              <option value='Health'>Health</option>
              <option value='Science'>Science</option>
              <option value='Business'>Business</option>
            </Form.Control>

            {errors.category && <p className='text-danger'>{errors.category}</p>}
          
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId='blog-form-readtime' className='mt-3'>
              <Form.Label className='fw-bold'>Numeric time value <span className='text-muted'>(default 1)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-edit shadow'
                  type='number'
                  name='readTimeValue'
                  min='1'
                  placeholder='Enter reading time in numbers...'
                  value={editPost.readTime.value}
                  onChange={handleInputChange}
                />
                
                {errors.readTime && <p className='text-danger'>{errors.readTime.value}</p>}
              
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='blog-form-readunit' className='mt-3'>
              <Form.Label className='fw-bold'>*Reading time <span className='text-muted'>(hours, minutes, seconds)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-edit shadow'
                  as='select'
                  name='readTimeUnit'
                  aria-label='readTimeUnit'
                  value={editPost.readTime.unit}
                  onChange={handleInputChange}
                >
                  <option value=''>Select a reading time</option>
                  <option value='seconds'>seconds</option>
                  <option value='minutes'>minutes</option>
                  <option value='hours'>hours</option>
                </Form.Control>

                {errors.readTimeUnit && <p className='text-danger'>{errors.readTimeUnit}</p>}

              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId='blog-form-author' className='mt-3'>
            <Form.Label className='fw-bold'>Author</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit shadow'
              type='email'
              name='authorEmail'
              placeholder={authorLogin.email}
              value={editPost.author.email}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId='blog-form-content' className='mt-3'>
            <Form.Label className='fw-bold'>*Content</Form.Label>
            <Form.Control
              className='border-0 input-edit shadow'
              as='textarea'
              name='content'
              style={{ height: '150px' }}
              placeholder='Enter article text...'
              value={editPost.content}
              onChange={handleInputChange}
            />
            
            {errors.content && <p className='text-danger'>{errors.content}</p>}

          </Form.Group>

          <Form.Group controlId='blog-form-cover' className='mt-3'>
            <Form.Label className='fw-bold'>Cover <span className='text-muted'>(in the absence of a cover, a default one is inserted)</span></Form.Label>
            <Form.Control
              className='border-0 border-bottom input-edit p-4 shadow'
              type='text'
              name='cover'
              placeholder='Insert cover link...'
              value={editPost.cover}
              onChange={handleInputChange}
            />
          </Form.Group>

          {message && <Alert className='mt-3 text-center' variant='success'>Post updated successfully...</Alert>}
          
          {stateButton && 
            <Form.Group className='d-flex mt-3 justify-content-end'>
              <Button
                className='me-3 btn-standard btn-edit shadow'
                as={Link}
                to='/'
                type='buttom'
                aria-label='button back to home'
                variant='outline-dark'
              >
                Back to Home
              </Button>
              <Button
                className='me-3 btn-standard btn-edit shadow'
                type='reset' 
                variant='outline-dark'
                aria-label='button reset'
                onClick={handleResetForm}
              >
                Reset
              </Button>
              <Button
                className='btn-standard btn-edit shadow'
                type='submit'
                variant='outline-success'
                aria-label='button save'
              >
                Save
              </Button>
            </Form.Group>
          }
        </Form>
      ) : (
        <Alert className='mt-4 text-center' variant='light'>
          To edit a post,{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link> 
            or{' '} 
          <Link to={'/login'} className='link-register'>
            LOGIN{' '}
          </Link>
          is required.
        </Alert>
      )}
    </Container>
  );
}

export default EditPost;


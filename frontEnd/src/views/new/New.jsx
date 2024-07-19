import './New.css';

import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context';
import { FaHome, FaRegSave, FaRegTimesCircle } from 'react-icons/fa';

const NewBlogPost = () => {
  const { isLoggedIn, authorLogin } = useContext(Context);
  const navigate = useNavigate();
  const URL = 'http://localhost:5001/api/blogPosts';

  const [message, setMessage] = useState(false);
  const [stateButton, setStateButton] = useState(true);
  const [errors, setErrors] = useState({});
  const [coverFile, setCoverFile] = useState(null);

  const initialState = {
    title: '',
    category: '',
    readTime: {
      value: 1,
      unit: ''
    },
    author: {
      email: authorLogin.email
    },
    content: '',
    cover: ''
  };

  const [newPost, setNewPost] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'readTimeValue') {
      setNewPost({ ...newPost, readTime: { ...newPost.readTime, value: parseInt(value) } });
    } else if (name === 'readTimeUnit') {
      setNewPost({ ...newPost, readTime: { ...newPost.readTime, unit: value } });
      setErrors((prevErrors) => ({ ...prevErrors, readTimeUnit: '' }));
    } else {
      setNewPost({ ...newPost, [name]: value });
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!newPost.category.trim()) {
      newErrors.category = 'You must enter a category...';
    }
    if (!newPost.title.trim()) {
      newErrors.title = 'You must enter a title...';
    }
    if (!newPost.readTime.unit.trim()) {
      newErrors.readTimeUnit = 'You must enter a unit time...';
    }
    if (!newPost.content.trim()) {
      newErrors.content = 'You must enter content...';
    }
    return newErrors;
  };

  const handleFileChange = (e) => {
    setCoverFile(e.target.files[0]);
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append('category', newPost.category);
    formData.append('title', newPost.title);
    formData.append('cover', coverFile);
    formData.append('readTime.value', newPost.readTime.value);
    formData.append('readTime.unit', newPost.readTime.unit);
    formData.append('author.email', newPost.author.email);
    formData.append('content', newPost.content);
    return formData;
  };

  const savePost = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const formData = createFormData();

    try {
      const response = await fetchWithAuth(URL, {
        method: 'POST',
        body: formData,
      });

      console.log(response);
      setMessage(true);
      setStateButton(false);
      setNewPost(initialState);
      setCoverFile(null);
    } catch (error) {
      console.error('Post not sent correctly...', error);
    } finally {
      setTimeout(() => {
        setMessage(false);
        setStateButton(true);
        navigate('/');
      }, 1500);
    }
  };

  const handleResetForm = () => {
    setNewPost(initialState);
    setCoverFile(null);
    setErrors({});
  };

  return (
    <Container className='new-blog-container'>
      {isLoggedIn ? (
        <Form className='mt-5' onSubmit={savePost}>
          <h4 className='text-center title-new'>New Post</h4>
          <p className='float-end text-muted'>Fields marked with * are mandatory.</p>

          <Form.Group controlId='blog-form-title' className='mt-3'>
            <Form.Label className='fw-bold'>*Title</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              type='text'
              name='title'
              aria-label='title'
              placeholder='Enter the title...'
              value={newPost.title}
              autoFocus
              onChange={handleInputChange}
            />
            {errors.title && <p className='text-danger'>{errors.title}</p>}
          </Form.Group>

          <Form.Group controlId='blog-form-category' className='mt-3'>
            <Form.Label className='fw-bold'>*Category</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              as='select'
              name='category'
              aria-label='category'
              value={newPost.category}
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
                  className='border-0 border-bottom input-new shadow'
                  type='number'
                  name='readTimeValue'
                  aria-label='readTimeValue'
                  min='1'
                  placeholder='Enter reading time in numbers...'
                  value={newPost.readTime.value}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId='blog-form-readunit' className='mt-3'>
                <Form.Label className='fw-bold'>*Reading time <span className='text-muted'>(hours, minutes, seconds)</span></Form.Label>
                <Form.Control
                  className='border-0 border-bottom input-new shadow'
                  as='select'
                  name='readTimeUnit'
                  aria-label='readTimeUnit'
                  value={newPost.readTime.unit}
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
              className='border-0 border-bottom input-new shadow'
              type='email'
              name='authorEmail'
              aria-label='author email'
              placeholder={authorLogin.email}
              value={newPost.author.email}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId='blog-form-content' className='mt-3'>
            <Form.Label className='fw-bold'>*Content</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new shadow'
              as='textarea'
              name='content'
              aria-label='content'
              style={{ height: '150px' }}
              placeholder='Enter article text...'
              value={newPost.content}
              onChange={handleInputChange}
            />
            {errors.content && <p className='text-danger'>{errors.content}</p>}
          </Form.Group>

          <Form.Group controlId='blog-form-cover' className='mt-3'>
            <Form.Label className='fw-bold'>Cover <span className='text-muted'>(in the absence of a cover, a default one is inserted)</span></Form.Label>
            <Form.Control
              className='border-0 border-bottom input-new input-cover shadow'
              type='file'
              name='cover'
              aria-label='cover'
              onChange={handleFileChange}
            />
          </Form.Group>

          {stateButton && (
            <Form.Group className='d-flex mt-3 justify-content-end'>
              <Button
                className='btn-standard mt-3 btn-new shadow'
                as={Link}
                to={'/'}
                type='button'
                aria-label='button back to home'
                variant='outline-dark'
              >
                <FaHome /> Back to Home
              </Button>

              <Button
                className='btn-standard mt-3 btn-new shadow'
                type='reset'
                aria-label='button reset'
                variant='dark'
                onClick={handleResetForm}
              >
                <FaRegTimesCircle /> Reset
              </Button>

              <Button
                className='btn-standard mt-3 btn-new shadow'
                aria-label='button save'
                variant='outline-success'
                type='submit'
              >
                <FaRegSave /> Save
              </Button>
            </Form.Group>
          )}
          {message && <Alert className='mt-3 text-center' variant='success'>Post created successfully...</Alert>}
        </Form>
      ) : (
        <Alert className='mt-4 text-center' variant='light'>
          To view the list of authors, is required{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link> 
          or{' '} 
          <Link to={'/login'} className='link-register'>
            LOGIN{' '}
          </Link>
          required.
        </Alert>
      )}
    </Container>
  );
};

export default NewBlogPost;


import './Login.css';

import React, { useState, useEffect } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaArrowRight, FaGithub, FaRegTimesCircle } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';


function Login() {

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState({});

  const [login, setLogin] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLogin({
      ...login,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!login.email.trim()) {
      newErrors.email = 'You must enter an email..';
    }
    if (!login.password.trim()) {
      newErrors.password = 'You must enter a password...';
    }
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {

    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(login),
      });

      if (!response.ok) {
        setErrors({ form: 'Login error, account non-existent...' });
        throw new Error('Login error...');
      }

      const data = await response.json();
      setErrors(false);
      setMessage(true);
      localStorage.setItem('token', data.token);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => {
        setMessage(false);
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Error in login API call:', error);
    }
  };

  const handleResetLogin = () => {
    setLogin({
      email: '',
      password: '',
    });
    setErrors({});
  };

  useEffect(() => {

    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `${API_URL}/auth/github`;
  };

  return (
    <Container className='login-container'>
      <h2 className='text-center title-login'>Login</h2>
      <Form className='mt-5' onSubmit={handleLoginSubmit}>

        <Form.Group controlId='login-form-email' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Email</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-login shadow'
            type='email'
            name='email'
            aria-label='email'
            placeholder='Insert your email...'
            value={login.email}
            onChange={handleInputChange}
          />

          {errors.email && <p className='text-danger'>{errors.email}</p>}

        </Form.Group>

        <Form.Group controlId='login-form-password' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Password</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-login shadow'
            type='password'
            name='password'
            aria-label='password'
            placeholder='Insert your password...'
            value={login.password}
            onChange={handleInputChange}
          />

          {errors.password && <p className='text-danger'>{errors.password}</p>}

        </Form.Group>

        {errors.form && <Alert className='m-3 text-center' variant='danger'>{errors.form}</Alert>}
        
        {message && <Alert className='m-3 text-center' variant='success'>I sign in successfully...</Alert>}

        <Form.Group className='mt-3'>
          <Button
            className='btn-standard m-auto btn-login mt-3 shadow'
            type='submit'
            aria-label='button save'
            variant='outline-success'
          >
            <FaArrowRight /> Login
          </Button>

          <Button
            className='btn-standard m-auto btn-login mt-3 shadow'
            type='reset'
            aria-label='button reset'
            variant='outline-dark'
            onClick={handleResetLogin}
          >
            <FaRegTimesCircle /> Reset
          </Button>

          <Button
            variant='outline-dark'
            className='btn-standard btn-google mt-3 m-auto btn-login shadow'
            onClick={handleGoogleLogin}
          >
            <FaGoogle className='logo-google' />
            Continue with Google
          </Button>
          <Button
            variant='outline-dark'
            className='btn-standard btn-google mt-3 m-auto btn-login shadow'
            onClick={handleGitHubLogin}
          >
            <FaGithub className='logo-github' />
            Continue with GitHub
          </Button>
        </Form.Group>
        <p className='text-center text-muted mt-3'>
          You are not registered go to{' '}
          <Link to={'/register'} className='link-register'>
            REGISTER
          </Link>
        </p>
      </Form>
    </Container>
  );
}

export default Login;

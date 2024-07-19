import './Register.css';

import { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth.js';
import { FaArrowRight, FaRegTimesCircle } from 'react-icons/fa';


function Register() {

  const URL = 'http://localhost:5001/api';
  const API_URL = import.meta.env.URL || URL;

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [register, setRegister] = useState({
    name: '',
    lastname: '',
    email: '',
    birthdate: '',
    avatar: '',
    password: ''
  });
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegister({
      ...register,
      [name]: value
    });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateBirthdate = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
    const minDate = new Date('1900-01-01');

    const age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const isOldEnough = age > 18 || (age === 18 && currentDate >= new Date(birthDateObj.setFullYear(birthDateObj.getFullYear() + 18)));

    if (birthDateObj < minDate) {
      return 'Birthdate cannot be before January 1, 1900.';
    } else if (!isOldEnough) {
      return 'You must be at least 18 years old.';
    }
    return '';
  };

  const validate = () => {
    const newErrors = {};
    if (!register.name.trim()) {
      newErrors.name = 'You must enter a name.';
    }
    if (!register.lastname.trim()) {
      newErrors.lastname = 'You must enter a lastname.';
    }
    if (!register.email.trim()) {
      newErrors.email = 'You must enter an email.';
    }
    if (!register.birthdate.trim()) {
      newErrors.birthdate = 'You must enter a birthdate.';
    } else {
      const birthdateError = validateBirthdate(register.birthdate);
      if (birthdateError) {
        newErrors.birthdate = birthdateError;
      }
    }
    if (!register.password.trim()) {
      newErrors.password = 'You must enter a password.';
    }
    return newErrors;
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const data = await fetchWithAuth(`${API_URL}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(register),
      });
      console.log('Risultato:', data);
    } catch (error) {
      console.log(error);
    } finally {
      navigate('/login');
      setRegister({
        name: '',
        lastname: '',
        email: '',
        birthdate: '',
        avatar: '',
        password: ''
      });
      alert('Registrazione avvenuta con successo');
    }
  };

  const handleResetForm = () => {
    setRegister({
      name: '',
      lastname: '',
      email: '',
      birthdate: '',
      avatar: '',
      password: ''
    });
    setErrors({});
  };

  
  return (
    <Container className='register-container'>
      <h2 className='text-center title-register'>Register</h2>
      <Form className='mt-5' onSubmit={handleSaveSubmit}>

        <Form.Group controlId='register-form-name' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Name</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='text'
            name='name'
            aria-label='name'
            placeholder='Insert your name...'
            value={register.name}
            autoFocus
            onChange={handleInputChange}
          />
          {errors.name && <p className='text-danger'>{errors.name}</p>}
        </Form.Group>

        <Form.Group controlId='register-form-lastname' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Lastname</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='text'
            name='lastname'
            aria-label='lastname'
            placeholder='Insert your lastname...'
            value={register.lastname}
            onChange={handleInputChange}
          />
          {errors.lastname && <p className='text-danger'>{errors.lastname}</p>}
        </Form.Group>

        <Form.Group controlId='register-form-email' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Email</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='email'
            name='email'
            aria-label='email'
            placeholder='Insert your email...'
            value={register.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className='text-danger'>{errors.email}</p>}
        </Form.Group>

        <Form.Group controlId='register-form-birthdate' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Birthdate</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='date'
            name='birthdate'
            max={new Date().toISOString().split('T')[0]} // Imposto la data massima di inserimento a oggi
            aria-label='birthdate'
            placeholder='Insert your birthdate...'
            value={register.birthdate}
            onChange={handleInputChange}
          />
          {errors.birthdate && <p className='text-danger'>{errors.birthdate}</p>}
        </Form.Group>

        <Form.Group controlId='register-form-password' className='mt-3 text-center'>
          <Form.Label className='fw-bold'>Password</Form.Label>
          <Form.Control
            className='border-0 border-bottom input-register shadow'
            type='password'
            name='password'
            aria-label='password'
            placeholder='Insert your password...'
            value={register.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className='text-danger'>{errors.password}</p>}
        </Form.Group>

        <Form.Group className='mt-3 btn-content'>
          <Button
            className='btn-standard btn-register mt-3 shadow'
            type='submit'
            aria-label='button save'
            variant='outline-success'
          >
            <FaArrowRight /> Register
          </Button>
          <Button
            className='btn-standard btn-register mt-3 shadow'
            type='reset'
            aria-label='button reset'
            variant='outline-dark'
            onClick={handleResetForm}
          >
            <FaRegTimesCircle /> Reset
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default Register;

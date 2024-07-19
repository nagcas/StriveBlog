import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import fetchWithAuth from '../../../services/fetchWithAuth';


function CreateAuthor({ getFetchAuthor }) {

  const URL = 'http://localhost:5001/api';
  const API_URL = (import.meta.env && import.meta.env.URL) || URL;

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [stateButton, setStateButton] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [newAuthor, setNewAuthor] = useState(
    {
      name: '',
      lastname: '',
      email: '',
      birthdate: '',
      avatar: ''
    }
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setNewAuthor({
      ...newAuthor,
      [name]: value
    })
    // Resetto uno specifico errore nel form
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!newAuthor.name.trim()) {
      newErrors.name = 'you must enter a name...';
    };
    if (!newAuthor.lastname.trim()) {
      newErrors.lastname = 'you must enter a lastname...';
    };
    if (!newAuthor.email.trim()) {
      newErrors.email = 'you must enter an email...';
    };
    if (!newAuthor.birthdate.trim()) {
      newErrors.birthdate = 'you must enter a date of birth...';
    };
    return newErrors;
  };


  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetchWithAuth(`${API_URL}/authors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAuthor),
      });

      console.log(response);
      setMessage(true);
      setStateButton(false);
      setNewAuthor({
        name: '',
        lastname: '',
        email: '',
        birthdate: '',
        avatar: ''
      });
    } catch (error) {
      console.error('Dati non inviati correttamente', error);
    } finally {
      setTimeout(() => {
        handleClose();
        setMessage(false);
        setStateButton(true);
        getFetchAuthor();
      }, 1500);
    }
  };


  const handleResetClose = () => {
    handleClose();
    setNewAuthor({
      name: '',
      lastname: '',
      email: '',
      birthdate: '',
      avatar: ''
    });
  };
  

  return (
    <>
      <Button
        className='btn-standard' 
        aria-label='button create author'
        variant='dark'
        onClick={handleShow}
      >
        <svg
          className='bi bi-plus-lg me-3'
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 16 16'
        >
          <path d='M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z' />
        </svg>
        Create Author
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header >
          <Modal.Title>Create Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleSaveSubmit}>
            <Form.Group className='mb-3' controlId='create-author-name'>
              <Form.Label className='fw-bold'>*Name</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='name'
                aria-label='name'
                value={newAuthor.name}
                placeholder='Insert your name...'
                autoFocus
                onChange={handleChange}
                required
              />
            
              {errors.name && <p className='text-danger'>{errors.name}</p>}
            
            </Form.Group>

            <Form.Group className='mb-3' controlId='create-author-lastname'>
              <Form.Label className='fw-bold'>*Lastname</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='lastname'
                aria-label='lastname'
                value={newAuthor.lastname}
                placeholder='Insert your lastname...'
                onChange={handleChange}
                required
              />
            
              {errors.lastname && <p className='text-danger'>{errors.lastname}</p>}
            
            </Form.Group>

            <Form.Group className='mb-3' controlId='create-author-email'>
              <Form.Label className='fw-bold'>*Email</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='email'
                name='email'
                aria-label='email'
                value={newAuthor.email}
                placeholder='Insert your email...'
                onChange={handleChange}
                required
              />
            
              {errors.email && <p className='text-danger'>{errors.email}</p>}
            
            </Form.Group>

            <Form.Group className='mb-3' controlId='create-author-birthdate'>
              <Form.Label className='fw-bold'>*Birthdate</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='date'
                name='birthdate'
                aria-label='birthdate'
                value={newAuthor.birthdate}
                onChange={handleChange}
                required
              />

              {errors.birthdate && <p className='text-danger'>{errors.birthdate}</p>}
            
            </Form.Group>

            <Form.Group className='mb-3' controlId='create-author-avatar'>
              <Form.Label className='fw-bold'>Avatar</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='url'
                name='avatar'
                aria-label='avatar'
                value={newAuthor.avatar}
                placeholder='Enter your avatar...'
                onChange={handleChange}
              />
            </Form.Group>
            
            {message && <Alert className='m-3 text-center' variant='success'>Author created successfully...</Alert>}
            
            {stateButton && 
              <Modal.Footer>
                <Button
                  className='me-3 btn-standard' 
                  aria-label='button cancel'
                  variant='dark'
                  onClick={handleResetClose}
                >
                  Cancel
                </Button>
                
                <Button
                  className='btn-standard'
                  type='submit' 
                  aria-label='button save'
                  variant='outline-success' 
                >
                  Save
                </Button>
              </Modal.Footer>
            }
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}; 

export default CreateAuthor; 
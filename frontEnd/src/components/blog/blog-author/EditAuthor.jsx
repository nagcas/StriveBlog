import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { FaEdit, FaRegTimesCircle, FaSave } from 'react-icons/fa';
import fetchWithAuth from '../../../services/fetchWithAuth';
import formatData from '../../../services/formatDate';


function EditAuthor({ author, updateAuthor }) {

  //console.log(author);

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;
  
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState({});
  const [stateButton, setStateButton] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [editAuthor, setEditAuthor] = useState({
    _id: author._id,
    name: author.name,
    lastname: author.lastname,
    email: author.email,
    birthdate: author.birthdate,
    avatar: author.avatar
  });

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEditAuthor({
      ...editAuthor,
      [name]: value
    });
    // Resetto uno specifico errore nel form
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!editAuthor.name.trim()) {
      newErrors.name = 'you must enter a name...';
    }
    if (!editAuthor.lastname.trim()) {
      newErrors.lastname = 'you must enter a lastname...';
    }
    if (!editAuthor.email.trim()) {
      newErrors.email = 'you must enter an email...';
    }
    if (!editAuthor.birthdate.trim()) {
      newErrors.birthdate = 'you must enter a date of birth...';
    }
    return newErrors;
  }

  const handleEditAuthor = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetchWithAuth(`${API_URL}/authors/${author._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editAuthor),
      });
      
      //console.log(response);
      setMessage(true);
      setStateButton(false);
    } catch (error) {
      console.error('Errore invio dati', error);
    } finally {
      setTimeout(() => {
        setMessage(false);
        setStateButton(true);
        handleClose();
        updateAuthor(editAuthor);
      }, 1500);
    }
  };
  

  return (
    <>
      <Button
        className='mt-2 me-3 btn-standard' 
        aria-label='button edit'
        variant='outline-warning' 
        onClick={handleShow}
      >
        <FaEdit className='fa-icon'/> Edit
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleEditAuthor}>
            <Form.Group className='mb-3' controlId='edit-author-id'>
              <Form.Label className='fw-bold'>id</Form.Label>
              <Form.Control 
                className='form-control-plaintext'
                name='id'
                defaultValue={editAuthor._id}
                readOnly
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='edit-author-name'>
              <Form.Label className='fw-bold'>*Name</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='name'
                aria-label='name'
                value={editAuthor.name}
                placeholder='Insert your name...'
                autoFocus
                onChange={handleChange}
              />

              {errors.name && <p className='text-danger'>{errors.name}</p>}
            
            </Form.Group>
            <Form.Group className='mb-3' controlId='edit-author-lastname'>
              <Form.Label className='fw-bold'>*Lastname</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='lastname'
                aria-label='lastname'
                value={editAuthor.lastname}
                placeholder='Insert your lastname...'
                onChange={handleChange}
              />

              {errors.lastname && <p className='text-danger'>{errors.lastname}</p>}
            
            </Form.Group>
            <Form.Group className='mb-3' controlId='edit-author-email'>
              <Form.Label className='fw-bold'>*Email</Form.Label>
              <Form.Control
                className='border-0 border-bottom mb-4'
                type='email'
                name='email'
                aria-label='email'
                value={editAuthor.email}
                placeholder='Insert your email...'
                onChange={handleChange}
              />

              {errors.email && <p className='text-danger'>{errors.email}</p>}
            
            </Form.Group>
            <Form.Group className='mb-3' controlId='edit-author-birthdate'>
              <Form.Label className='fw-bold'>*Birthdate</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='date'
                name='birthdate'
                aria-label='birthdate'
                value={formatData(editAuthor.birthdate)}
                onChange={handleChange}
              />

              {errors.birthdate && <p className='text-danger'>{errors.birthdate}</p>}
            
            </Form.Group>
            <Form.Group className='mb-3' controlId='edit-author-avatar'>
              <Form.Label className='fw-bold'>Avatar</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='url'
                name='avatar'
                aria-label='avatar'
                value={editAuthor.avatar}
                placeholder='Enter your avatar...'
                onChange={handleChange}
              />
            </Form.Group>
            
            {message && <Alert className='m-3 text-center' variant='success'>Author updated successfully...</Alert>}
        
            {stateButton &&
              <Modal.Footer>
                <Button
                  className='me-3 btn-standard' 
                  aria-label='button cancel'
                  variant='dark' 
                  onClick={handleClose}
                >
                  <FaRegTimesCircle /> Cancel
                </Button>
                <Button
                  className='btn-standard' 
                  type='submit'
                  aria-label='button save'
                  variant='outline-success' 
                >
                  <FaSave /> Save
                </Button>
              </Modal.Footer>
            }
 
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditAuthor;
import { useContext, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context';


function CreateComment({ id, updateComments }) {

  const { authorLogin } = useContext(Context);

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [stateButton, setStateButton] = useState(true);
  const [errors, setErrors] = useState({});


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [comment, setComment] = useState({
    name: authorLogin.name,
    email: authorLogin.email,
    content: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setComment({
      ...comment,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!comment.content.trim()) {
      newErrors.content = 'you must enter a comment...';
    }
    return newErrors;
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();

    //console.log(comment);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/blogPosts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      console.log(response);
      setMessage(true);
      setStateButton(false);
      setComment({
        name: authorLogin.name,
        email: authorLogin.email,
        content: ''
      });
      // Aggiorna i commenti nel componente padre con il nuovo commento
      updateComments((prevComments) => [...prevComments, comment]);
    } catch (error) {
      console.error('Dati non inviati correttamente', error);
    } finally {
      setTimeout(() => {
        handleClose();
        setMessage(false);
        setStateButton(true);
      }, 1500);
    }
  };

  const handleResetClose = () => {
    handleClose();
    setComment({
      name: authorLogin.name,
      email: authorLogin.email,
      content: ''
    });
    setErrors({});
  };

  return (
    <>
      <Button
        aria-label='add a comment'
        variant='dark'
        className='btn-standard'
        onClick={handleShow}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          fill='currentColor'
          className='bi bi-plus-lg me-3'
          viewBox='0 0 16 16'
        >
          <path d='M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z' />
        </svg>
        Add a comment
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleSaveSubmit}>
            <Form.Group className='mb-3' controlId='create-comment-name'>
              <Form.Label className='fw-bold'>*Name</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='name'
                aria-label='name'
                value={comment.name}
                placeholder={authorLogin.name}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='create-comment-email'>
              <Form.Label className='fw-bold'>*Email</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='email'
                name='email'
                aria-label='email'
                value={comment.email}
                placeholder={authorLogin.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='create-comment-content'>
              <Form.Label className='fw-bold'>*Content</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                as='textarea'
                name='content'
                aria-label='content'
                value={comment.content}
                placeholder='Insert your comment...'
                onChange={handleChange}
                autoFocus
              />

              {errors.content && <p className='text-danger'>{errors.content}</p>}

            </Form.Group>

            {message && <Alert className='m-3 text-center' variant='success'>Comment created successfully...</Alert>}

            {stateButton && (
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
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CreateComment;


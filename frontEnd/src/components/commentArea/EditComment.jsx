import { useContext, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import fetchWithAuth from '../../services/fetchWithAuth';
import { Context } from '../../modules/Context';


function EditComment({ id, comment, commentId, fetchBlog }) {

  const { authorLogin } = useContext(Context);

  const URL = `http://localhost:5001`;
  //const API_URL = import.meta.env.URL || URL;
  const API_URL = (import.meta.env && import.meta.env.URL) || URL;

  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [stateButton, setStateButton] = useState(true);
  const [errors, setErrors] = useState({});


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [editComment, setEditComment] = useState({
    _id: authorLogin._id,
    name: authorLogin.name,
    email: authorLogin.email,
    content: comment.content,
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditComment({
      ...editComment,
      [name]: value
    });
    setErrors({
      ...errors,
      [name]: ''
    })
  };

  const validate = () => {
    const newErrors = {};
    if (!editComment.content.trim()) {
      newErrors.content = 'you must enter a comment...';
    }
    return newErrors;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetchWithAuth(`${API_URL}/api/blogPosts/${id}/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editComment),
      });
      console.log(response);
      
      setMessage(true);
      setStateButton(false);
    } catch (error) {
      console.error('Errore invio dati', error);
    } finally {
      setTimeout(() => {
        setMessage(false);
        setStateButton(true);
        handleClose();
        fetchBlog();
      }, 1500);
    }
  };

  const handleResetClose = () => {
    handleClose();
    setErrors({});
  };

  return (
    <>
      <Button
        className='me-3 btn-standard' 
        aria-label='button edit'
        variant='outline-warning' 
        onClick={handleShow}
      >
        <FaEdit className='fa-icon'/> Edit
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='float-end'>Fields marked with * are mandatory.</p>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className='mb-3' controlId='edit-comment-id'>
              <Form.Label className='fw-bold'>id</Form.Label>
              <Form.Control 
                className='form-control-plaintext border-0 border-bottom mb-4'
                name='id'
                placeholder={authorLogin._id}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='edit-comment-name'>
              <Form.Label className='fw-bold'>*Name</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='text'
                name='name'
                aria-label='name'
                value={editComment.name}
                placeholder={authorLogin.name}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='edit-comment-email'>
              <Form.Label className='fw-bold'>*Email</Form.Label>
              <Form.Control
                className='border-0 border-bottom'
                type='email'
                name='email'
                aria-label='email'
                value={editComment.email}
                placeholder={authorLogin.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='edit-comment-content'>
              <Form.Label className='fw-bold'>*Content</Form.Label>
              <Form.Control
                className='border-0'
                type='text'
                as={'textarea'}
                name='content'
                aria-label='content'
                value={editComment.content}
                placeholder='Insert your comment...'
                onChange={handleChange}
                required
              />

              {errors.content && <p className='text-danger'>{errors.content}</p>}

            </Form.Group>

            {message && <Alert className='m-3 text-center' variant='success'>Comment updated successfully...</Alert>}
            
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
}

export default EditComment;

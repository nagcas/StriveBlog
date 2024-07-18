import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import fetchWithAuth from '../../../services/fetchWithAuth';
import { useNavigate } from 'react-router-dom';

function DeleteAuthor({ author, getFetchAuthor }) {

  const navigate = useNavigate();
  const URL = `http://localhost:5001/api/authors/`;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAuthor = async () => {
    try {
      await fetchWithAuth(URL + author._id, {
        method: 'DELETE',
      });

      handleClose();
      getFetchAuthor();
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <>
      <Button
        className='mt-2 btn-standard' 
        aria-label='button delete'
        variant='outline-danger' 
        onClick={handleShow}
      >
        <FaTrashAlt className='fa-icon'/> Delete
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Author</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <p>Are you sure you want to delete: <span className='fw-bold'>{author.name} {author.lastname}</span> ?</p>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-center'>
          <Button
            className='me-3 btn-standard' 
            size='lg'
            aria-label='button no'
            variant='dark' 
            onClick={handleClose}
          >
            No
          </Button>
          <Button
            className='btn-standard' 
            size='lg'
            aria-label='button yes'
            variant='outline-success' 
            onClick={handleDeleteAuthor}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteAuthor;
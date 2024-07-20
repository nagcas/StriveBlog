import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import fetchWithAuth from '../../../services/fetchWithAuth';


function DeletePost({ id, title, getFetchPosts }) {

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const handleDeletePost = async () => {
    try {
      await fetchWithAuth(`${API_URL}/blogPosts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
        console.error(error)
    } finally {
        handleClose();
        getFetchPosts();
    }
  };
  
  return (
    <>
       <Button
        className='btn-standard' 
        aria-label='button delete'
        variant='outline-danger' 
        onClick={handleShow}
      >
        <FaTrashAlt className='fa-icon'/> Delete
      </Button>

      <Modal size='lg' show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete post</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>Are you sure you want to delete the post: <span className='fw-bold'>{title}</span>?</Modal.Body>
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
            onClick={handleDeletePost}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeletePost;
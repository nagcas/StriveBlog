import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';
import fetchWithAuth from '../../services/fetchWithAuth';


function DeleteComment({ id, commentId, fetchBlog }) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const URL = `http://localhost:5001`;
  const API_URL = import.meta.env.URL || URL;

  const deleteComment = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/api/blogPosts/${id}/comments/${commentId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete comment...');
      }
  
      //const data = await response.json();
      handleClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      fetchBlog();
    }
  };


  return(
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
          <Modal.Title>Delete Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <p>Are you sure you want to delete?</p>
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
            onClick={deleteComment}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteComment;
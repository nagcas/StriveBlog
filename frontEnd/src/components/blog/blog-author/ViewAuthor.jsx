import { useState } from 'react';

import { Card, Image, ListGroup, Modal } from 'react-bootstrap';
import fetchWithAuth from '../../../services/fetchWithAuth';

import defaultAvatar from '../../../assets/default-avatar.jpg';
import { FaEye } from 'react-icons/fa';
import formatData from '../../../services/formatDate';


function ViewAuthor({ id }) {
  
  const URL = 'http://localhost:5001/api';
  const API_URL = (import.meta.env && import.meta.env.URL) || URL;

  const [viewAuthor, setViewAuthor] = useState('');
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = async () => {
    setShow(true);
  
    try {
      const response = await fetchWithAuth(`${API_URL}/authors/${id}`,);
  
      //console.log(response);
      setViewAuthor(response);
    } catch (error) {
      console.error('Authore non presente', error);
    }
  };
  

  return (
    <>
      <button
        className='btn me-3 btn-outline-primary btn-standard'
        aria-label='button view author'
        onClick={handleShow}
      >
        <FaEye className='fa-icon' /> View
      </button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>View info Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className='m-0'>
            <ListGroup variant='flush'>
              {viewAuthor && (
                <>
                  <Image
                    className='author-avatar m-4'
                    src={viewAuthor.avatar ? viewAuthor.avatar : defaultAvatar}
                    alt={viewAuthor.avatar ? 'Image author' : 'Image author default'}
                    roundedCircle
                  />
                  <ListGroup.Item>id: <span className='fw-bold'>{id}</span></ListGroup.Item>
                  <ListGroup.Item>Name: <span className='fw-bold'>{viewAuthor.name}</span></ListGroup.Item>
                  <ListGroup.Item>Lastname: <span className='fw-bold'>{viewAuthor.lastname}</span></ListGroup.Item>
                  <ListGroup.Item>
                    Birthdate: <span className='fw-bold'>{formatData(viewAuthor.birthdate, 'it')}</span>
                  </ListGroup.Item>
                  <ListGroup.Item>Email: <span className='fw-bold'>{viewAuthor.email}</span></ListGroup.Item>
                </>
              )}
            </ListGroup>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-dark btn-standard'
            onClick={handleClose}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewAuthor;

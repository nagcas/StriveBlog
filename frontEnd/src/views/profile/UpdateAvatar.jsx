import { useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { FaPencilAlt } from 'react-icons/fa';
import fetchWithAuth from '../../services/fetchWithAuth';

function UpdateAvatar({ authorLogin, updatedAuthor }) {
  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const [show, setShow] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [stateButton, setStateButton] = useState(true);
  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
    setErrors(false);
  };

  const saveAvatar = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      setErrors(true);
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const response = await fetchWithAuth(`${API_URL}/authors/${authorLogin._id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });
      setStateButton(false);
      setMessage(true);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setTimeout(() => {
        handleClose();
        setMessage(false);
        setStateButton(true);
      }, 1500);
    }
  };

  return (
    <>
      <Button variant='light' onClick={handleShow} className='btn-avatar btn-standard'>
        <FaPencilAlt />
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Avatar</Modal.Title>
        </Modal.Header>
        <Form onSubmit={saveAvatar} className='modal-user'>
          <Form.Group controlId='profile-avatar' className='mt-3'>
            <Form.Label className='fw-bold'>Avatar Image</Form.Label>
            <Form.Control
              className='border-0 border-bottom input-avatar shadow'
              type='file'
              name='avatar'
              onChange={handleFileChange}
              accept='image/*' // limita i file caricabili ai soli tipi di immagini
            />

            {message && <Alert className='m-3 text-center' variant='success'>Avatar updated successfully...</Alert>}
            {errors && <Alert className='m-3 text-center' variant='danger'>Please select a file first...</Alert>}
          
          </Form.Group>
          {stateButton && (
            <Modal.Footer>
              <Button 
                variant='outline-dark' 
                className='btn-standard' 
                onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant='outline-success' 
                className='btn-standard'
                type='submit'>
                Save
              </Button>
            </Modal.Footer>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UpdateAvatar;

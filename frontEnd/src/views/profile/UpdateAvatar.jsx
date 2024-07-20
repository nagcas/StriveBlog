import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaPencilAlt } from 'react-icons/fa';
import fetchWithAuth from '../../services/fetchWithAuth';

function UpdateAvatar({ authorLogin, setAuthorLogin }) {
  const [show, setShow] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null); // inizializzato come null

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const saveAvatar = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      alert('Please select a file first...');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      await fetchWithAuth(`${API_URL}/authors/${authorLogin._id}/avatar`, {
        method: 'PATCH',
        body: formData,
      });
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar');
    } finally {
      handleClose();
      alert('Avatar updated successfully');

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
              className='border-0 border-bottom input-edit p-4 shadow'
              type='file'
              name='avatar'
              onChange={handleFileChange}
              accept="image/*" // limita i file caricabili ai soli tipi di immagini
            />
          </Form.Group>
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
        </Form>
      </Modal>
    </>
  );
};

export default UpdateAvatar;
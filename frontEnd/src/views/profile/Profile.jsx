import './Profile.css';
import { useContext, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Image, Row } from "react-bootstrap";
import { Context } from '../../modules/Context.js';
import defaultAvatar from '../../assets/default-avatar.jpg';
import { Link } from 'react-router-dom';
import fetchWithAuth from '../../services/fetchWithAuth.js';
import formatData from '../../services/formatDate.js';
import DeleteAuthor from '../../components/blog/blog-author/DeleteAuthor.jsx';
import { FaRegSave, FaRegTimesCircle } from 'react-icons/fa';


function Profile() {

  const { isLoggedIn, authorLogin, setAuthorLogin } = useContext(Context);

  const URL = 'http://localhost:5001/api';
  const API_URL = (import.meta.env && import.meta.env.URL) || URL;

  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState({});

  const [editProfile, setEditProfile] = useState({
    name: authorLogin.name || '',
    lastname: authorLogin.lastname || '',
    email: authorLogin.email || '',
    birthdate: formatData(authorLogin.birthdate) || '',
    avatar: authorLogin.avatar || '',
  });

  useEffect(() => {
    setEditProfile({
      name: authorLogin.name,
      lastname: authorLogin.lastname,
      email: authorLogin.email,
      birthdate: formatData(authorLogin.birthdate),
      avatar: authorLogin.avatar,
    });
  }, [authorLogin]);

  const handleChangeProfile = (e) => {
    const { name, value } = e.target;
    setEditProfile({
      ...editProfile,
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
    if (!editProfile.name.trim()) {
      newErrors.name = 'you must enter a name...';
    };
    if (!editProfile.lastname.trim()) {
      newErrors.lastname = 'you must enter a lastname...';
    };
    if (!editProfile.email.trim()) {
      newErrors.email = 'you must enter an email...';
    };
    if (!editProfile.birthdate.trim()) {
      newErrors.birthdate = 'you must enter a date of birth...';
    };
    return newErrors;
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/authors/${authorLogin._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editProfile),
      });

      //console.log(response);

      setMessage(true);
    } catch (error) {
      console.error('Errore invio dati', error);
    } finally {
      setTimeout(() => {
        setMessage(false);
        setAuthorLogin({ ...authorLogin, ...editProfile });
      }, 1500);
    }
  };

  return (
    <Container className='content-profile'>
      {(authorLogin && isLoggedIn) ? (
        <Row>
          <Col md={4}>
            <div className='content-image'>
              <h5 className='title-image'>Image Profile</h5>
              <Image
                src={authorLogin.avatar ? authorLogin.avatar : defaultAvatar}
                alt={authorLogin.avatar ? 'Image author' : 'Image author default'}
                className='img-profile'
                roundedCircle
              />
              <p className='text-center'>{authorLogin.name} {authorLogin.lastname}</p>
              <p className='text-muted text-center'>Account creato il {formatData(authorLogin.createdAt, 'it')}</p>
              <h5 className='title-image'>Elimina Account</h5>
              <DeleteAuthor author={authorLogin} />
            </div>
          </Col>

          <Col md={8}>
            <div className='content-dati'>
              <h5 className='title-dati'>Dati del profilo</h5>
              <Form onSubmit={handleEditProfile}>
                <Form.Group className='mb-3' controlId='edit-author-id'>
                  <Form.Label className='fw-bold'>id</Form.Label>
                  <Form.Control
                    className='form-control-plaintext'
                    name='id'
                    defaultValue={authorLogin._id}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-name'>
                  <Form.Label className='fw-bold'>Name</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='text'
                    name='name'
                    aria-label='name'
                    value={editProfile.name}
                    placeholder='Insert your name...'
                    onChange={handleChangeProfile}
                  />
                  
                  {errors.name && <p className='text-danger'>{errors.name}</p>}
                
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-lastname'>
                  <Form.Label className='fw-bold'>Lastname</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='text'
                    name='lastname'
                    aria-label='lastname'
                    value={editProfile.lastname}
                    placeholder='Insert your lastname...'
                    onChange={handleChangeProfile}
                  />
                  
                  {errors.lastname && <p className='text-danger'>{errors.lastname}</p>}
                
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-email'>
                  <Form.Label className='fw-bold'>Email</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='email'
                    name='email'
                    aria-label='email'
                    value={editProfile.email}
                    placeholder='Insert your email...'
                    onChange={handleChangeProfile}
                  />

                  {errors.email && <p className='text-danger'>{errors.email}</p>}
                
                </Form.Group>
                <Form.Group className='mb-3' controlId='edit-author-birthdate'>
                  <Form.Label className='fw-bold'>Birthdate</Form.Label>
                  <Form.Control
                    className='border-0 border-bottom input-profile shadow'
                    type='date'
                    name='birthdate'
                    aria-label='birthdate'
                    value={editProfile.birthdate}
                    onChange={handleChangeProfile}
                  />
                  {errors.name && <p className='text-danger'>{errors.name}</p>}
                </Form.Group>

                {message && <Alert className='m-3 text-center' variant='success'>Author updated successfully...</Alert>}

                <div className='d-flex justify-content-center'>
                  <Button
                    className='me-3 btn-standard btn-profile shadow'
                    aria-label='button cancel'
                    variant='outline-dark'
                    as={Link}
                    to='/'
                  >
                    <FaRegTimesCircle /> Cancel
                  </Button>
                  <Button
                    className='btn-standard btn-profile shadow'
                    type='submit'
                    aria-label='button save'
                    variant='outline-success'
                  >
                    <FaRegSave /> Save
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      ) : (
        <Alert className='mt-4 text-center' variant='light'>
          To view profile,{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link>
          or{' '}
          <Link to={'/login'} className='link-login'>
            LOGIN{' '}
          </Link>
          is required.
        </Alert>
      )}
    </Container>
  );
};

export default Profile;

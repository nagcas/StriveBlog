import './BlogAuthor.css';

import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Container, Col, Image, Pagination, Row, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ViewAuthor from './ViewAuthor';
import fetchWithAuth from '../../../services/fetchWithAuth';

import defaultAvatar from '../../../assets/default-avatar.jpg';
import { Context } from '../../../modules/Context.js';


const BlogAuthor = () => {

  const { isLoggedIn } = useContext(Context);

  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const [authors, setAuthors] = useState([]);
  const [isSpinner, setIsSpinner] = useState(false);

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(16);

  const getFetchAuthor = useCallback(async () => {
    setIsSpinner(true);

    try {
      const response = await fetchWithAuth(`${API_URL}/authors?page=${currentPage}&limit=${limit}`);

      setAuthors(response.authors);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Errore nella chiamata endpoint', error);
    } finally {
      setIsSpinner(false);
    }
  }, [API_URL, currentPage, limit]);

  useEffect(() => {
    if (isLoggedIn) {
      getFetchAuthor();
    }
  }, [API_URL, isLoggedIn, getFetchAuthor]);

  return (
    <Container className='content-authors'>
      <h1 className='blog-main-title mb-3 text-center'>List of authors</h1>
      {isLoggedIn ? (
        <>
          {/* <CreateAuthor getFetchAuthor={getFetchAuthor} /> */}
          <div className='d-flex justify-content-center mx-4'>
            {isSpinner && <Spinner animation='border' variant='secondary' className='mx-5' />}
          </div>
          {/* Griglia degli autori */}
          <Row className='mt-3'>
            {authors.length > 0 ? (
              authors.map((author) => (
                <Col md={6} lg={3} className='mb-4' key={author._id}>
                  <div className='author-card'>
                    <Image
                      className='author-avatar'
                      src={author.avatar ? author.avatar : defaultAvatar}
                      alt={author.avatar ? 'Image user' : 'Image user default'}
                    />
                    <div className='author-name'>
                      <h6>{author.name} {author.lastname}</h6>
                      <p className='text-muted'>{author.email}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <ViewAuthor id={author._id} />
                      {/* {authorLogin && authorLogin.email === author.email && (
                        <>
                          <EditAuthor author={author} updateAuthor={updateAuthor} />
                          <DeleteAuthor author={author} getFetchAuthor={getFetchAuthor} />
                        </>
                      )} */}
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Alert variant='warning' className='mt-3 text-center'>No authors present in the database...</Alert>
            )}
          </Row>
          {/* Impaginazione */}
          <Pagination className='float-end'>
            <Pagination.First
              className='btn-pagination'
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              className='btn-pagination'
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <Pagination.Item
                className='btn-pagination'
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              className='btn-pagination'
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              className='btn-pagination'
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
          {/* Selezione del numero di elementi per pagina */}
          <div className='my-3'>
            <span>Authors for page:</span>
            <select
              className='ms-2'
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
            </select>
          </div>
        </>
      ) : (
        <Alert className='mt-4 text-center' variant='light'>
          To view the list of authors,{' '}
          <Link to={'/register'} className='link-register'>
            REGISTRATION{' '}
          </Link> 
            or{' '} 
          <Link to={'/login'} className='link-register'>
            LOGIN{' '}
          </Link>
          is required.
        </Alert>
      )}
    </Container>
  );
};

export default BlogAuthor;


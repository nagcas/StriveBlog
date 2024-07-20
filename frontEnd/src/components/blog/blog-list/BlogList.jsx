import './BlogList.css';

import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Button, Col, Container, Pagination, Row, Spinner } from 'react-bootstrap';
import BlogItem from '../blog-item/BlogItem';
import BlogCardPlaceholder from '../../blogPlaceholder/BlogCardPlaceholder';
import fetchWithAuth from '../../../services/fetchWithAuth.js';
import { Link } from 'react-router-dom';
import { Context } from '../../../modules/Context.js';


const BlogList = ({ search }) => {
  
  const URL = 'http://localhost:5001/api';
  const API_URL = process.env.REACT_APP_API_URL || URL;

  const { isLoggedIn } = useContext(Context);

  const [listPosts, setListPosts] = useState([]);
  const [isSpinner, setisSpinner] = useState(false);
  const [loading, setLoading] = useState(true);

  // Paginazione
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(12);

  const getFetchPosts = useCallback(async () => {
    setisSpinner(true);

    try {
      const data = await fetchWithAuth(`${API_URL}/blogPosts?page=${currentPage}&limit=${limit}&sort=createdAt&sortDirection=desc`);
      setListPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Errore', error);
    } finally {
      setisSpinner(false);
      setLoading(false);
    }
  }, [API_URL, currentPage, limit])

  useEffect(() => {
    getFetchPosts();
  }, [API_URL, getFetchPosts]);


  // Creare i placeholder
  const placeholders = [];
  for (let i = 0; i < limit; i++) {
    placeholders.push(
      <Col key={i} md={4} lg={3} style={{ marginBottom: 50 }}>
        <BlogCardPlaceholder />
      </Col>
    );
  }

  return (
    <>
      <div className='d-flex justify-content-center m-3'>
        {isSpinner && <Spinner animation='border' variant='secondary' />}
      </div>
      
      {isLoggedIn && (
        <Container className='d-flex justify-content-end mb-4'>
          <Button
            as={Link} to='/new'
            variant='dark'
            aria-label='new post'
            size='md'
            className='me-3 btn-standard'
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
            New Post
          </Button>
        </Container>
      )}

      <Row>
        {loading
          ? placeholders
          : listPosts
              .filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))
              .map((post) => (
                <Col key={post._id} md={4} lg={3} style={{ marginBottom: 50 }}>
                  <BlogItem key={post._id} {...post} getFetchPosts={getFetchPosts} />
                </Col>
              ))}
      </Row>

      {/* Impaginazione */}
      <Pagination className='float-end'>
        <Pagination.First
          className='btn-pagination'
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1} // Disabilitato se già sulla prima pagina
        />

        <Pagination.Prev
          className='btn-pagination'
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1} // Disabilitato se già sulla prima pagina
        />

        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            className='btn-pagination'
            key={index + 1}
            active={index + 1 === currentPage} // Evidenzia la pagina corrente
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          className='btn-pagination'
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages} // Disabilitato se già sull'ultima pagina
        />

        <Pagination.Last
          className='btn-pagination'
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages} // Disabilitato se già sull'ultima pagina
        />
      </Pagination>

      {/* Selezione del numero di elementi per pagina */}
      <div className='my-3'>
        <span>Posts for page:</span>
        <select
          className='ms-2'
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          <option value={6}>6</option>
          <option value={12}>12</option>
          <option value={18}>18</option>
        </select>
      </div>
    </>
  );
};

export default BlogList;



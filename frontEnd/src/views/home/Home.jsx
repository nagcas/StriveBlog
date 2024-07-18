import './Home.css';

import React from 'react';
import { Container } from 'react-bootstrap';
import BlogList from '../../components/blog/blog-list/BlogList';
import HeroBlog from '../../components/Hero/HeroBlog';


const Home = ({ search, handleSearch }) => {
  
  return (
    <>
      <HeroBlog search={search} handleSearch={handleSearch} />
      <Container fluid='sm'>
        <BlogList search={search} handleSearch={handleSearch} />
      </Container>
    </>  
  );
};

export default Home;

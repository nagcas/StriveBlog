import './Home.css';

import React, { useContext } from 'react';
import { Container } from 'react-bootstrap';
import BlogList from '../../components/blog/blog-list/BlogList';
import HeroBlog from '../../components/Hero/HeroBlog';
import { ThemeContext } from '../../modules/Context';


const Home = ({ search, handleSearch }) => {

  const [themeCtx, setThemeCtx] = useContext(ThemeContext);
  
  return (
    <>
      <HeroBlog search={search} handleSearch={handleSearch} />
      <Container fluid='sm' bg={themeCtx} data-bs-theme={themeCtx}>
        <BlogList search={search} handleSearch={handleSearch} />
      </Container>
    </>  
  );
};

export default Home;

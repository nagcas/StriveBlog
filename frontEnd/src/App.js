import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/navbar/BlogNavbar';
import BlogFooter from './components/footer/BlogFooter';
import Home from './views/home/Home';
import Blog from './views/blog/Blog';
import NewBlogPost from './views/new/New';
import NotFound from './views/notFound/NotFound';
import ListAuthors from './components/blog/blog-author/ListAuthos';
import EditPost from './views/edit/EditPost';
import Register from './views/register/Register';
import Login from './views/login/Login';
import About from './views/about/About';
import { AuthProvider } from './modules/AuthProvider.js';
import Profile from './views/profile/Profile';
import { ThemeContext } from './modules/Context.js';

function App() {

  // Definisce lo stato della ricerca
  const [search, setSearch] = useState('');

  const [theme, setTheme] = useState('light'); 

  // Definisce la funzione per gestire la ricerca
  const handleSearch = (e) => { 
    setSearch(e.target.value);
  }

  return (
    <ThemeContext.Provider value={[theme, setTheme]}>
      <div style={{
        backgroundColor: theme === 'light' ? '#dce9ec' : "#777777",
      }}>
        <AuthProvider>
            <Router>
                <NavBar />
                  <Routes>
                    <Route path='/' exact element={<Home search={search} handleSearch={handleSearch}/>} />
                    <Route path='/blogPosts/:id' element={<Blog />} />
                    <Route path='/editPost/:id' element={<EditPost />} />
                    <Route path='/authors' element={<ListAuthors />} />
                    <Route path='/new' element={<NewBlogPost />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/about' element={<About />} />
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                <BlogFooter />
            </Router> 
        </AuthProvider>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;

import React, { useState } from 'react'; // Importa React e l'hook useState.
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importa Router e componenti di routing.

import NavBar from './components/navbar/BlogNavbar'; // Importa la barra di navigazione.
import BlogFooter from './components/footer/BlogFooter'; // Importa il piè di pagina del blog.
import Home from './views/home/Home'; // Importa la vista della home page.
import Blog from './views/blog/Blog'; // Importa la vista del blog.
import NewBlogPost from './views/new/New'; // Importa la vista per creare un nuovo post.
import NotFound from './views/notFound/NotFound'; // Importa la vista per la pagina non trovata.
import ListAuthors from './components/blog/blog-author/ListAuthos'; // Importa la vista per elencare gli autori.
import EditPost from './views/edit/EditPost'; // Importa la vista per modificare un post.
import Register from './views/register/Register'; // Importa la vista per la registrazione.
import Login from './views/login/Login'; // Importa la vista per il login.
import About from './views/about/About'; // Importa la vista della pagina "Chi siamo".
import { AuthProvider } from './modules/AuthProvider.js'; // Importa il contesto per l'autenticazione.
import Profile from './views/profile/Profile'; // Importa la vista del profilo utente.
import { ThemeContext } from './modules/Context.js'; // Importa il contesto per il tema.

function App() {
  // Definisce lo stato per la ricerca e il tema
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('light'); // Stato per gestire il tema (chiaro o scuro).

  // Funzione per gestire la modifica del campo di ricerca
  const handleSearch = (e) => {
    setSearch(e.target.value); // Aggiorna lo stato della ricerca con il valore immesso.
  };

  return (
    <ThemeContext.Provider value={[theme, setTheme]}> {/* Fornisce il contesto del tema a tutti i componenti figli */}
      <div style={{
        backgroundColor: theme === 'light' ? '#dce9ec' : "#777777", // Imposta il colore di sfondo in base al tema
      }}>
        <AuthProvider> {/* Fornisce il contesto dell'autenticazione a tutti i componenti figli */}
          <Router> {/* Configura il routing dell'applicazione */}
            <NavBar /> {/* Barra di navigazione */}
            <Routes> {/* Definisce le rotte dell'applicazione */}
              <Route path='/' exact element={<Home search={search} handleSearch={handleSearch}/>} /> {/* Home page con ricerca */}
              <Route path='/blogPosts/:id' element={<Blog />} /> {/* Vista del blog specifico per ID */}
              <Route path='/editPost/:id' element={<EditPost />} /> {/* Vista per modificare un post specifico */}
              <Route path='/authors' element={<ListAuthors />} /> {/* Vista per elencare gli autori */}
              <Route path='/new' element={<NewBlogPost />} /> {/* Vista per creare un nuovo post */}
              <Route path='/register' element={<Register />} /> {/* Vista per la registrazione */}
              <Route path='/login' element={<Login />} /> {/* Vista per il login */}
              <Route path='/profile' element={<Profile />} /> {/* Vista del profilo utente */}
              <Route path='/about' element={<About />} /> {/* Vista della pagina "Chi siamo" */}
              <Route path='*' element={<NotFound />} /> {/* Pagina non trovata per percorsi non definiti */}
            </Routes>
            <BlogFooter /> {/* Piè di pagina del blog */}
          </Router> 
        </AuthProvider>
      </div>
    </ThemeContext.Provider>
  );
};

export default App; // Esporta il componente App.


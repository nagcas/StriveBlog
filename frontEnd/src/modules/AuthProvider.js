import { useState } from 'react';
import { Context } from './Context.js';

export const AuthProvider = ({ children }) => {
  
  const [authorLogin, setAuthorLogin] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Context.Provider value={{ authorLogin, setAuthorLogin, isLoggedIn, setIsLoggedIn }}>
      {children}
    </Context.Provider>
  );
};



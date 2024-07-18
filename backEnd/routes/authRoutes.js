import express from 'express';
import Author from '../models/Authors.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import passport from '../config/passportConfig.js';

const router = express.Router();

// Funzione di callback per gestire il successo dell'autenticazione
async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    res.redirect(`http://localhost:3000/login?token=${token}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error);
    res.redirect('/login?error=auth_failed');
  }
}

// POST /login => restituisce token di accesso
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });

    if (!author) {
      return res.status(401).json({ message: 'Invalid credentials...' });
    }

    const isMatch = await author.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials...' });
    }

    const token = await generateJWT({ id: author._id });
    res.json({ token, message: 'Login effettuato con successo' });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});

// GET /me => restituisce l'autore collegato al token di accesso
router.get('/me', authMiddleware, (req, res) => {
  try {
    const authorData = req.author.toObject();
    delete authorData.password;
    res.json(authorData);
  } catch (error) {
    console.error('Errore nel recupero dell\'autore:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});

// Rotte di autenticazione con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  handleAuthCallback
);

// Rotte di autenticazione con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  handleAuthCallback
);

// Middleware per gestire le rotte non trovate
router.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found...', message: 'The requested resource was not found...' });
});

export default router;


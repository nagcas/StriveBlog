import { verifyJWT } from '../utils/jwt.js';
import Author from '../models/Authors.js';

// Middleware di autenticazione
export const authMiddleware = async (req, res, next) => {
  try {
    // Estrae il token JWT dall'header di autorizzazione della richiesta
    const token = req.headers.authorization?.replace('Bearer ', '');

    // Verifica se il token è presente
    if (!token) {
      return res.status(401).send('Missing token...');
    }

    // Verifica il token e decodifica il payload
    const decoded = await verifyJWT(token);

    // Cerca l'autore nel database usando l'ID decodificato dal token
    const author = await Author.findById(decoded.id).select('-password');

    // Se l'autore non viene trovato, invia una risposta 401 (Unauthorized)
    if (!author) {
      return res.status(401).send('Author not found...');
    }

    // Aggiunge l'autore decodificato alla richiesta per uso futuro
    req.author = author;

    // Passa il controllo al middleware successivo nella catena
    next();
  } catch (error) {
    // In caso di errore (es. token non valido), invia una risposta 401 (Unauthorized)
    res.status(401).send('Missing token...');
  }
};

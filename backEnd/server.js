// Importazione dei moduli necessari
import express from 'express';
import endpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import AuthorRoutes from './routes/AuthorRoutes.js';
import PostsRoutes from './routes/PostsRoutes.js';
import authRoutes from './routes/authRoutes.js';

import session from 'express-session';
import passport from './config/passportConfig.js';

import { 
  badRequestHandler, 
  authorizedHandler, 
  notFoundHandler, 
  genericErrorHandler 
} from './middlewares/errorHandlers.js';

import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Configurazione di dotenv per caricare le variabili d'ambiente dal file .env
dotenv.config(); 

// Creazione di un'applicazione Express
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'http://localhost:3000',
      '',
      ''
    ];

    if (process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Permesso negato - CORS'));
    }
  },
  crediantials: true
};


app.use(cors(corsOptions));

// Middleware per il parsing del JSON nel corpo delle richieste
app.use(express.json());

// configurazione della sessione con Google
app.use(
  session({
    secret: process.env.SESSION_SECRET,

    resave: false,

    saveUninitialized: false,
  })
)

app.use(passport.initialize());
app.use(passport.session());

// fine autentificazione con google


//Middeleware per il caricamento dei file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connessione a MongoDB utilizzando l'URI presente nelle variabili d'ambiente
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("Connection error to MongoDB - Details:", err));

// Definizione della porta su cui il server ascolterà, utilizzando le variabili d'ambiente o un valore di default
const PORT = process.env.PORT || 5000;

// Definzione delle rotte pwe l'autenticazione
app.use('/api/auth', authRoutes);

// Definizione delle rotte per gli autori, prefisso '/authors/'
app.use('/api/authors/', AuthorRoutes);

// Definizione delle rotte per i posts, prefisso '/posts/'
app.use('/api/blogPosts/', PostsRoutes);

app.use(badRequestHandler);
app.use(authorizedHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Here is the list of available endpoints:');
  // Print all available endpoints in the app in a table format
  console.table(endpoints(app));
});


// Importazione del modulo express
import express from 'express';
// Importazione del modello Author
import Author from '../models/Authors.js';
// Importazione del modello Post
import Post from '../models/Posts.js';
// Importazione del middleware per il controllo dell'email (al momento non attiva)
import controlEmail from '../middlewares/controlEmail.js';

import cloudinaryUploader from '../config/claudinaryConfig.js';
import { sendEmail } from '../services/emailServices.js';



// Creazione di un router Express
const router = express.Router();

// router.use(controlEmail);

// Definizione di una route GET per ottenere una lista di autori con paginazione e ordinamento
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || ;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;

    const authors = await Author.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await Author.countDocuments();

    res.json({
      authors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAuthors: total
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Definizione di una route GET per ottenere un autore per ID
router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not present in database...' });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Definizione di una route POST per creare un nuovo autore
router.post('/', async (req, res) => {

  try {

    const author = new Author(req.body);

    // La password verrà automaticamente hashata grazie al middleware pre-save
    // che abbiamo aggiunto nello schema Author

    const newAuthor = await author.save();
    

    
    // Salva le modifiche nel db
    await author.save();

    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;

    // Codice per invio mail con MAILGUN
    const htmlContent = `
      <h1>Il tuo account è stato creato con successo!</h1>
      <p>Ciao ${author.name} ${author.lastname},</p>
      <p>Siamo lieti di informarti che il tuo account sul nostro blog è stato creato con successo.</p>
      <p>Grazie per il tuo contributo e per essere diventato parte della nostra community. Siamo entusiasti di vedere i tuoi futuri post e di condividere le tue conoscenze con i nostri lettori.</p>
      <p>Se hai domande o hai bisogno di assistenza, non esitare a contattarci.</p>
      <br>
      <p>Grazie,</p>
      <p>Il Team di BlogPosts</p>
      <hr style="border: none; border-top: 1px solid #ccc;">
      <p>Per supporto, contattare il seguente indirizzo email:>supporto@blogposts.com</p>
    `;

    try {
      await sendEmail(
        author.email,
        'Benvenuto su BlogPosts! Il tuo account è stato creato con successo.',
        htmlContent
      );
    } catch (emailError) {
      console.error('Email not sent correctly', emailError.message);
    }

    res.status(201).json(authorResponse);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Definizione di una route PATCH per aggiornare un autore per ID
router.patch('/:id', async (req, res) => {
  try {
    const updateAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true // Restituisce il documento aggiornato anziché quello vecchio
      }
    );
    if (!updateAuthor) {
      return res.status(404).json({ message: 'Author not present in database...' });
    }
    res.json(updateAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Definizione di una route DELETE per eliminare un autore per ID
router.delete('/:id', async (req, res) => {
  try {
    const deleteAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deleteAuthor) {
      return res.status(404).json({ message: 'Author not present in database...' });
    }
    res.json({ message: 'Author successfully deleted...' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /authors/:id/blogPosts: ricevi tutti i blog post di uno specifico autore
router.get('/:id/blogPosts', async (req, res) => {
  try {
    // Cerca l'autore specifico per ID
    const author = await Author.findById(req.params.id);
    if (!author) {
      // Se l'autore non viene trovato, invia una risposta 404
      return res.status(404).json({ message: 'Author not present in database...' });
    }
    // Cerca tutti i blog post dell'autore usando la sua email
    const blogPosts = await Post.find({ author: author.email });
    // Invia la lista dei blog post come risposta JSON
    res.json(blogPosts);
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});

// PATCH /authors/:authorId/avatar: carica un'immagine per l'autore specificato e salva l'URL
// creata da cloudinary nel database
router.patch('/:id/avatar', cloudinaryUploader.single('avatar'), async (req, res) => {
  try {
    // verifica se il file sia stato caricato
    if(!req.file) {
      return res.status(400).json({ message: 'No files loaded...'});
    } 

    // cerca l'autore nel database con id
    const author = await Author.findById(req.params.id);
    if(!author) {
      return res.status(404).json({ message: 'Author not present in database...'});

    }

    // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
    author.avatar = req.file.path;

    // Salva le modifiche nel db
    await author.save();

    // Codice per invio mail con MAILGUN
    const htmlContent = `
      <h1>Avatar Pubblicato con Successo!</h1>
      <p>Gentile ${author.name} ${author.lastname},</p>
      <p>Siamo lieti di informarti che il tuo avatar è stato pubblicato con successo.</p>
      <p>Di seguito il tuo nuovo avatar:</p>
      <br>
      <p>Grazie per il tuo prezioso contributo al nostro blog!</p>
      <p>Il Team di BlogPosts</p>
      <hr style="border: none; border-top: 1px solid #ccc;">
      <p>Per supporto, contattare il seguente indirizzo email:>supporto@blogposts.com</p>
    `;

    try {
      await sendEmail(
        author.email, 
        'Avatar Pubblicato con Successo',
        htmlContent
      );
    } catch (emailError) {
      console.error('Email not sent correctly', emailError.message);
    }

    // Invia la risposta con l'autore aggiornato
    res.json(author);
    } catch (error) {
      console.error('Error updating avatar:', error);
      res.status(500).json({ message: 'Internal Server Error...' });
    }
});


// Esportazione del router
export default router;
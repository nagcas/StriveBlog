// Importazione del modulo express
import express from 'express';
// Importazione del modello Post
import Post from '../models/Posts.js';
import cloudinaryUploader from "../config/claudinaryConfig.js";
// import upload from '../middlewares/upload.js';
import { sendEmail } from '../services/emailServices.js';
import { v2 as cloudinary } from 'cloudinary';
import { authMiddleware } from '../middlewares/authMiddleware.js';

// Creazione di un router Express
const router = express.Router();


/*
  GESTIONE POST
*/

// Definizione di una route GET per ottenere tutti i posts con paginazione e ordinamento
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sort = req.query.sort || 'name';
    const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const posts = await Post.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Definizione di una route GET per ottenere un post per ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not present in the Post database...' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.use(authMiddleware);

// Definizione di una route POST per creare un nuovo post
// router.post('/', async (req, res) => {
//   const post = new Post(req.body);
//   try {
//     const newPost = await post.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// router.post('/', upload.single('cover'), async (req, res) => {
//   try {
//     const postData = req.body;
//     if (req.file) {
//       postData.cover = `http://localhost:5001/uploads/${req.file.filename}}`;
//     } 
//     const newPost = new Post(postData);
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error('Errore nella creazione', err);
//     res.status(400).json({ message: err.message });
//   }
// });



router.post('/', cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    const postData = req.body;
    
    if (req.file) {
      // Cloudinary restituirà direttamente il suo url
      postData.cover = req.file.path; 
    }

    const newPost = new Post(postData);
    await newPost.save();

    // Codice per invio mail con MAILGUN
    const htmlContent = `
      <h1>Pubblicazione del Post Riuscita!</h1>
      <p>Gentile ${newPost.author.email},</p>
      <p>Siamo lieti di informarti che il tuo post intitolato '<strong>${newPost.title}</strong>' è stato pubblicato con successo.</p>
      <p>Categoria: <strong>${newPost.category}</strong></p>
      <br>
      <p>Grazie per il tuo prezioso contributo al nostro blog!</p>
      <p>Il Team di BlogPosts</p>
      <hr style="border: none; border-top: 1px solid #ccc;">
      <p>Per supporto, contattare il seguente indirizzo email:>supporto@blogposts.com</p>
    `;

    await sendEmail(
      newPost.author.email, 
      'Il tuo post è stato pubblicato con successo',
      htmlContent
    );

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});


// Definizione di una route PATCH per aggiornare un post per ID
router.patch('/:id', async (req, res) => {
  try {
    const updatePost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      // Restituisce il documento aggiornato anziché quello vecchio
      new: true, 
    });
    if (!updatePost) {
      return res.status(404).json({ message: 'Post not present in the Post database....' });
    }
    res.json(updatePost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch('/:id/cover', cloudinaryUploader.single('cover'), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: 'No files loaded...' });
    }

    // Cerca il blog post nel db
    const blogPost = await Post.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Post not present in the Post database....' });
    }

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    blogPost.cover = req.file.path;

    // Salva le modifiche nel db
    await blogPost.save();

    // Codice per invio mail con MAILGUN
    const htmlContent = `
      <h1>Aggiornamento della Cover Avvenuto con Successo!</h1>
      <p>Gentile ${blogPost.author.email},</p>
      <p>Ti informiamo che l'account associato alla tua email ha subito una modifica.</p>
      <p>La cover del tuo post è stata aggiornata con successo.</p>
      <br>
      <p>Il Team di BlogPosts</p>
      <hr style="border: none; border-top: 1px solid #ccc;">
      <p>Per supporto, contattare il seguente indirizzo email:>supporto@blogposts.com</p>1
    `;

    await sendEmail(
      blogPost.author.email, 
      'Aggiornamento della Cover del Tuo Post',
      htmlContent
    );


    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error('Error updating cover:', error);
    res.status(500).json({ message: 'Internal server error...' });
  }
});

//nuova delete per cancellare l'immagina da cloudinary
router.delete('/:id', async (req, res) => {
  try {
    // Trova il blog post dal database
    const blogPost = await Post.findById(req.params.id);
    if (!blogPost) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: 'Post not present in the Post database.' });
    }

    // Estrai public_id da Cloudinary dall'URL della cover
    const publicId = `blog_covers/${blogPost.cover.split('/').pop().split('.')[0]}`;
    console.log('Extracted publicId:', publicId);
    // Elimina l'immagine da Cloudinary
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary deletion result:', result);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
    }

    // Elimina il blog post dal database
    await Post.findByIdAndDelete(req.params.id);

    // Invia un messaggio di conferma come risposta JSON
    res.json({ message: 'Post and cover image deleted' });
  } catch (err) {
    // In caso di errore, invia una risposta di errore
    res.status(500).json({ message: err.message });
  }
});



/* funziona
// Definizione di una route DELETE per eliminare un post per ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
      if (!deletedPost) {
       return res.status(404).json({ message: 'Post non trovato...' });
      }
      res.json({ message: 'Post eliminato correttamente...' });
    } catch (err) {
     res.status(500).json({ message: err.message });
    }
  });
funziona */



/*
  GESTIONE COMMENTI
*/

// GET /blogPosts/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const blogPost = await Post.findById(req.params.id);
    if(!blogPost) {
      return res.status(404).json({ message: 'Comment not present...'});
    }
    res.json(blogPost.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// POST /blogPosts/:id/comments 
router.post('/:id/comments', async (req, res) => {
  try {
    // Trova il post per ID
    const blogPost = await Post.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Post not present in the Post database....' });
    }

    // Crea un nuovo commento
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content
    };

    // Aggiungi il commento al post e salva
    blogPost.comments.push(newComment);
    
    await blogPost.save();

    console.log(newComment.email);

    // Codice per invio mail con MAILGUN
    const htmlContent = `
      <h1>Creazione del Commento Avvenuta con Successo!</h1>
      <p>Gentile ${newComment.name},</p>
      <p>Ti informiamo che l'account associato alla tua email (${newComment.email}) ha subito una modifica.</p>
      <p>Il tuo commento è stato aggiornato con successo.</p>
      <br>
      <p>Il Team di BlogPosts</p>
      <hr style="border: none; border-top: 1px solid #ccc;">
      <p>Per supporto, contattare il seguente indirizzo email:>supporto@blogposts.com</p>
    `;

    await sendEmail(
      newComment.email,
      'Creazione del Tuo Commento Confermata', // oggetto dell'email
      htmlContent
    );

    
    // Risponde con i commenti aggiornati del post
    res.status(201).json(newComment);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// GET /blogPosts/:id/comments/:commentId
router.get('/:id/comments/:commentId', async (req, res) => {
  try {
    const blogPost = await Post.findById(req.params.id);
    if(!blogPost) {
      return res.status(404).json({ message: 'Post not present in the Post database....'});
    }

    const comment = blogPost.comments.id(req.params.commentId);
    if(!comment) {
      return res.status(404).json({ message: 'Comment not present...'});
    }

    res.json(comment);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// PUT /blogPosts/:id/comments/:commentId
router.patch('/:id/comments/:commentId', async (req, res) => {
  try {
    const blogPost = await Post.findById(req.params.id);
    if(!blogPost) {
      return res.status(404).json({ message: 'Post not present in the Post database....'});
    }

    const comment = blogPost.comments.id(req.params.commentId);
    if(!comment) {
      return res.status(404).json({ message: 'Comment not present...'});
    }

    if (req.body.name) comment.name = req.body.name;
    if (req.body.email) comment.email = req.body.email;
    if (req.body.content) comment.content = req.body.content;

    await blogPost.save();
    res.json(comment);
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// DELETE /blogPosts/:id/comments/:commentId
router.delete('/:id/comments/:commentId', async (req, res) => {
  try {
    const blogPost = await Post.findById(req.params.id);
    if(!blogPost) {
      return res.status(404).json({ message: 'Post not present in the Post database....'});
    }

    const comment = blogPost.comments.id(req.params.commentId);
    
    //console.log(comment);
    
    if(!comment) {
      return res.status(404).json({ message: 'Comment not present...' });
    }
    
    // Rimuovi il commento usando il metodo pull
    blogPost.comments.pull({ _id: req.params.commentId });

    //comment.remove();
    await blogPost.save();
    //res.json({ message: 'Commento cancellato correttamente...'});
    res.json ({ blogPost, message: 'Comment successfully deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Esportazione del router
export default router;
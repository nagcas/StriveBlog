// Importazione di Schema e model da mongoose
import { Schema, model } from 'mongoose';

// NEW: AGGIUNGO LO SCHEMA PER I COMMENTI!
const commentSchema = new Schema(
  {
    name: {
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
  },
  {
    timestamps: true,
    _id: true 
  },
);


// Definizione dello schema dei post
const postSchema = new Schema(
  {
    // Campo category: tipo String e obbligatorio
    category: {
      type: String,
      required: true,
      trim: true
    },
    // Campo title: tipo String e obbligatorio
    title: {
      type: String,
      required: true,
      trim: true
    },
    // Campo cover: tipo String, non obbligatorio
    cover: {
      type: String,
      default: ''
    },
    // Campo readTime: tipo oggetto con value e unit
    readTime: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        required: true
      }
    },
    // Campo author: tipo oggetto con email
    author: {
      email: {
        type: String,
        required: true
      }
    },
    // Campo content: tipo String e obbligatorio
    content: {
      type: String,
      required: true
    },
    comments: [commentSchema]
  },
  {
    collection: 'posts', // Nome della collezione
    timestamps: true // Aggiunge createdAt e updatedAt
  }
);

// Creazione del modello Post basato sullo schema postSchema
const Post = model('Post', postSchema);

// Esportazione del modello Post
export default Post;

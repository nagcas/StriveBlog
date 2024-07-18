// Importazione di Schema e model da mongoose
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// Definizione dello schema degli autori
const authorSchema = new Schema(
  {
    // Campo nome: tipo String e obbligatorio
    name: {
      type: String,
      required: true,
      trim: true
    },
    // Campo cognome: tipo String e obbligatorio
    lastname: {
      type: String,
      trim: true
    },
    // Campo email: tipo String, obbligatorio e unico
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
    },
    // Campo birthdate: tipo String e obbligatorio
    birthdate: {
      type: Date
    },
    // Campo avatar: tipo String e non obbligatorio
    avatar: {
      type: String,
    },
    password: {
      type: String
    },
    googleId: { 
      type: String 
    },
    githubId: {
      type: String,
    },
  },
  {
    collection: 'authors', // Nome della collezione
    timestamps: true // Aggiunge createdAt e updatedAt
  }
);


// Metodo per confrontare la password fornita con quella memorizzata
authorSchema.methods.comparePassword = function (candidatePassword) {
  // Utilizza bcrypt per confrontare la password fornita con l'hash memorizzato
  return bcrypt.compare(candidatePassword, this.password);
};

// Middleware pre-save per hashing della password prima di salvare il documento
authorSchema.pre('save', async function (next) {
  // Se la password non è stata modificata, passa al middleware successivo
  if (!this.isModified('password')) return next();

  try {
    // Genera un salt con un fattore di 10 round
    const salt = await bcrypt.genSalt(10);
    // Hash della password usando il salt generato
    this.password = await bcrypt.hash(this.password, salt);
    
    // Passa al middleware successivo
    next();
  } catch (error) {
    // In caso di errore, passa l'errore al middleware successivo
    next(error);
  }
});


// Creazione del modello Author basato sullo schema authorSchema
const Author = model('Author', authorSchema);

// Esportazione del modello Author
export default Author;


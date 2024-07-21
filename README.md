# 🌟 STRIVE BLOG - Progetto Full Stack MERN 🌟

Benvenuti nel progetto STRIVE BLOG! Questa è un'applicazione web full-stack costruita con lo stack MERN (MongoDB, Express.js, React, Node.js). L'applicazione consente agli utenti di registrarsi, accedere e creare post sul blog. Gli utenti possono anche accedere utilizzando Google e GitHub. Dopo la registrazione, viene inviata un'email di conferma all'account dell'utente tramite il servizio Mailgun. Gli utenti possono gestire i propri post e profili, commentare i post e visualizzare un elenco di autori.

🔗 [Visita STRIVE BLOG!](https://strive-blog-kappa.vercel.app/) 🌐

## 📑 Indice

- [🌟 STRIVE BLOG - Progetto Full Stack MERN 🌟](#-strive-blog---progetto-full-stack-mern-)
  - [📑 Indice](#-indice)
  - [✨ Caratteristiche](#-caratteristiche)
  - [💻 Tecnologie](#-tecnologie)
  - [🛠️ Installazione e Configurazione](#️-installazione-e-configurazione)

## ✨ Caratteristiche

- **📝 Registrazione e Accesso Utente**: Gli utenti possono registrarsi e accedere utilizzando email/password o tramite Google e GitHub.
- **📧 Conferma Email**: Un'email di conferma viene inviata all'utente dopo la registrazione utilizzando Mailgun.
- **🛠️ Operazioni CRUD per i Post**: Gli utenti (autori) possono creare, leggere, aggiornare e cancellare i propri post.
- **💬 Gestione Commenti**: Gli utenti possono commentare i post e gestire (creare, aggiornare, cancellare) i propri commenti.
- **👤 Profilo Utente**: Gli utenti possono aggiornare le informazioni del proprio profilo e la foto del profilo.
- **📜 Elenco Autori**: Una pagina dedicata all'elenco di tutti gli autori, accessibile solo agli utenti autenticati.
- **📱 Design Responsivo**: L'applicazione è progettata per essere responsiva e user-friendly.

## 💻 Tecnologie

- **Frontend**: React, Redux, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Autenticazione**: JWT, Passport.js, OAuth (Google, GitHub)
- **Servizio Email**: Mailgun
- **Altro**: Axios, Mongoose, bcryptjs

## 🛠️ Installazione e Configurazione

1. **Clona il repository**:
   ```bash
   git clone https://github.com/yourusername/strive-blog.git
   cd strive-blog

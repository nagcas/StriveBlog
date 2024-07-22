import './About.css'; // Importa gli stili per la pagina About.
import { Container } from 'react-bootstrap'; // Importa il componente Container di React-Bootstrap.

function About() {
  return (
    <Container className='content-about'> {/* Contenitore con stili specifici */}
      <h1>About Me</h1> {/* Titolo della pagina */}

      <p>Welcome to <span className='fw-bold'>STRIVE BLOG</span>!</p> {/* Introduzione al blog */}

      <p>Hello! I'm <span className='fw-bold'>Gianluca</span>, the creator behind <span className='fw-bold'>STRIVE BLOG</span>. I'm thrilled to have you here.</p>
      {/* Presentazione dell'autore */}

      <p>I started this blog as a way to share my passion for <span className='fw-bold'>technology, code and geology</span>. Whether you're here to find tips, inspiration, or just enjoy some great reads, I hope you find something that resonates with you.</p>
      {/* Motivazione del blog */}

      <h2>A Little About Me</h2> {/* Sottotitolo su informazioni personali */}
      <p>I have always been fascinated by <span className='fw-bold'>coding</span>. I decided to combine my expertise and love for writing to create this space where I can connect with like-minded individuals and share insights that I’ve gathered over the years.</p>
      {/* Passione per la programmazione e la creazione del blog */}

      <p>When I'm not writing, you can find me <span className='fw-bold'>mountain, volcanoes</span>. I believe in living life to the fullest and constantly seeking new adventures.</p>
      {/* Hobby e interessi dell'autore */}

      <h2>What You’ll Find Here</h2> {/* Sottotitolo sui contenuti del blog */}
      <p>On <span className='fw-bold'>STRIVE BLOG</span>, you can expect to find:</p>
      <ul> {/* Lista dei contenuti */}
        <li><span className='fw-bold'>In-depth Articles:</span> Detailed posts on <span className='fw-bold'>Technology</span></li>
        <li><span className='fw-bold'>How-To Guides:</span> Step-by-step instructions to help you with <span className='fw-bold'>technology</span>.</li>
        <li><span className='fw-bold'>Personal Stories:</span> Sharing my experiences and lessons learned</li>
        <li><span className='fw-bold'>Reviews:</span> Honest reviews of products, services, or books</li>
      </ul>

      <h2>Join the Community</h2> {/* Invito alla comunità */}
      <p>I love connecting with my readers! Feel free to leave comments, share your thoughts, or reach out to me directly. You can also follow me on <strong>github</strong> to stay updated with the latest posts and updates.</p>
      {/* Invito a interagire e seguire su GitHub */}

      <p>Thank you for being a part of this journey. I hope you enjoy your time here and find something valuable to take away.</p>
      {/* Ringraziamento e auguri */}

      <p>Happy Reading!</p> {/* Saluto finale */}
      <p><span className='fw-bold'>Gianluca 🚀🚀🚀, happy coding 😎</span></p>
      {/* Firma dell'autore */}
    </Container>
  );
};

export default About; // Esporta il componente About.

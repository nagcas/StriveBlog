import './About.css';

import { Container } from 'react-bootstrap';

function About() {
  return (
      <Container className='content-about'>
        <h1>About Me</h1>
        <p>Welcome to <span className='fw-bold'>STRIVE BLOG</span>!</p>
        <p>Hello! I'm <span className='fw-bold'>Gianluca</span>, the creator behind <span className='fw-bold'>STRIVE BLOG</span>. I'm thrilled to have you here.</p>
        <p>I started this blog as a way to share my passion for <span className='fw-bold'>technology, code and geology</span>. Whether you're here to find tips, inspiration, or just enjoy some great reads, I hope you find something that resonates with you.</p>
        
        <h2>A Little About Me</h2>
        <p>I have always been fascinated by <span className='fw-bold'>by coding</span>. I decided to combine my expertise and love for writing to create this space where I can connect with like-minded individuals and share insights that I’ve gathered over the years.</p>
        <p>When I'm not writing, you can find me <span className='fw-bold'>mountain, volcanoes</span>. I believe in living life to the fullest and constantly seeking new adventures.</p>
        
        <h2>What You’ll Find Here</h2>
        <p>On <span className='fw-bold'>STRIVE BLOG</span>, you can expect to find:</p>
        <ul>
            <li><span className='fw-bold'>In-depth Articles:</span> Detailed posts on <span className='fw-bold'>Tecnology</span></li>
            <li><span className='fw-bold'>How-To Guides:</span> Step-by-step instructions to help you with <span className='fw-bold'>tecnology.</span></li>
            <li><span className='fw-bold'>Personal Stories:</span> Sharing my experiences and lessons learned</li>
            <li><span className='fw-bold'>Reviews:</span> Honest reviews of products, services, or books</li>
        </ul>
        
        <h2>Join the Community</h2>
        <p>I love connecting with my readers! Feel free to leave comments, share your thoughts, or reach out to me directly. You can also follow me on <strong>github</strong> to stay updated with the latest posts and updates.</p>
        <p>Thank you for being a part of this journey. I hope you enjoy your time here and find something valuable to take away.</p>
        
        <p>Happy Reading!</p>
        <p><span className='fw-bold'>Gianluca 🚀🚀🚀, happy coding 😎</span></p>
      </Container>
  );
};

export default About;
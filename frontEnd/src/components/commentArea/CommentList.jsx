import './CommentArea.css'; // Importa il file CSS per la sezione dei commenti

import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap'; // Importa componenti di React-Bootstrap

import CreateComment from './CreateComment'; // Importa il componente per creare un commento
import DeleteComment from './DeleteComment'; // Importa il componente per eliminare un commento
import EditComment from './EditComment'; // Importa il componente per modificare un commento
import { Context } from '../../modules/Context.js'; // Importa il contesto per la gestione dell'autenticazione
import { useContext } from 'react'; // Importa l'hook useContext di React
import formatData from '../../services/formatDate.js'; // Importa il servizio per formattare le date

function CommentList({ id, comments, updateComments }) {
  // Definisce il componente funzionale CommentList

  const { authorLogin } = useContext(Context); // Recupera l'autore loggato dal contesto

  return (
    <Container className='content-area'>
      {/* Contenitore principale per l'area dei commenti */}
      <div className='d-flex justify-content-between align-items-center mt-4'>
        {/* Intestazione dell'area dei commenti */}
        <h4 className='content-title'>
          Comment Area 
          <Badge size={'sm'} bg='secondary'>{comments.length}</Badge>
          {/* Badge che mostra il numero di commenti */}
        </h4>
        <CreateComment id={id} updateComments={updateComments} />
        {/* Componente per creare un nuovo commento */}
      </div>
      <Row>
        {comments.length > 0 ? comments.map((comment) => (
          <ListGroup.Item key={comment._id} className='d-flex justify-content-between align-items-center content-comments'>
            {/* Lista dei commenti */}
            <Col md={2}>
              {/* Colonna per le informazioni sull'autore del commento */}
              <div className='d-flex flex-column'>
                <div className='d-flex flex-column comment-user'>
                  <span className='fw-bold'>{comment.name} </span>
                  <span>({comment.email})</span>
                </div>
                <small className='text-muted'>{formatData(comment.createdAt, 'it')}</small>
              </div>
            </Col>
            <Col md={8}>
              {/* Colonna per il contenuto del commento */}
              <div className='flex-grow-1 mx-3'>
                <span className='comment-content'>{comment.content}</span>
              </div>
            </Col>
            <Col md={2}>
              {(comment.email === authorLogin.email) && (
                <div className='d-flex justify-content-end align-items-center gap-2'>
                  {/* Opzioni per modificare o eliminare il commento se l'utente è l'autore */}
                  <EditComment id={id} comment={comment} commentId={comment._id} updateComments={updateComments} />
                  <DeleteComment id={id} commentId={comment._id} updateComments={updateComments} />
                </div>
              )}
            </Col>
          </ListGroup.Item>
        )) : <div className='text-center text-danger fs-5 text-uppercase content-comments'>no comments present...</div>}
        {/* Messaggio di assenza di commenti */}
      </Row>
    </Container>
  );
};

export default CommentList; // Esporta il componente CommentList per l'uso in altri file

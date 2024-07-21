import './CommentArea.css';

import { Badge, Col, Container, ListGroup, Row } from 'react-bootstrap';

import CreateComment from './CreateComment';
import DeleteComment from './DeleteComment';
import EditComment from './EditComment';
import { Context } from '../../modules/Context.js';
import { useContext } from 'react';
import formatData from '../../services/formatDate.js';


function CommentList({ id, comments, updateComments }) {

  const { authorLogin } = useContext(Context);

  return (
    <Container className='content-area'>
      <div className='d-flex justify-content-between align-items-center mt-4'>
        <h4 className='content-title'>Comment Area <Badge size={'sm'} bg='secondary'>{comments.length}</Badge></h4>
        <CreateComment id={id} updateComments={updateComments} />
      </div>
      <Row>
        {comments.length > 0 ? comments.map((comment) => (
          <ListGroup.Item key={comment._id} className='d-flex justify-content-between align-items-center content-comments'>
            <Col md={2}>
              <div className='d-flex flex-column'>
                  <div className='d-flex flex-column comment-user'>
                    <span className='fw-bold'>{comment.name} </span>
                    <span>({comment.email})</span>
                  </div>
                  <small className='text-muted'>{formatData(comment.createdAt, 'it')}</small>
              </div>
            </Col>
            <Col md={8}>
              <div className='flex-grow-1 mx-3'>
                <span className='comment-content'>{comment.content}</span>
              </div>
            </Col>
              <Col md={2}>
            {(comment.email === authorLogin.email) && (
                <div className='d-flex justify-content-end align-items-center gap-2'>
                  {/* Componenti link per eliminare e aggiornare il commento */}
                  <EditComment id={id} comment={comment} commentId={comment._id} updateComments={updateComments} />
                  <DeleteComment id={id} commentId={comment._id} updateComments={updateComments} />
                </div>
            )}
              </Col>
          </ListGroup.Item>
        )) : <div className='text-center text-danger fs-5 text-uppercase content-comments'>no comments present...</div>}
      </Row>
    </Container>
  );
};

export default CommentList;

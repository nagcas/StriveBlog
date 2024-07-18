export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400 || err.name === 'validationError') {
    res.status(400).json({
      error: 'Invalid request...',
      message: err.message
    })
  } else {
    next(err);
  }
};

export const authorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).json({
      error: 'Authentication error...',
      message: 'Re-authenticate...'
    })
  } else {
    next(err)
  }
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Resource not found...',
    message: 'The requested resource was not found...'
  })
};

export const genericErrorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error...',
    message: 'Generic error...'
  })
};

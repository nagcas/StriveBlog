const controlEmail = (req, res, next) => {
  const email = 'autorizzato@gmail.com';
  const emailUser = req.headers['user-email'];

  if (email === emailUser) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized user...' });
  }
};

export default controlEmail;
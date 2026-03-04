const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next({ code: 403, message: 'Header Missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next({ code: 403, message: 'Token Missing' });
  }

  try {
    req.data = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return next({ code: 403, message: 'Access denied' });
  }
}

module.exports = verifyToken;

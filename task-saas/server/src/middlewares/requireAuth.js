const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: missing token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ SƏNDƏ userId payload.id-dən gəlir
    req.user = { id: payload.id, email: payload.email };

    if (!req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: invalid token payload' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
}

module.exports = { requireAuth };

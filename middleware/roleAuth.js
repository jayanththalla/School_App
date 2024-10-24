// middleware/roleAuth.js
import jwt from 'jsonwebtoken';

export const roleAuth = (roles) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Get token from headers

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user's role matches one of the allowed roles
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

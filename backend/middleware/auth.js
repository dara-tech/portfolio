import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  // The token is typically sent in the Authorization header as: "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    
    // Attach the user (or admin) payload to the request object for use in subsequent routes
    req.user = user;
    next();
  });
};

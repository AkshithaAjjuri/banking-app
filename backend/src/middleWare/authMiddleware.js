import jwt from 'jsonwebtoken';

/**
 * Express middleware to authenticate JWT and attach user info to the request.
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Expecting header like "Bearer <token>"
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  if(next){
    next();
  }
}

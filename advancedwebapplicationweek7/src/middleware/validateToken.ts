import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const validateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Token not found.' });
    return;
  }
  
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      console.error('SECRET environment variable not set');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }
    
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error: any) {
    console.error('Token validation error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const validateAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ message: 'Token not found.' });
    return;
  }
  
  try {
    const secret = process.env.SECRET;
    if (!secret) {
      console.error('SECRET environment variable not set');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }
    
    const decoded: any = jwt.verify(token, secret);
    req.user = decoded;
    
    if (!decoded.isAdmin) {
      res.status(403).json({ message: 'Access denied.' });
      return;
    }
    
    next();
  } catch (error: any) {
    console.error('Token validation error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

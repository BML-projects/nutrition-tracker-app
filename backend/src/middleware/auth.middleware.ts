import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔐 [Auth Middleware] Checking authentication...');
  console.log('🔐 [Auth Middleware] Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('🔐 [Auth Middleware] No Bearer token found or invalid format');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(" ")[1];
  console.log('🔐 [Auth Middleware] Token received (first 20 chars):', token.substring(0, 20) + '...');

  try {
    if (!process.env.JWT_ACCESS_SECRET) {
      console.error('🔐 [Auth Middleware] JWT_ACCESS_SECRET not set in environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as any;
    console.log('🔐 [Auth Middleware] Token verified. User ID:', decoded.userId);
    
    // Attach user info to request
    (req as any).userId = decoded.userId;
    (req as any).user = { userId: decoded.userId }; // Add this for compatibility
    
    next();
  } catch (error: any) {
    console.error('🔐 [Auth Middleware] Token verification error:', error.message);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    return res.status(403).json({ error: 'Authentication failed' });
  }
};
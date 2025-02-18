import { Request, Response, NextFunction } from 'express';
import { expressAuthentication } from '../authentication';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await expressAuthentication(req, 'jwt');
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required'
      }
    });
  }
};

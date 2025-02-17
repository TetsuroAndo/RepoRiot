import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUser = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores and hyphens'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      (error as any).status = 400;
      (error as any).details = errors.array();
      return next(error);
    }
    next();
  }
];

export const validateRepository = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Repository name is required')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Repository name can only contain letters, numbers, underscores and hyphens'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed');
      (error as any).status = 400;
      (error as any).details = errors.array();
      return next(error);
    }
    next();
  }
];

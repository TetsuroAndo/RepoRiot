import { Response } from 'express';
import { UserController } from '../controllers/userController';

export function initializeController(controller: any, res: Response) {
  if (controller instanceof UserController) {
    Object.defineProperty(controller, 'res', {
      value: res,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }
  return controller;
}

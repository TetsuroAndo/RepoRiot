import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserProfile);

export default router;

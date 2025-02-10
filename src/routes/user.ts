import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get('/users', (req: Request, res: Response) => {
  // ユーザー一覧の取得処理
  res.status(200).json({ message: 'User list' });
});

export default router;

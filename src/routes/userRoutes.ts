import express from 'express';
import passport from 'passport';
import { UserController } from '../controllers/userController';
import { RegisterRoutes } from './routes';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user using GitHub OAuth.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */

// GitHub OAuth認証ルート
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const controller = new UserController();
    controller.githubCallback(req);
    console.log('GitHub OAuth authentication successful!');
    res.redirect('/dashboard');
  }
);

// tsoaで生成されたルートを登録
RegisterRoutes(router);

export default router;

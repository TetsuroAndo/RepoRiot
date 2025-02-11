import express from 'express';
import passport from 'passport';
import { UserController } from '../controllers/userController';
import { RegisterRoutes } from './routes';

const router = express.Router();

// GitHub OAuth認証ルート
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    const controller = new UserController();
    controller.githubCallback(req);
    res.redirect('/dashboard');
  }
);

// tsoaで生成されたルートを登録
RegisterRoutes(router);

export default router;

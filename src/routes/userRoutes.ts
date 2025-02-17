import express from 'express';
import passport from 'passport';
import { UserController } from '../controllers/userController';
import { Prisma } from '@prisma/client';

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /users/auth/github:
 *   get:
 *     summary: GitHub認証
 *     description: GitHub OAuth認証を開始
 *     responses:
 *       302:
 *         description: GitHub認証ページにリダイレクトされる
 */
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email', 'read:user'] }));

/**
 * @swagger
 * /users/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     description: GitHub OAuth認証後のコールバック処理
 *     responses:
 *       302:
 *         description: 認証成功時にダッシュボードへリダイレクト
 *       401:
 *         description: 認証失敗
 */
router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', failureMessage: true }),
  async (req, res) => {
    await userController.oauthCallback(req);
    res.end();
  }
);

/**
 * @swagger
 * /users/auth/gitlab:
 *   get:
 *     summary: GitLab認証
 *     description: GitLab OAuth認証を開始
 *     responses:
 *       302:
 *         description: GitLab認証ページにリダイレクトされる
 */
router.get('/auth/gitlab', passport.authenticate('gitlab', { scope: ['read_user'] }));

/**
 * @swagger
 * /users/auth/gitlab/callback:
 *   get:
 *     summary: GitLab OAuth callback
 *     description: GitLab OAuth認証後のコールバック処理
 *     responses:
 *       302:
 *         description: 認証成功時にダッシュボードへリダイレクト
 *       401:
 *         description: 認証失敗
 */
router.get('/auth/gitlab/callback',
  passport.authenticate('gitlab', { failureRedirect: '/login', failureMessage: true }),
  async (req, res) => {
    await userController.oauthCallback(req);
    res.end();
  }
);

/**
 * @swagger
 * /users/auth/register:
 *   post:
 *     summary: 新規ユーザー登録
 *     description: GitHub/GitLabでの新規ユーザー登録
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - provider
 *               - providerId
 *               - accessToken
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               username:
 *                 type: string
 *                 minLength: 3
 *               name:
 *                 type: string
 *               provider:
 *                 type: string
 *                 enum: [github, gitlab]
 *               providerId:
 *                 type: string
 *                 description: GitHubまたはGitLabのユーザーID
 *               accessToken:
 *                 type: string
 *                 description: OAuthアクセストークン
 *     responses:
 *       201:
 *         description: ユーザーが正常に作成され、JWTトークンが返される
 *       400:
 *         description: 入力データが不正
 *       409:
 *         description: メールアドレスまたはユーザー名が既に使用されている
 */
router.post('/auth/register', async (req, res) => {
  try {
    const response = await userController.createUser(req.body);
    res.status(201).json(response);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(409).json({ message: 'Email or username already exists' });
    } else {
      res.status(400).json({ message: 'Invalid request data' });
    }
  }
});

/**
 * @swagger
 * /users/auth/login:
 *   post:
 *     summary: GitHub/GitLabでログイン
 *     description: GitHubまたはGitLabでユーザーがログイン
 *     responses:
 *       200:
 *         description: ログイン成功、ユーザー情報とJWTトークンが返される
 *       401:
 *         description: 認証失敗
 */
router.post('/auth/login', async (req, res) => {
  const response = await userController.login(req);
  res.json(response);
});

/**
 * @swagger
 * /users/auth/logout:
 *   post:
 *     summary: ログアウト
 *     description: 現在のセッションを終了し、認証トークンを無効化
 *     responses:
 *       200:
 *         description: ログアウト成功
 *       500:
 *         description: ログアウト処理に失敗
 */
router.post('/auth/logout', async (req, res) => {
  const response = await userController.logout(req);
  res.json(response);
});

export default router;

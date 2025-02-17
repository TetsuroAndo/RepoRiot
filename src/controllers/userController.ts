import { Controller, Route, Post, Get, Put, Path, Body, Response, Example, Security, Request } from '@tsoa/runtime';
import { User, CreateUserRequest, AuthResponse } from '../types/user';
import * as userService from '../services/userService';
import { Request as ExpressRequest } from 'express';
import { Session } from 'express-session';
import { LogOutOptions } from 'passport';

interface UserAuthRequest extends ExpressRequest {
  user?: User;
  logout: {
    (options: LogOutOptions, done: (err: any) => void): void;
    (done: (err: any) => void): void;
  };
}

@Route('users')
export class UserController extends Controller {
  /**
   * Create a new user via GitHub/GitLab
   */
  @Post()
  @Response(201, 'Created')
  @Example<AuthResponse>({
    user: {
      id: 1,
      email: 'user@example.com',
      username: 'username',
      githubId: null,
      accessToken: null,
      name: null,
      password: null,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    message: 'User created successfully',
    token: 'jwt.token.here'
  })
  public async createUser(@Body() requestBody: CreateUserRequest): Promise<AuthResponse> {
    const user = await userService.createUser(requestBody);
    const token = userService.generateToken(user.id);
    
    return {
      user,
      message: 'User created successfully',
      token
    };
  }

  /**
   * Get user profile by ID
   */
  @Get('{userId}')
  @Response(404, 'Not Found')
  @Example<User>({
    id: 1,
    email: 'user@example.com',
    username: 'username',
    githubId: null,
    accessToken: null,
    name: null,
    password: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  public async getUserProfile(@Path() userId: number): Promise<User> {
    const user = await userService.getUserById(userId);
    if (!user) {
      this.setStatus(404);
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  @Put('{userId}')
  @Response(200, 'Success')
  @Response(404, 'Not Found')
  @Example<User>({
    id: 1,
    email: 'updated@example.com',
    username: 'updated_username',
    githubId: null,
    accessToken: null,
    name: 'Updated Name',
    password: null,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  public async updateUserProfile(
    @Path() userId: number,
    @Body() requestBody: Partial<CreateUserRequest>
  ): Promise<User> {
    const user = await userService.updateUser(userId, requestBody);
    if (!user) {
      this.setStatus(404);
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Get current authenticated user
   */
  @Get('me')
  @Security('jwt')
  @Response(401, 'Not Authenticated')
  public async getCurrentUser(@Request() request: UserAuthRequest): Promise<User> {
    if (!request.user) {
      this.setStatus(401);
      throw new Error('Not authenticated');
    }
    return request.user as User;
  }

  /**
   * OAuth callback (GitHub/GitLab共通)
   */
  @Get('auth/{provider}/callback')
  public async oauthCallback(@Request() req: UserAuthRequest): Promise<void> {
    const user = req.user;

    if (!user) {
      this.setStatus(401);
      throw new Error('Authentication failed');
    }

    const token = userService.generateToken(user.id);

    // セキュアなCookie設定
    this.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Secure; SameSite=Lax`);
    // ダッシュボードへリダイレクト
    this.setHeader('Location', '/dashboard');
    this.setStatus(302);
  }

  /**
   * GitHub OAuth callback
   * @swagger
   * /users/auth/github/callback:
   *   get:
   *     summary: GitHub OAuth callback
   *     description: GitHub OAuth認証後のコールバック
   *     responses:
   *       302:
   *         description: GitHub OAuth認証が成功し、ダッシュボードにリダイレクトされる
   */
  @Get('auth/github/callback')
  public async githubCallback(@Request() req: UserAuthRequest): Promise<void> {
    const user = req.user;

    if (!user) {
      this.setStatus(401);
      throw new Error('Authentication failed');
    }

    const token = userService.generateToken(user.id);
    this.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Secure; SameSite=Lax`);
    this.setHeader('Location', '/dashboard');
    this.setStatus(302);
  }

  /**
   * Login user
   * @swagger
   * /users/auth/login:
   *   post:
   *     summary: GitHub/GitLabでログイン
   *     description: GitHubまたはGitLabアカウントを使ってログイン
   *     responses:
   *       200:
   *         description: ログイン成功、ユーザー情報とJWTトークンが返される
   */
  @Post('auth/login')
  public async login(@Request() req: UserAuthRequest): Promise<AuthResponse> {
    const user = req.user;
    if (!user) {
      this.setStatus(401);
      throw new Error('Authentication failed');
    }

    const token = userService.generateToken(user.id);
    this.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Secure; SameSite=Lax`);
    return {
      message: 'Login successful',
      user,
      token
    };
  }

  /**
   * Logout user
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
  @Post('auth/logout')
  public async logout(@Request() req: UserAuthRequest): Promise<{ message: string }> {
    await new Promise<void>((resolve, reject) => {
      req.logout({ keepSessionInfo: false }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    this.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0; Secure; SameSite=Lax');
    return { message: 'Logout successful' };
  }
}

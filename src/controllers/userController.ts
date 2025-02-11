import { Controller, Route, Post, Get, Path, Body, Response, Example, Security, Request } from '@tsoa/runtime';
import { User, CreateUserRequest, AuthResponse } from '../types/user';
import * as userService from '../services/userService';
import { Request as ExpressRequest } from 'express';

@Route('users')
export class UserController extends Controller {
  /**
   * Create a new user
   */
  @Post()
  @Response(201, 'Created')
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
  public async createUser(@Body() requestBody: CreateUserRequest): Promise<User> {
    return userService.createUser(requestBody);
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
   * Get current authenticated user
   */
  @Get('me')
  @Security('jwt')
  @Response(401, 'Not Authenticated')
  public async getCurrentUser(@Request() request: ExpressRequest): Promise<User> {
    if (!request.user) {
      this.setStatus(401);
      throw new Error('Not authenticated');
    }
    return request.user as User;
  }

  /**
   * GitHub OAuth callback
   */
  @Get('auth/github/callback')
  public async githubCallback(@Request() request: ExpressRequest): Promise<void> {
    this.setHeader('Location', '/dashboard');
    this.setStatus(302);
  }

  /**
   * Logout current user
   */
  @Get('logout')
  public async logout(@Request() request: ExpressRequest): Promise<void> {
    await new Promise<void>((resolve) => {
      (request as any).logout(() => resolve());
    });
    this.setHeader('Location', '/');
    this.setStatus(302);
  }
}

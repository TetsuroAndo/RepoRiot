export interface User {
  id: number;
  email: string;
  username: string;
  githubId: string | null;
  accessToken: string | null;
  name: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password?: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

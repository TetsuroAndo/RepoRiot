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
  provider: 'github' | 'gitlab';
  providerId: string;
  accessToken: string;
  email: string;  // format: email
  username: string;  // minLength: 3
  name?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
  token: string;
}

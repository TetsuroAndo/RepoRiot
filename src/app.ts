import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import userRoutes from './routes/userRoutes';
import repoRoutes from './routes/repoRoutes';
import { RegisterRoutes } from './routes/routes';
import './config/passport';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RepoRiot API' });
});

app.use('/api/users', userRoutes);
app.use('/api/repos', repoRoutes);

// Error handler
app.use(function errorHandler(err: any, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {
  if (err?.status === 401) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
  if (err?.status === 404) {
    return res.status(404).json({
      message: 'Not Found'
    });
  }
  if (err?.status === 400) {
    return res.status(400).json({
      message: 'Bad Request'
    });
  }
  return next(err);
});

// Serve generated swagger docs
app.use('/docs', express.static('public'));

export default app;

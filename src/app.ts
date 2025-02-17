import express, { Response as ExResponse, Request as ExRequest, NextFunction } from 'express';
import cors from 'cors';
import { env } from './config/env';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import repoRoutes from './routes/repoRoutes';
import './config/passport';

// Import swagger document
const swaggerDocument = require('../public/swagger.json');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session and Passport
app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from public directory
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
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

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;

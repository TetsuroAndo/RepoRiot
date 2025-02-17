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

// Global error handler
app.use(function errorHandler(err: any, req: ExRequest, res: ExResponse, next: NextFunction): ExResponse | void {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  // Log error for debugging (consider using a proper logging service in production)
  console.error(`Error ${status}: ${message}`, {
    path: req.path,
    method: req.method,
    error: err
  });

  return res.status(status).json({
    status: 'error',
    message: message,
    // Only include stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;

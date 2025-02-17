import app from './app';
import prisma from './config/prisma';
import { env } from './config/env';

const port = env.PORT;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('Successfully connected to database');

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
      console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

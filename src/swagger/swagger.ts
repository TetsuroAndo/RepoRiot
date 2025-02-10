import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';

const app = express();

// Swaggerのオプション設定
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the backend service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  // APIファイルに基づいてSwaggerを生成
  apis: ['./src/routes/*.ts'], // APIルートに関連するファイルのパス
};

// Swaggerの設定
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UIをExpressで表示
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default swaggerSpec;

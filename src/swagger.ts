import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hamkke API Doc',
      version: '1.0.0',
      description: '함께 스터디 서비스의 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: '로컬 서버',
      },
    ],
  },
  apis: ['./src/**/*.ts'], // 주석이 포함된 파일 경로
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

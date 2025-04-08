import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Herb Blog API",
      version: "1.0.0",
      description: "herb-blog API",
    },
    servers: [
      {
        url: "http://localhost:5000", // 백엔드 서버 주소
      },
    ],
  },
  apis: ["src/routes/*.ts", "src/entities/*.ts", "./src/docs/*.ts"], // Swagger 주석 달 파일 경로
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

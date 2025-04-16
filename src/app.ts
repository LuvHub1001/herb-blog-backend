import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import boardRoutes from "./routes/board.router";
import authRoutes from "./routes/auth.router";
import { AppDataSource } from "./config/data-source";
import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB 연결 확인");
    app.listen(PORT, () => {
      console.log(`서버 구동 중 >> http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`DB 연결 오류 >> ${error}`));

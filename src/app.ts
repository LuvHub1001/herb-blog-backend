import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import boardRoutes from "./routes/board.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/boards/til", boardRoutes);
app.use("/api/boards/diary", boardRoutes);

app.use("/api/boards/main-recent", boardRoutes);
app.use("/api/boards/main-til", boardRoutes);
app.use("/api/boards/main-diary", boardRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("DB 연결 확인");
    app.listen(PORT, () => {
      console.log(`서버 구동 중 >> http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`DB 연결 오류 >> ${error}`));

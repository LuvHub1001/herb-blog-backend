import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("DB 연결 확인");
    app.listen(PORT, () => {
      console.log(`서버 구동 중 >> http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.log(`DB 연결 오류 >> ${error}`));

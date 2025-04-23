import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities:
    process.env.NODE_ENV === "production"
      ? [path.join(__dirname, "../../dist/entities/**/*.entity.js")]
      : [path.join(__dirname, "../entities/**/*.entity.ts")],
});

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import boardRoutes from "./routes/board.router";
import authRoutes from "./routes/auth.router";
import visitorRoutes from "./routes/visitor.router";
import uploadRoutes from "./routes/upload.router";
import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter";
import prisma from "./config/prisma";
import { requestId } from "./middleware/requestId";
import { responseTime } from "./middleware/responseTime";
import swaggerSpec from "./config/swagger";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

// Request ID 추적 + 응답시간 로깅
app.use(requestId);
app.use(responseTime);

// 보안 헤더
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
    },
    frameguard: { action: "deny" },
  })
);

// 응답 압축
app.use(compression());

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean);
app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
  })
);

// Body 파싱 + 크기 제한
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Swagger (프로덕션에서는 비활성화)
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Health check (DB 연결 상태 포함)
app.get("/api/health", async (_req, res) => {
  let dbStatus = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "disconnected";
  }

  const status = dbStatus === "connected" ? 200 : 503;
  res.status(status).json({
    success: dbStatus === "connected",
    data: {
      status: dbStatus === "connected" ? "ok" : "error",
      db: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
    },
  });
});

// Rate limiting
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// 라우트
app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/visitor", visitorRoutes);
app.use("/api/upload", uploadRoutes);

// 에러 핸들러
app.use(errorHandler);

export default app;

import app from "../helpers/test-app";
import request from "supertest";

describe("Health Check", () => {
  it("GET /api/health — 200 상태 반환", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data).toHaveProperty("uptime");
    expect(res.body.data).toHaveProperty("timestamp");
    expect(res.body.data).toHaveProperty("memory");
  });
});

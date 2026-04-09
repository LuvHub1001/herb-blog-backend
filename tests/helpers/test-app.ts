import prismaMock from "./prisma-mock";

// Prisma mock 적용
jest.mock("../../src/config/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));

// Supabase mock
jest.mock("../../src/config/supabase", () => ({
  supabase: {
    storage: { listBuckets: jest.fn().mockResolvedValue({ data: [], error: null }) },
  },
}));

import app from "../../src/app";
export default app;

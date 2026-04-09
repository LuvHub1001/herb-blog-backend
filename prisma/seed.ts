import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient({
  datasourceUrl: process.env.DIRECT_URL,
});

async function main() {
  const adminPw = process.env.ADMIN_PASSWORD;
  const testPw = process.env.TEST_PASSWORD;

  if (!adminPw || !testPw) {
    throw new Error("ADMIN_PASSWORD, TEST_PASSWORD 환경변수가 필요합니다.");
  }

  // 관리자 계정
  const adminPassword = await bcrypt.hash(adminPw, 10);
  await prisma.user.upsert({
    where: { userId: "dongherb" },
    update: { email: "dongherb@gmail.com" },
    create: {
      userId: "dongherb",
      username: "dongherb",
      nickname: "dongherb",
      email: "dongherb@gmail.com",
      password: adminPassword,
      role: "admin",
    },
  });

  // E2E 테스트 계정
  const testPassword = await bcrypt.hash(testPw, 10);
  await prisma.user.upsert({
    where: { userId: "test" },
    update: { password: testPassword },
    create: {
      userId: "test",
      username: "tester",
      nickname: "테스터",
      email: "test@test.com",
      password: testPassword,
      role: "admin",
    },
  });

  console.log("✅ 관리자 계정 생성 완료");
  console.log("✅ E2E 테스트 계정 생성 완료");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

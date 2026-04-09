// Prisma Client mock

export const prismaMock = {
  board: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findAndCount: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  visitor: {
    findFirst: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
  },
  $connect: jest.fn().mockResolvedValue(true),
  $disconnect: jest.fn().mockResolvedValue(true),
  $queryRaw: jest.fn(),
};

export default prismaMock;

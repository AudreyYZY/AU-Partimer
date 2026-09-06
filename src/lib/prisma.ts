// Prisma client singleton
// Note: Run `npx prisma generate` after setting up DATABASE_URL to generate types

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClient: any;

try {
  // Dynamic import - will work after prisma generate
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaModule = require("@/generated/prisma");
  PrismaClient = prismaModule.PrismaClient;
} catch {
  // Fallback for development without database
  console.warn(
    "Prisma client not generated. Run `npx prisma generate` after configuring DATABASE_URL."
  );
  PrismaClient = class MockPrismaClient {
    constructor() {
      return new Proxy(this, {
        get: () => {
          throw new Error(
            "Prisma client not generated. Run `npx prisma generate` first."
          );
        },
      });
    }
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalDatabase = globalThis as unknown as { auPrisma?: PrismaClient };
export function getDatabase() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_NOT_CONFIGURED");
  if (!globalDatabase.auPrisma) {
    globalDatabase.auPrisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000, max: 5, statement_timeout: 8000 }),
    });
  }
  return globalDatabase.auPrisma;
}

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

if (process.env.VERCEL) {
  const tmpDbPath = "/tmp/dev.db";
  if (!fs.existsSync(tmpDbPath)) {
    const srcDbPath = path.join(process.cwd(), "prisma", "dev.db");
    if (fs.existsSync(srcDbPath)) {
      try {
        fs.copyFileSync(srcDbPath, tmpDbPath);
      } catch (err) {
        console.error("Failed to copy SQLite database to /tmp:", err);
      }
    }
  }
  process.env.DATABASE_URL = "file:/tmp/dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

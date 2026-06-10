// give app a reusable prisma client 
// held in lib, holds reusable, core logic that doesnt depend on your apps specific buisness rules

// DEEP DIVE
import { PrismaClient } from "@prisma/client/extension";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient();
if (process.env.NONE_ENV !== "production"){
    globalForPrisma.prisma = prisma;
}
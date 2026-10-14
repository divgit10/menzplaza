import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminUser();
    const returns = await prisma.returnRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        order: { select: { orderNumber: true, totalAmount: true } },
        user: { select: { name: true, email: true } },
      },
    });
    return NextResponse.json({ returns });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch return requests" }, { status: 500 });
  }
}

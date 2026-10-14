import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdminUser();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        payments: true,
        user: { select: { name: true, email: true } },
      },
    });

    const formattedOrders = orders.map((o) => {
      let shippingAddress = null;
      try {
        shippingAddress = JSON.parse(o.shippingAddressJson);
      } catch {
        shippingAddress = o.shippingAddressJson;
      }
      return {
        ...o,
        shippingAddress,
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Admin orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

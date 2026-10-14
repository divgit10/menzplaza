import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        payments: true,
        returnRequests: true,
      },
    });

    const formattedOrders = orders.map((order) => {
      let shippingAddress = null;
      try {
        shippingAddress = JSON.parse(order.shippingAddressJson);
      } catch {
        shippingAddress = order.shippingAddressJson;
      }
      return {
        ...order,
        shippingAddress,
      };
    });

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Fetch my orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

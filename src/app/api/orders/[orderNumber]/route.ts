import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const { searchParams } = new URL(req.url);
    const guestVerify = searchParams.get("verify")?.toLowerCase().trim();

    const session = await getSessionUser();

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
        returnRequests: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: User must own the order OR be admin OR match guest email/phone
    const isOwner = session && session.userId === order.userId;
    const isAdmin = session && session.role === "ADMIN";
    const isGuestVerified =
      guestVerify &&
      (order.guestEmail?.toLowerCase() === guestVerify ||
        order.guestPhone?.replace(/[^0-9]/g, "") === guestVerify.replace(/[^0-9]/g, ""));

    if (!isOwner && !isAdmin && !isGuestVerified) {
      return NextResponse.json(
        { error: "Unauthorized access to order details" },
        { status: 403 }
      );
    }

    let parsedAddress = null;
    try {
      parsedAddress = JSON.parse(order.shippingAddressJson);
    } catch {
      parsedAddress = order.shippingAddressJson;
    }

    return NextResponse.json({
      order: {
        ...order,
        shippingAddress: parsedAddress,
      },
    });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}

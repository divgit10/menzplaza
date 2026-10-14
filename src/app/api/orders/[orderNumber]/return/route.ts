import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const returnSchema = z.object({
  type: z.enum(["RETURN", "EXCHANGE"]),
  reason: z.string().min(5, "Please provide a detailed reason"),
  notes: z.string().optional(),
  orderItemId: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const { orderNumber } = params;
    const session = await getSessionUser();
    const body = await req.json();
    const result = returnSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = session && session.userId === order.userId;
    const isAdmin = session && session.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status !== "DELIVERED" && order.status !== "CONFIRMED") {
      return NextResponse.json(
        { error: "Return or exchange can only be requested for confirmed or delivered orders." },
        { status: 400 }
      );
    }

    const returnRequest = await prisma.returnRequest.create({
      data: {
        orderId: order.id,
        userId: session?.userId || null,
        orderItemId: result.data.orderItemId || null,
        type: result.data.type,
        reason: result.data.reason,
        notes: result.data.notes || null,
        status: "REQUESTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Return/Exchange request submitted successfully. Our team will arrange reverse pickup.",
      returnRequest,
    });
  } catch (error) {
    console.error("Return request error:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}

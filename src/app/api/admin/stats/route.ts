import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminUser();

    const [
      totalOrders,
      paidOrders,
      totalProducts,
      lowStockVariants,
      pendingReturns,
      recentOrders,
      categories,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: { paymentStatus: "PAID" },
        select: { totalAmount: true },
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.productVariant.count({ where: { stockQuantity: { lte: 5 } } }),
      prisma.returnRequest.count({ where: { status: "REQUESTED" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          items: true,
        },
      }),
      prisma.category.findMany({
        select: {
          name: true,
          _count: { select: { products: true } },
        },
      }),
    ]);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockVariants,
        pendingReturns,
      },
      recentOrders,
      categoryDistribution: categories,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: {
          orderBy: [{ colorName: "asc" }, { waistSize: "asc" }, { inseamLength: "asc" }],
        },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get related products from the same category
    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
        isActive: true,
      },
      take: 4,
      include: {
        category: { select: { name: true, slug: true } },
        images: { orderBy: { displayOrder: "asc" }, take: 2 },
        variants: {
          select: {
            colorName: true,
            colorHex: true,
            waistSize: true,
          },
        },
      },
    });

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Fetch product detail error:", error);
    return NextResponse.json(
      { error: "Failed to load product details" },
      { status: 500 }
    );
  }
}

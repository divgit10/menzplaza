import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminUser();
    const { id } = params;
    const body = await req.json();

    const {
      name,
      description,
      regularPrice,
      salePrice,
      fitType,
      isFeatured,
      isBestseller,
      isNewArrival,
      isActive,
      stockQuantity,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(description ? { description } : {}),
        ...(regularPrice !== undefined ? { regularPrice: parseFloat(regularPrice) } : {}),
        ...(salePrice !== undefined ? { salePrice: parseFloat(salePrice) } : {}),
        ...(fitType ? { fitType } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isBestseller !== undefined ? { isBestseller: Boolean(isBestseller) } : {}),
        ...(isNewArrival !== undefined ? { isNewArrival: Boolean(isNewArrival) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
    });

    if (stockQuantity !== undefined) {
      await prisma.productVariant.updateMany({
        where: { productId: id },
        data: { stockQuantity: parseInt(stockQuantity, 10) },
      });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdminUser();
    const { id } = params;

    // Soft delete product by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Product deactivated" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

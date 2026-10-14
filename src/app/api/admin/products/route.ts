import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminUser();

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Admin products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminUser();
    const body = await req.json();

    const {
      name,
      slug,
      categoryId,
      description,
      fabricCare,
      materialComposition,
      regularPrice,
      salePrice,
      fitType,
      isFeatured,
      isBestseller,
      isNewArrival,
      imageUrl,
      colorName,
      colorHex,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categoryId,
        description,
        fabricCare,
        materialComposition,
        regularPrice: parseFloat(regularPrice),
        salePrice: parseFloat(salePrice),
        fitType,
        isFeatured: Boolean(isFeatured),
        isBestseller: Boolean(isBestseller),
        isNewArrival: Boolean(isNewArrival),
        images: {
          create: [
            {
              url:
                imageUrl ||
                "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
              altText: name,
              isPrimary: true,
              displayOrder: 1,
            },
          ],
        },
      },
    });

    // Create standard size variants for the new product
    const sizes = [28, 30, 32, 34, 36, 38];
    const color = colorName || "Obsidian Black";
    const hex = colorHex || "#171717";
    const variantsData = sizes.map((size) => ({
      productId: product.id,
      colorName: color,
      colorHex: hex,
      waistSize: size,
      inseamLength: 32,
      sku: `MZ-${product.slug.substring(0, 4).toUpperCase()}-${size}x32`,
      stockQuantity: 20,
    }));

    await prisma.productVariant.createMany({
      data: variantsData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

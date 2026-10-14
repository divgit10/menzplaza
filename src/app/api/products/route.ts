import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search")?.trim() || "";
    const categorySlug = searchParams.get("category");
    const fit = searchParams.get("fit");
    const waistSize = searchParams.get("waist");
    const color = searchParams.get("color");
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const featured = searchParams.get("featured") === "true";
    const bestseller = searchParams.get("bestseller") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const sort = searchParams.get("sort") || "featured";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (categorySlug && categorySlug !== "all") {
      where.category = {
        slug: categorySlug,
      };
    }

    if (fit && fit !== "all") {
      where.fitType = fit;
    }

    if (featured) where.isFeatured = true;
    if (bestseller) where.isBestseller = true;
    if (newArrival) where.isNewArrival = true;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.salePrice = {};
      if (minPrice !== undefined) where.salePrice.gte = minPrice;
      if (maxPrice !== undefined) where.salePrice.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { materialComposition: { contains: search } },
        { category: { name: { contains: search } } },
      ];
    }

    if (waistSize || color) {
      where.variants = {
        some: {
          stockQuantity: { gt: 0 },
          ...(waistSize ? { waistSize: parseInt(waistSize, 10) } : {}),
          ...(color ? { colorName: { contains: color } } : {}),
        },
      };
    }

    let orderBy: any = { isFeatured: "desc" };
    switch (sort) {
      case "price-asc":
        orderBy = { salePrice: "asc" };
        break;
      case "price-desc":
        orderBy = { salePrice: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "rating":
        orderBy = { rating: "desc" };
        break;
      case "bestseller":
        orderBy = { isBestseller: "desc" };
        break;
      default:
        orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: { select: { name: true, slug: true } },
          images: { orderBy: { displayOrder: "asc" } },
          variants: {
            where: { stockQuantity: { gt: 0 } },
            select: {
              id: true,
              colorName: true,
              colorHex: true,
              waistSize: true,
              inseamLength: true,
              stockQuantity: true,
              sku: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

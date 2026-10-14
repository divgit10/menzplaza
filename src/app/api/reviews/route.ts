import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { error: "Please log in to submit a review." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { productId, rating, title, comment } = result.data;

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.userId,
        rating,
        title,
        comment,
        isVerifiedPurchase: true,
        isApproved: true,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(averageRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Review submitted successfully!",
    });
  } catch (error) {
    console.error("Create review error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

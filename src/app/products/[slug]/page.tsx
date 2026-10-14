import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailView from "@/components/product/ProductDetailView";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });

  if (!product) {
    return { title: "Product Not Found | MENZPLAZA" };
  }

  return {
    title: `${product.name} | MENZPLAZA`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
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
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 4,
    include: {
      images: { orderBy: { displayOrder: "asc" }, take: 2 },
      variants: true,
      category: { select: { name: true, slug: true } },
    },
  });

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}

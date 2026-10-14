"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    regularPrice: number;
    salePrice: number;
    fitType: string;
    isNewArrival?: boolean;
    isBestseller?: boolean;
    rating: number;
    reviewCount: number;
    images: Array<{ url: string; altText?: string | null }>;
    variants?: Array<{
      id: string;
      colorName: string;
      colorHex: string;
      waistSize: number;
      inseamLength: number;
      stockQuantity: number;
      sku: string;
    }>;
    category?: { name: string; slug: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addItem } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // Group unique colors and waist sizes
  const uniqueColors: Array<{ name: string; hex: string }> = Array.from(
    new Map<string, { name: string; hex: string }>(
      (product.variants || []).map((v) => [v.colorName, { name: v.colorName, hex: v.colorHex }])
    ).values()
  );

  const uniqueWaists = Array.from(
    new Set((product.variants || []).map((v) => v.waistSize))
  ).sort((a, b) => a - b);

  const [selectedColor, setSelectedColor] = useState(
    uniqueColors[0]?.name || "Default"
  );
  const [isHovered, setIsHovered] = useState(false);

  const discount = calculateDiscount(product.regularPrice, product.salePrice);
  const primaryImage = product.images[0]?.url || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80";
  const hoverImage = product.images[1]?.url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the first available variant
    const matchedVariant =
      product.variants?.find((v) => v.colorName === selectedColor && v.stockQuantity > 0) ||
      product.variants?.[0];

    if (matchedVariant) {
      addItem({
        variantId: matchedVariant.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        colorName: matchedVariant.colorName,
        colorHex: matchedVariant.colorHex,
        waistSize: matchedVariant.waistSize,
        inseamLength: matchedVariant.inseamLength,
        price: product.salePrice,
        regularPrice: product.regularPrice,
        image: primaryImage,
        quantity: 1,
        stockQuantity: matchedVariant.stockQuantity,
      });
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-lg border border-sand/40 overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container with 4:5 Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              {discount}% OFF
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-obsidian text-sand-light text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">
              Bestseller
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-olive text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? "bg-terracotta text-white shadow-sm"
              : "bg-white/80 text-neutral-700 hover:bg-white hover:text-terracotta shadow-subtle"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="flex-1 bg-obsidian/90 hover:bg-obsidian text-ivory text-xs font-medium py-2.5 rounded backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors shadow-elevated"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="p-2.5 bg-white/90 hover:bg-white text-obsidian rounded backdrop-blur-sm transition-colors shadow-elevated"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Fit & Rating Header */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-olive">
              {product.fitType} Fit
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-obsidian">{product.rating}</span>
              <span className="text-neutral-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-xs sm:text-sm text-obsidian hover:text-olive transition-colors line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-sm sm:text-base font-bold text-obsidian">
              {formatINR(product.salePrice)}
            </span>
            {product.regularPrice > product.salePrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatINR(product.regularPrice)}
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Color Swatches */}
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-2 border-t border-sand/30">
              <div className="flex items-center gap-1">
                {uniqueColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedColor === color.name
                        ? "ring-2 ring-obsidian ring-offset-1 scale-110"
                        : "border-black/20 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-neutral-400 ml-auto">
                {uniqueWaists.length > 0 ? `${uniqueWaists[0]} - ${uniqueWaists[uniqueWaists.length - 1]}W` : ""}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

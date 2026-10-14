"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  Star,
  ShoppingBag,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Check,
  ChevronRight,
  Sparkles,
  Truck,
  Layers,
  HelpCircle,
  Plus,
  Minus,
  AlertCircle,
  Scissors,
} from "lucide-react";
import { formatINR, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import PincodeChecker from "./PincodeChecker";
import SizeGuideModal from "./SizeGuideModal";
import ProductCard from "./ProductCard";

interface ProductDetailProps {
  product: any;
  relatedProducts: any[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailProps) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const isWishlisted = isInWishlist(product.id);

  // Gallery
  const images = product.images || [];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Group unique colors, waists, and inseams
  const variants = product.variants || [];
  const uniqueColors: Array<{ name: string; hex: string }> = Array.from(
    new Map<string, { name: string; hex: string }>(
      variants.map((v: any) => [v.colorName, { name: v.colorName, hex: v.colorHex }])
    ).values()
  );

  const [selectedColor, setSelectedColor] = useState(uniqueColors[0]?.name || "");
  const [selectedWaist, setSelectedWaist] = useState<number | null>(null);
  const [selectedInseam, setSelectedInseam] = useState<number>(32);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  // Get matching variant
  const selectedVariant = variants.find(
    (v: any) =>
      v.colorName === selectedColor &&
      v.waistSize === selectedWaist &&
      v.inseamLength === selectedInseam
  );

  // Get available waists for current color
  const availableWaistsForColor = variants
    .filter((v: any) => v.colorName === selectedColor)
    .map((v: any) => v.waistSize);
  const uniqueWaists = Array.from(new Set(availableWaistsForColor)).sort((a: any, b: any) => a - b);

  const discount = calculateDiscount(product.regularPrice, product.salePrice);

  const handleAddToCart = () => {
    if (!selectedWaist) {
      setValidationError("Please select your waist size before adding to bag.");
      return;
    }
    if (!selectedVariant) {
      setValidationError("The selected size combination is unavailable.");
      return;
    }
    if (selectedVariant.stockQuantity <= 0) {
      setValidationError("This variant is currently out of stock.");
      return;
    }

    setValidationError(null);
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      colorName: selectedVariant.colorName,
      colorHex: selectedVariant.colorHex,
      waistSize: selectedVariant.waistSize,
      inseamLength: selectedVariant.inseamLength,
      price: product.salePrice,
      regularPrice: product.regularPrice,
      image: images[0]?.url || "",
      quantity,
      stockQuantity: selectedVariant.stockQuantity,
    });
  };

  const handleBuyNow = () => {
    if (!selectedWaist) {
      setValidationError("Please select your waist size to continue.");
      return;
    }
    handleAddToCart();
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviewSuccessMsg("Thank you! Your verified review has been published.");
        setReviewComment("");
        setReviewTitle("");
      } else {
        alert(data.error || "Failed to submit review");
      }
    } catch {
      alert("Error submitting review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 sm:mb-8">
        <Link href="/" className="hover:text-obsidian">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href="/products" className="hover:text-obsidian">Pants</Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <Link href={`/products?category=${product.category?.slug}`} className="hover:text-obsidian">
          {product.category?.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-obsidian font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-100 border border-sand/40 shadow-subtle group">
            {images.length > 0 && (
              <Image
                src={images[activeImageIdx]?.url || images[0]?.url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Discount Badge */}
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-terracotta text-white text-xs font-bold px-2.5 py-1 rounded tracking-wider uppercase shadow-sm">
                {discount}% OFF
              </span>
            )}

            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 p-2.5 rounded-full shadow-subtle transition-all ${
                isWishlisted
                  ? "bg-terracotta text-white"
                  : "bg-white/90 text-neutral-700 hover:text-terracotta hover:bg-white"
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img: any, idx: number) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImageIdx === idx
                      ? "border-obsidian ring-2 ring-obsidian/20 scale-105"
                      : "border-sand/40 hover:border-sand opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Selectors (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand & Category */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-olive font-bold tracking-widest uppercase">
                {product.category?.name} • {product.fitType} Fit
              </span>
              <span className="text-neutral-400 font-mono text-[11px]">
                SKU: {selectedVariant?.sku || `MZ-${product.slug.substring(0, 5).toUpperCase()}`}
              </span>
            </div>

            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-obsidian tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-obsidian">{product.rating}</span>
              <span className="text-xs text-neutral-400">
                ({product.reviewCount} verified gentleman reviews)
              </span>
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 bg-sand/15 rounded-xl border border-sand/40 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-obsidian">
                {formatINR(product.salePrice)}
              </span>
              {product.regularPrice > product.salePrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatINR(product.regularPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded">
                  Save {discount}% ({formatINR(product.regularPrice - product.salePrice)})
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-500">
              Inclusive of all taxes. Free express delivery on orders over ₹1,499.
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-obsidian">
                Color: <strong className="text-olive">{selectedColor}</strong>
              </span>
              <span className="text-neutral-400 text-[11px]">{uniqueColors.length} Shade(s)</span>
            </div>
            <div className="flex items-center gap-2">
              {uniqueColors.map((color: any) => (
                <button
                  key={color.name}
                  onClick={() => {
                    setSelectedColor(color.name);
                    setValidationError(null);
                  }}
                  className={`group relative p-1 rounded-full border transition-all ${
                    selectedColor === color.name
                      ? "ring-2 ring-obsidian ring-offset-2 border-transparent scale-110"
                      : "border-black/20 hover:scale-105"
                  }`}
                  title={color.name}
                >
                  <span
                    className="block w-6 h-6 rounded-full shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Waist Size Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-obsidian">
                Waist Size (Inches):{" "}
                {selectedWaist ? (
                  <strong className="text-obsidian">{selectedWaist}&quot;</strong>
                ) : (
                  <span className="text-terracotta font-medium">Select size</span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-olive hover:underline font-semibold flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Chart &amp; Fit Guide</span>
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {[28, 30, 32, 34, 36, 38].map((size) => {
                const isAvailable = uniqueWaists.includes(size);
                const isSelected = selectedWaist === size;
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => {
                      setSelectedWaist(size);
                      setValidationError(null);
                    }}
                    className={`py-2.5 text-xs font-bold rounded-lg border transition-all ${
                      isSelected
                        ? "bg-obsidian text-ivory border-obsidian shadow-sm"
                        : isAvailable
                        ? "bg-white text-obsidian border-sand/60 hover:border-obsidian"
                        : "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed line-through"
                    }`}
                  >
                    {size}&quot;
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inseam Length Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-obsidian">
                Inseam Length: <strong className="text-obsidian">{selectedInseam}&quot;</strong>
              </span>
              <span className="text-neutral-400 text-[11px]">
                {selectedInseam === 30 ? "Short (<5'7\")" : selectedInseam === 32 ? "Regular (5'8\"-6'0\")" : "Long (>6'1\")"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[30, 32, 34].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setSelectedInseam(len)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    selectedInseam === len
                      ? "bg-sand text-obsidian border-sand font-bold"
                      : "bg-white text-neutral-600 border-sand/40 hover:bg-ivory"
                  }`}
                >
                  {len}&quot; Inseam
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability indicator */}
          <div className="text-xs">
            {selectedVariant ? (
              selectedVariant.stockQuantity > 5 ? (
                <span className="text-olive font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> In Stock for Immediate Dispatch
                </span>
              ) : selectedVariant.stockQuantity > 0 ? (
                <span className="text-terracotta font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Only {selectedVariant.stockQuantity} pairs left in size {selectedWaist}W!
                </span>
              ) : (
                <span className="text-neutral-400 font-semibold flex items-center gap-1.5">
                  Sold out in this size combination
                </span>
              )
            ) : (
              <span className="text-neutral-500">
                Please select your waist size to check real-time stock
              </span>
            )}
          </div>

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 bg-terracotta/10 border border-terracotta/30 rounded-lg text-xs text-terracotta flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-sand/60 rounded-lg bg-white px-3 py-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-neutral-500 hover:text-obsidian p-1"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-obsidian min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-neutral-500 hover:text-obsidian p-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-elevated"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Bag</span>
              </button>
            </div>

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full bg-sand text-obsidian text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg hover:bg-sand-light transition-colors shadow-subtle"
            >
              Buy It Now • Instant Checkout
            </button>
          </div>

          {/* PIN code delivery checker */}
          <PincodeChecker />

          {/* Material & Care Accordion Details */}
          <div className="border-t border-sand/40 pt-5 space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-obsidian flex items-center gap-1.5 mb-1">
                <Layers className="w-4 h-4 text-olive" />
                <span>Material &amp; Craftsmanship</span>
              </h4>
              <p className="text-neutral-600 pl-5 leading-relaxed">
                {product.materialComposition || "Premium long-staple cotton tailored with micro-stretch."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-obsidian flex items-center gap-1.5 mb-1">
                <Scissors className="w-4 h-4 text-olive" />
                <span>Fabric Care Instructions</span>
              </h4>
              <p className="text-neutral-600 pl-5 leading-relaxed">
                {product.fabricCare || "Machine wash cold with like colors. Warm iron if required."}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-obsidian flex items-center gap-1.5 mb-1">
                <RotateCcw className="w-4 h-4 text-olive" />
                <span>The MENZPLAZA Promise</span>
              </h4>
              <p className="text-neutral-600 pl-5 leading-relaxed">
                Easy 7-day doorstep returns and complimentary size exchanges across 19,000+ Indian PIN codes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-16 pt-12 border-t border-sand/40 max-w-4xl">
        <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
          Sartorial Narrative
        </span>
        <h2 className="font-editorial text-2xl font-bold text-obsidian mb-4">
          About The Design
        </h2>
        <div className="prose prose-sm text-neutral-600 leading-relaxed space-y-4">
          <p>{product.description}</p>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <div className="mt-16 pt-12 border-t border-sand/40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
              Customer Feedback
            </span>
            <h2 className="font-editorial text-2xl font-bold text-obsidian">
              Verified Reviews ({product.reviews?.length || 0})
            </h2>
          </div>
        </div>

        {/* Existing Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev: any) => (
              <div
                key={rev.id}
                className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {rev.title && (
                  <h4 className="font-bold text-xs text-obsidian">{rev.title}</h4>
                )}
                <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                <div className="pt-2 text-[11px] font-medium text-olive flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>{rev.user?.name || "Verified Customer"}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-500 col-span-2">
              Be the first to review this tailored design!
            </p>
          )}
        </div>

        {/* Write a review form */}
        <div className="bg-sand/15 p-6 rounded-xl border border-sand/40 max-w-xl">
          <h3 className="font-editorial text-lg font-bold text-obsidian mb-2">
            Write A Review
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            Share your thoughts on fit, fabric drape, and comfort for fellow shoppers.
          </p>

          {reviewSuccessMsg ? (
            <div className="p-3 bg-olive/10 border border-olive/30 text-olive-dark rounded text-xs">
              {reviewSuccessMsg}
            </div>
          ) : user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-obsidian mb-1">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          num <= reviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-neutral-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Masterpiece tailored drape"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-sand/60 rounded text-obsidian focus:outline-none focus:border-obsidian"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-obsidian mb-1">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the waist fit, inseam drape, and fabric texture..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-sand/60 rounded text-obsidian focus:outline-none focus:border-obsidian"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="px-5 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          ) : (
            <div className="text-xs text-neutral-600">
              Please{" "}
              <Link href="/auth/login" className="text-obsidian font-bold underline">
                sign in
              </Link>{" "}
              to publish a verified review.
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-sand/40">
          <h2 className="font-editorial text-2xl font-bold text-obsidian mb-8">
            Pairs Well With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}

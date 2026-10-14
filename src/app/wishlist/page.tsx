"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch("/api/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data.products || []).filter((p: any) =>
          wishlistIds.includes(p.id)
        );
        setProducts(filtered);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [wishlistIds]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="border-b border-sand/40 pb-6 mb-8 flex items-baseline justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
            Personal Curation
          </span>
          <h1 className="font-editorial text-3xl font-extrabold text-obsidian tracking-tight">
            Saved In Wishlist ({wishlistIds.length})
          </h1>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-neutral-600 hover:text-obsidian flex items-center gap-1"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-neutral-200 rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-sand/60 p-12 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-sand/20 flex items-center justify-center mx-auto mb-4 text-terracotta">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-editorial text-xl font-bold text-obsidian mb-2">
            Your Wishlist Is Empty
          </h3>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Bookmark your favorite trousers, chinos, and selvedge denim while exploring our archive.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider px-6 py-3 rounded hover:bg-neutral-800 transition-colors"
          >
            <span>Explore Pant Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

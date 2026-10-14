import React, { Suspense } from "react";
import ProductsView from "@/components/product/ProductsView";

export const metadata = {
  title: "Men's Pants & Trousers Collection | MENZPLAZA",
  description:
    "Explore MENZPLAZA collection of specialized men's pants: formal trousers, stretch chinos, selvedge jeans, heavy cargo, and pure European linen.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian" />
          <p className="mt-4 text-xs text-neutral-500 font-medium">Loading MENZ archive...</p>
        </div>
      }
    >
      <ProductsView />
    </Suspense>
  );
}

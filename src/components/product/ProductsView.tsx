"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  X,
  ChevronDown,
  ArrowUpDown,
  Search,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { formatINR } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ProductsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States from URL or Defaults
  const selectedCategory = searchParams.get("category") || "all";
  const selectedFit = searchParams.get("fit") || "all";
  const selectedWaist = searchParams.get("waist") || "";
  const selectedSort = searchParams.get("sort") || "featured";
  const searchQuery = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Local inputs
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((e) => console.error(e));
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  // Update URL helper
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery("search", searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.push("/products");
  };

  const waistSizes = [28, 30, 32, 34, 36, 38, 40];
  const fitTypes = [
    { label: "All Fits", value: "all" },
    { label: "Slim Fit", value: "slim" },
    { label: "Tapered Fit", value: "tapered" },
    { label: "Regular Fit", value: "regular" },
    { label: "Relaxed Fit", value: "relaxed" },
  ];

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== "all") ||
    (selectedFit && selectedFit !== "all") ||
    selectedWaist !== "" ||
    searchQuery !== "" ||
    minPrice !== "" ||
    maxPrice !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header and Title */}
      <div className="border-b border-sand/40 pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
              {searchQuery ? `Search Results for "${searchQuery}"` : "The Pant Archive"}
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
              {selectedCategory !== "all"
                ? categories.find((c) => c.slug === selectedCategory)?.name || "All Pants"
                : "All Trousers & Pants"}
            </h1>
          </div>

          {/* Quick Search in Listing */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search style, wool, linen..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-sand/60 rounded-full focus:outline-none focus:border-obsidian"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-obsidian text-ivory text-xs font-semibold rounded-full hover:bg-neutral-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-sand/20">
            <span className="text-xs text-neutral-500 font-medium">Active Filters:</span>
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1 text-xs bg-sand/30 text-obsidian px-2.5 py-1 rounded-full font-medium">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name}
                <button onClick={() => updateQuery("category", "all")}>
                  <X className="w-3 h-3 hover:text-terracotta" />
                </button>
              </span>
            )}
            {selectedFit !== "all" && (
              <span className="inline-flex items-center gap-1 text-xs bg-sand/30 text-obsidian px-2.5 py-1 rounded-full font-medium">
                Fit: {selectedFit}
                <button onClick={() => updateQuery("fit", "all")}>
                  <X className="w-3 h-3 hover:text-terracotta" />
                </button>
              </span>
            )}
            {selectedWaist && (
              <span className="inline-flex items-center gap-1 text-xs bg-sand/30 text-obsidian px-2.5 py-1 rounded-full font-medium">
                Waist: {selectedWaist}&quot;
                <button onClick={() => updateQuery("waist", "")}>
                  <X className="w-3 h-3 hover:text-terracotta" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 text-xs bg-sand/30 text-obsidian px-2.5 py-1 rounded-full font-medium">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => updateQuery("search", "")}>
                  <X className="w-3 h-3 hover:text-terracotta" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs text-terracotta hover:underline ml-2 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6 pr-4">
          {/* Categories */}
          <div className="border-b border-sand/40 pb-5">
            <h3 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-3">
              Pant Silhouette
            </h3>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => updateQuery("category", "all")}
                className={`block w-full text-left py-1 transition-colors ${
                  selectedCategory === "all"
                    ? "font-bold text-obsidian pl-2 border-l-2 border-obsidian"
                    : "text-neutral-600 hover:text-obsidian"
                }`}
              >
                All Pants
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateQuery("category", cat.slug)}
                  className={`block w-full text-left py-1 transition-colors ${
                    selectedCategory === cat.slug
                      ? "font-bold text-obsidian pl-2 border-l-2 border-obsidian"
                      : "text-neutral-600 hover:text-obsidian"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fit Selector */}
          <div className="border-b border-sand/40 pb-5">
            <h3 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-3">
              Leg Fit Type
            </h3>
            <div className="space-y-1 text-xs">
              {fitTypes.map((fit) => (
                <label key={fit.value} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="fit"
                    checked={selectedFit === fit.value}
                    onChange={() => updateQuery("fit", fit.value)}
                    className="accent-obsidian"
                  />
                  <span className={selectedFit === fit.value ? "font-bold text-obsidian" : "text-neutral-600"}>
                    {fit.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Waist Sizes */}
          <div className="border-b border-sand/40 pb-5">
            <h3 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-3">
              Waist Size (Inches)
            </h3>
            <div className="grid grid-cols-4 gap-1.5">
              {waistSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => updateQuery("waist", selectedWaist === String(size) ? "" : String(size))}
                  className={`py-1.5 text-xs font-medium rounded border transition-all ${
                    selectedWaist === String(size)
                      ? "bg-obsidian text-ivory border-obsidian font-bold"
                      : "bg-white text-neutral-700 border-sand/60 hover:bg-ivory"
                  }`}
                >
                  {size}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pb-4">
            <h3 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-3">
              Price Range
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => updateQuery("minPrice", e.target.value)}
                className="w-1/2 p-2 bg-white border border-sand/60 rounded text-obsidian focus:outline-none focus:border-obsidian"
              />
              <span className="text-neutral-400">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => updateQuery("maxPrice", e.target.value)}
                className="w-1/2 p-2 bg-white border border-sand/60 rounded text-obsidian focus:outline-none focus:border-obsidian"
              />
            </div>
          </div>
        </div>

        {/* Products Listing Area */}
        <div className="lg:col-span-3">
          {/* Top Bar: Count & Sorting & Mobile Filter Trigger */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-lg border border-sand/40 mb-6 shadow-subtle">
            <div className="text-xs text-neutral-600">
              Showing <strong className="text-obsidian">{products.length}</strong> of{" "}
              <strong className="text-obsidian">{total}</strong> styles
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-ivory border border-sand/60 rounded text-xs font-medium text-obsidian"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
                <span className="text-neutral-500 hidden sm:inline">Sort:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => updateQuery("sort", e.target.value)}
                  className="bg-transparent font-medium text-obsidian border-none focus:outline-none cursor-pointer pr-4 py-1"
                >
                  <option value="featured">Featured First</option>
                  <option value="bestseller">Bestsellers</option>
                  <option value="newest">New Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3 bg-white p-3 rounded-lg border border-sand/30">
                  <div className="aspect-[4/5] bg-neutral-200 rounded" />
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* No Results State */
            <div className="bg-white rounded-xl border border-sand/60 p-12 text-center max-w-lg mx-auto my-8">
              <div className="w-14 h-14 rounded-full bg-sand/20 flex items-center justify-center mx-auto mb-4 text-neutral-500">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-xl font-bold text-obsidian mb-2">
                No Trousers Match Your Criteria
              </h3>
              <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                We couldn&apos;t find any pants matching your selected filters. Try clearing some filters or searching for terms like &quot;Chino&quot;, &quot;Wool&quot;, or &quot;Cargo&quot;.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-obsidian text-ivory text-xs font-semibold rounded uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#FAF8F5] p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-sand/40">
                <h3 className="font-editorial text-lg font-bold text-obsidian">Filter Pants</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-neutral-500" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <h4 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-2">Category</h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      updateQuery("category", "all");
                      setIsMobileFilterOpen(false);
                    }}
                    className="block w-full text-left py-1 text-neutral-700 font-medium"
                  >
                    All Pants
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateQuery("category", c.slug);
                        setIsMobileFilterOpen(false);
                      }}
                      className="block w-full text-left py-1 text-neutral-700"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Fit */}
              <div>
                <h4 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-2">Fit</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {fitTypes.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => {
                        updateQuery("fit", f.value);
                        setIsMobileFilterOpen(false);
                      }}
                      className="p-2 border border-sand rounded text-center"
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Waist */}
              <div>
                <h4 className="text-xs font-bold text-obsidian uppercase tracking-wider mb-2">Waist Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {waistSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        updateQuery("waist", String(s));
                        setIsMobileFilterOpen(false);
                      }}
                      className="p-2 border border-sand rounded text-center text-xs font-bold"
                    >
                      {s}&quot;
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-sand/40">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2.5 border border-terracotta text-terracotta rounded text-xs font-semibold"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

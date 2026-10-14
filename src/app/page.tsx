import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Compass, Star, Scissors, Check, Award } from "lucide-react";
import prisma from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";
import FitFinderSection from "@/components/fit/FitFinderSection";

export const revalidate = 60; // 1-minute ISR for fast response and fresh data

export default async function HomePage() {
  // Fetch real data from Prisma
  const [categories, featuredProducts, bestsellers, newArrivals, reviews] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: { select: { products: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isBestseller: true },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, isNewArrival: true },
      take: 4,
      include: {
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.review.findMany({
      where: { isApproved: true },
      take: 3,
      orderBy: { rating: "desc" },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[680px] flex items-center bg-obsidian text-ivory overflow-hidden">
        {/* Background Image with subtle editorial overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2000&q=85"
            alt="MENZPLAZA Premium Menswear Pants Atelier"
            fill
            priority
            className="object-cover object-top opacity-35 filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sand/15 border border-sand/30 rounded-full text-sand-light text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sand" />
              <span>Specialized Men&apos;s Pants Atelier</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              The Right Fit. <br />
              <span className="italic font-normal text-sand">Every Time.</span>
            </h1>

            <p className="text-sm sm:text-base text-sand-light/80 font-light leading-relaxed max-w-xl">
              Elevate your daily presence with trousers cut for the modern Indian gentleman. From boardroom-ready Italian wool blends and 4-way stretch chinos to artisanal Japanese selvedge denim.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-sand text-obsidian text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-all duration-300 text-center shadow-elevated flex items-center justify-center gap-2"
              >
                <span>Shop All Pants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/fit-finder"
                className="px-8 py-4 bg-transparent border border-sand/50 text-ivory text-xs font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-colors text-center flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <Compass className="w-4 h-4 text-sand" />
                <span>Find Your Perfect Fit</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/15 max-w-md">
              <div>
                <div className="font-editorial text-2xl font-bold text-white">28 - 40W</div>
                <div className="text-[11px] text-neutral-400">Precision Waist Range</div>
              </div>
              <div>
                <div className="font-editorial text-2xl font-bold text-white">3 Inseams</div>
                <div className="text-[11px] text-neutral-400">Short, Regular, Long</div>
              </div>
              <div>
                <div className="font-editorial text-2xl font-bold text-white">100%</div>
                <div className="text-[11px] text-neutral-400">Indian Fit Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
              Curated Silhouettes
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-obsidian">
              Shop By Pant Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold tracking-wider uppercase text-obsidian hover:text-olive transition-colors flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-neutral-200 border border-sand/40 shadow-subtle hover:shadow-elevated transition-all duration-300"
            >
              <Image
                src={cat.image || "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80"}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/30 to-transparent transition-opacity group-hover:opacity-90" />
              <div className="absolute inset-x-4 bottom-4 text-white">
                <span className="text-[10px] text-sand uppercase tracking-wider font-semibold block mb-0.5">
                  {cat._count.products} Styles
                </span>
                <h3 className="font-editorial text-base sm:text-lg font-bold group-hover:text-sand transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5 hidden sm:block">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured / Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
              Handpicked Essentials
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-obsidian">
              Trending This Season
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="text-xs font-bold tracking-wider uppercase text-obsidian hover:text-olive transition-colors flex items-center gap-1 group"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Smart Fit Discovery: MENZ FIT FINDER */}
      <section className="bg-sand/20 py-16 px-4 sm:px-6 lg:px-8 border-y border-sand/40">
        <FitFinderSection />
      </section>

      {/* 5. Bestsellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
              Top Customer Rated
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-obsidian">
              MENZPLAZA Bestsellers
            </h2>
          </div>
          <Link
            href="/products?bestseller=true"
            className="text-xs font-bold tracking-wider uppercase text-obsidian hover:text-olive transition-colors flex items-center gap-1 group"
          >
            <span>View All Bestsellers</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-obsidian via-[#262626] to-obsidian text-ivory overflow-hidden p-8 sm:p-12 border border-sand/30 shadow-elevated">
          <div className="max-w-xl space-y-4">
            <div className="inline-block px-3 py-1 bg-terracotta text-white text-[11px] font-bold uppercase tracking-wider rounded">
              Festive Privilege
            </div>
            <h3 className="font-editorial text-2xl sm:text-4xl font-bold text-white">
              Complimentary Alterations &amp; Instant 10% Off
            </h3>
            <p className="text-xs sm:text-sm text-sand-light/80 leading-relaxed">
              Use code <strong className="text-white bg-white/10 px-2 py-0.5 rounded font-mono">WELCOME10</strong> at checkout for 10% off your inaugural trousers order, accompanied by our 7-day doorstep replacement guarantee.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-sand text-obsidian px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors"
              >
                <span>Claim Offer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sartorial Style Collections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
            Lifestyle Curation
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-obsidian">
            Dress For Every Occasion
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative h-80 rounded-xl overflow-hidden group shadow-subtle">
            <Image
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80"
              alt="Office & Boardroom Trousers"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white space-y-1">
              <span className="text-[10px] text-sand uppercase tracking-wider font-semibold">
                The Boardroom Series
              </span>
              <h3 className="font-editorial text-xl font-bold">Executive Formal Trousers</h3>
              <p className="text-xs text-neutral-300">
                Permanent crease retention and shirt-grip waistbands.
              </p>
              <Link
                href="/products?category=formal-pants"
                className="inline-flex items-center gap-1 text-xs text-sand font-semibold pt-2 hover:underline"
              >
                Explore Collection <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="relative h-80 rounded-xl overflow-hidden group shadow-subtle">
            <Image
              src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80"
              alt="Weekend Chinos and Casuals"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white space-y-1">
              <span className="text-[10px] text-sand uppercase tracking-wider font-semibold">
                Smart Casuals
              </span>
              <h3 className="font-editorial text-xl font-bold">4-Way Stretch Chinos</h3>
              <p className="text-xs text-neutral-300">
                Breathable combed cotton for all-day commutes.
              </p>
              <Link
                href="/products?category=chinos"
                className="inline-flex items-center gap-1 text-xs text-sand font-semibold pt-2 hover:underline"
              >
                Explore Collection <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="relative h-80 rounded-xl overflow-hidden group shadow-subtle">
            <Image
              src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80"
              alt="Vacation & Linen Pants"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-white space-y-1">
              <span className="text-[10px] text-sand uppercase tracking-wider font-semibold">
                Resort &amp; Summer
              </span>
              <h3 className="font-editorial text-xl font-bold">Pure European Linen</h3>
              <p className="text-xs text-neutral-300">
                Featherweight airy drapes for tropical climates.
              </p>
              <Link
                href="/products?category=linen-pants"
                className="inline-flex items-center gap-1 text-xs text-sand font-semibold pt-2 hover:underline"
              >
                Explore Collection <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Genuine Customer Reviews & Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
            Verified Experiences
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-obsidian">
            What Gentlemen Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-xl border border-sand/40 shadow-subtle flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <h4 className="font-editorial text-base font-bold text-obsidian mb-2">
                  &ldquo;{rev.title}&rdquo;
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-sand/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-obsidian block">
                    {rev.user.name}
                  </span>
                  <span className="text-[10px] text-olive font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified Purchase
                  </span>
                </div>
                {rev.product && (
                  <Link
                    href={`/products/${rev.product.slug}`}
                    className="text-[10px] text-neutral-400 hover:text-obsidian truncate max-w-[120px]"
                  >
                    {rev.product.name}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

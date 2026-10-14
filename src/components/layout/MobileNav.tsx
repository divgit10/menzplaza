"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Compass, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  // Hide on checkout page to avoid distractions
  if (pathname === "/checkout") return null;

  const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Pants", href: "/products", icon: Grid },
    { label: "Fit Finder", href: "/fit-finder", icon: Compass, special: true },
    { label: "Wishlist", href: "/wishlist", icon: Heart, count: wishlistCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-sand/50 z-30 px-3 py-2">
      <div className="flex items-center justify-around">
        {links.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 relative transition-colors ${
                isActive ? "text-obsidian font-bold" : "text-neutral-500 hover:text-obsidian"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.special ? "text-olive" : ""}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-terracotta text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Bag Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-2 relative text-neutral-500 hover:text-obsidian"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-obsidian text-ivory text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Bag</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Compass,
  ShieldCheck,
  PackageCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import CartDrawer from "../cart/CartDrawer";

const navLinks = [
  { label: "Formal Pants", href: "/products?category=formal-pants" },
  { label: "Chinos", href: "/products?category=chinos" },
  { label: "Cargo Pants", href: "/products?category=cargo-pants" },
  { label: "Jeans", href: "/products?category=jeans" },
  { label: "Joggers", href: "/products?category=joggers" },
  { label: "Linen Pants", href: "/products?category=linen-pants" },
  { label: "Slim-Fit", href: "/products?category=slim-fit-pants" },
  { label: "Fit Finder", href: "/fit-finder", highlight: true },
];

export default function Header() {
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-sand/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-obsidian hover:text-neutral-600 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group">
                <span className="font-editorial text-2xl sm:text-3xl font-extrabold tracking-widest text-obsidian block">
                  MENZPLAZA
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block -mt-1 group-hover:text-olive transition-colors">
                  The Right Fit. Every Time.
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-medium tracking-wide transition-colors duration-200 relative py-2 ${
                    link.highlight
                      ? "text-olive font-semibold hover:text-olive-dark flex items-center gap-1"
                      : "text-neutral-700 hover:text-obsidian"
                  }`}
                >
                  {link.highlight && <Compass className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Toggle / Input */}
              <div className="relative">
                {isSearchOpen ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-72 flex items-center bg-white border border-sand rounded-full shadow-subtle px-3 py-1.5 z-10"
                  >
                    <input
                      type="text"
                      placeholder="Search trousers, fit, fabric..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full text-xs bg-transparent text-obsidian focus:outline-none placeholder-neutral-400"
                    />
                    <button type="submit" className="text-neutral-600 hover:text-obsidian p-1">
                      <Search className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSearchOpen(false)}
                      className="text-neutral-400 hover:text-neutral-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(true)}
                    className="p-1.5 text-neutral-700 hover:text-obsidian transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-1.5 text-neutral-700 hover:text-obsidian transition-colors relative hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1.5 text-neutral-700 hover:text-obsidian transition-colors flex items-center gap-1"
                  aria-label="User account"
                >
                  <UserIcon className="w-5 h-5" />
                  {user && (
                    <ChevronDown className="w-3 h-3 text-neutral-500 hidden md:inline-block" />
                  )}
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-elevated border border-sand/40 py-2 z-30 text-xs">
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-sand/30">
                            <p className="font-semibold text-obsidian truncate">{user.name}</p>
                            <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                            {user.role === "ADMIN" && (
                              <span className="inline-block mt-1 px-1.5 py-0.5 bg-neutral-900 text-[10px] text-white rounded font-mono">
                                ADMIN
                              </span>
                            )}
                          </div>

                          {user.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-obsidian"
                            >
                              <ShieldCheck className="w-4 h-4 text-olive" />
                              <span>Admin Dashboard</span>
                            </Link>
                          )}

                          <Link
                            href="/account/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-obsidian"
                          >
                            <PackageCheck className="w-4 h-4 text-neutral-500" />
                            <span>My Orders</span>
                          </Link>

                          <Link
                            href="/account/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-50 hover:text-obsidian"
                          >
                            <UserIcon className="w-4 h-4 text-neutral-500" />
                            <span>Saved Addresses & Profile</span>
                          </Link>

                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              logout();
                            }}
                            className="w-full text-left flex items-center gap-2 px-4 py-2 text-terracotta hover:bg-neutral-50 border-t border-sand/30 mt-1"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <div className="p-3 space-y-2">
                          <p className="text-[11px] text-neutral-500 mb-2">
                            Access your saved measurements, order tracking, and wishlist.
                          </p>
                          <Link
                            href="/auth/login"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block text-center w-full bg-obsidian text-ivory py-2 rounded font-medium hover:bg-neutral-800 transition-colors"
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/auth/register"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block text-center w-full border border-sand py-2 rounded font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                          >
                            Create Account
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Shopping Bag trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-1.5 text-neutral-700 hover:text-obsidian transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-obsidian text-ivory text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-t border-sand/40 px-6 py-5 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-medium text-neutral-800 hover:text-obsidian py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-sand/40 space-y-2">
              <Link
                href="/fit-finder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-olive py-1"
              >
                <Compass className="w-4 h-4" />
                <span>Menz Fit Finder</span>
              </Link>
              <Link
                href="/track-order"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm text-neutral-600 hover:text-obsidian py-1"
              >
                Track Guest Order
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
}

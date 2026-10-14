"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Shield, Truck, RefreshCw, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-obsidian text-sand/80 pt-16 pb-12 border-t border-sand/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-full text-sand">
              <Truck className="w-6 h-6 text-olive-light" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
                Pan-India Express Shipping
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Complimentary on orders over ₹1,499
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-full text-sand">
              <RefreshCw className="w-6 h-6 text-sand" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
                7-Day Hassle-Free Returns
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Doorstep exchange & easy refunds
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-full text-sand">
              <Shield className="w-6 h-6 text-sand" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
                Handcrafted Tailoring
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Superior rise, drape, and flex waistband
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 rounded-full text-sand">
              <CheckCircle2 className="w-6 h-6 text-olive-light" />
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider">
                100% Secure Checkout
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                UPI, Cards, NetBanking, and COD
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-editorial text-2xl font-bold tracking-widest text-white block">
                MENZPLAZA
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-sand font-semibold block">
                The Right Fit. Every Time.
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              India&apos;s dedicated menswear pant atelier. Precision engineered trousers, tailored chinos, selvedge denim, and relaxed linen trousers designed for supreme comfort and enduring confidence.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sand" />
                <span>Indiranagar 100ft Road, Bengaluru, Karnataka 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sand" />
                <span>+91 80 4920 1800 (Mon - Sat, 10 AM - 7 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sand" />
                <span>concierge@menzplaza.com</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/products?category=formal-pants" className="hover:text-white transition-colors">
                  Formal Pants
                </Link>
              </li>
              <li>
                <Link href="/products?category=chinos" className="hover:text-white transition-colors">
                  Stretch Chinos
                </Link>
              </li>
              <li>
                <Link href="/products?category=cargo-pants" className="hover:text-white transition-colors">
                  Heavyweight Cargo
                </Link>
              </li>
              <li>
                <Link href="/products?category=jeans" className="hover:text-white transition-colors">
                  Selvedge Denim
                </Link>
              </li>
              <li>
                <Link href="/products?category=linen-pants" className="hover:text-white transition-colors">
                  Pure European Linen
                </Link>
              </li>
              <li>
                <Link href="/products?category=joggers" className="hover:text-white transition-colors">
                  Commuter Joggers
                </Link>
              </li>
            </ul>
          </div>

          {/* Fitting & Concierge */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Fit & Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link href="/fit-finder" className="hover:text-white text-olive-light font-medium transition-colors">
                  Menz Fit Finder
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Interactive Size Chart
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Manage Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              The Gentleman&apos;s Gazette
            </h4>
            <p className="text-xs text-neutral-400 mb-3">
              Subscribe for sartorial styling guides, new pant releases, and private seasonal promotions.
            </p>
            {subscribed ? (
              <div className="p-3 bg-white/10 rounded border border-sand/30 text-xs text-sand">
                ✓ Welcome to MENZPLAZA. Check your inbox for your 10% welcome privilege code.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2.5 bg-white/10 border border-white/20 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-sand"
                />
                <button
                  type="submit"
                  className="w-full bg-sand text-obsidian text-xs font-bold py-2.5 rounded uppercase tracking-wider hover:bg-sand-light transition-colors"
                >
                  Join Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} MENZPLAZA Menswear Pvt Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/policies/privacy" className="hover:text-sand">Privacy Policy</Link>
            <Link href="/policies/terms" className="hover:text-sand">Terms of Service</Link>
            <Link href="/policies/shipping" className="hover:text-sand">Shipping Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

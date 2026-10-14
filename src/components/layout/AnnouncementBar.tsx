"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const messages = [
  "Complimentary Express Shipping on Orders Over ₹1,499",
  "Handcrafted Indian Fit Guarantee | Hassle-free 7-Day Returns",
  "Use Code 'WELCOME10' for 10% Off on Your First Order",
];

export default function AnnouncementBar() {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-obsidian text-ivory text-xs font-medium py-2 px-4 transition-colors duration-500 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-sand text-[11px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-sand" />
          <span>Tailored Exclusively for Men&apos;s Pants</span>
        </div>

        <div className="flex-1 text-center truncate px-2 text-xs md:text-[13px] tracking-wide font-normal">
          <span className="inline-block transition-opacity duration-300">
            {messages[currentIdx]}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[11px] text-sand/80">
          <Link
            href="/fit-finder"
            className="hover:text-ivory transition-colors flex items-center gap-1 font-medium"
          >
            <span>Menz Fit Finder</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <span className="text-white/20">|</span>
          <Link href="/track-order" className="hover:text-ivory transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

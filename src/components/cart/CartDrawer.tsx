"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Tag, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    shippingFee,
    freeShippingThreshold,
    progressToFreeShipping,
    coupon,
    discountAmount,
    tax,
    total,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponCodeInput.trim());
    setIsApplyingCoupon(false);
    if (res.success) {
      setCouponMessage({ text: res.message, error: false });
      setCouponCodeInput("");
    } else {
      setCouponMessage({ text: res.message, error: true });
    }
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discountAmount));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-sand/40">
          {/* Header */}
          <div className="p-5 border-b border-sand/40 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-obsidian" />
              <h2 className="font-editorial text-xl font-bold tracking-tight text-obsidian">
                Your Shopping Bag ({items.length})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-500 hover:text-obsidian hover:bg-neutral-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-sand/15 p-4 border-b border-sand/30">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              {amountNeededForFreeShipping > 0 ? (
                <span>
                  Add <strong className="text-terracotta">{formatINR(amountNeededForFreeShipping)}</strong> more for free express shipping
                </span>
              ) : (
                <span className="text-olive flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You unlocked Complimentary Express Shipping!
                </span>
              )}
              <span className="text-neutral-500">{progressToFreeShipping}%</span>
            </div>
            <div className="w-full bg-sand/30 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-olive h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-sand/20 flex items-center justify-center text-sand-dark mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-lg font-semibold text-obsidian">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mb-6">
                  Discover impeccably tailored trousers, chinos, and cargos designed for the modern gentleman.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 bg-obsidian text-ivory px-6 py-2.5 rounded text-xs font-medium tracking-wide hover:bg-obsidian-50 transition-colors"
                >
                  Explore Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-sand/40 shadow-subtle relative group"
                >
                  <div className="w-20 h-24 relative rounded bg-neutral-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-medium text-xs text-obsidian hover:underline line-clamp-1 pr-2"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-neutral-400 hover:text-terracotta p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-500 mt-0.5 space-x-2">
                        <span>Color: {item.colorName}</span>
                        <span>•</span>
                        <span>
                          Size: {item.waistSize}W x {item.inseamLength}L
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-sand/60 rounded bg-ivory">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1 text-neutral-600 hover:text-obsidian transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-obsidian min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={item.quantity >= item.stockQuantity}
                          className="p-1 text-neutral-600 hover:text-obsidian disabled:opacity-30 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-obsidian">
                          {formatINR(item.price * item.quantity)}
                        </div>
                        {item.regularPrice > item.price && (
                          <div className="text-[10px] text-neutral-400 line-through">
                            {formatINR(item.regularPrice * item.quantity)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-sand/40 space-y-4">
              {/* Coupon Form */}
              <div>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-olive/10 border border-olive/30 rounded text-xs text-olive-dark">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-olive" />
                      <span>Code <strong>{coupon.code}</strong> applied</span>
                      <span className="text-terracotta font-semibold">(-{formatINR(discountAmount)})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] underline text-neutral-500 hover:text-terracotta"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. WELCOME10)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="w-full text-xs px-3 py-2 border border-sand/60 rounded bg-ivory text-obsidian placeholder-neutral-400 focus:outline-none focus:border-obsidian uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCodeInput.trim()}
                      className="px-3 py-2 bg-neutral-900 text-ivory text-xs font-medium rounded hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                      {isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </form>
                )}

                {couponMessage && (
                  <div
                    className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                      couponMessage.error ? "text-terracotta" : "text-olive-dark"
                    }`}
                  >
                    {couponMessage.error ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    <span>{couponMessage.text}</span>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-sand/30 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-obsidian font-medium">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-terracotta font-medium">
                    <span>Discount</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-olive">FREE</strong> : formatINR(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-obsidian border-t border-sand/40 pt-2">
                  <span>Estimated Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-obsidian text-ivory py-3.5 rounded font-medium text-xs tracking-wider uppercase hover:bg-neutral-800 transition-colors shadow-elevated"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

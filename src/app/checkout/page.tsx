"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  AlertCircle,
  Tag,
  ChevronLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, discountAmount, shippingFee, tax, total, coupon, applyCoupon, removeCoupon, clearCart } =
    useCart();
  const { user } = useAuth();

  // Address form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      if (user.addresses && user.addresses.length > 0) {
        const addr = user.addresses[0];
        setFullName(addr.fullName || user.name);
        setPhone(addr.phone || user.phone || "");
        setAddressLine1(addr.addressLine1);
        setAddressLine2(addr.addressLine2 || "");
        setLandmark(addr.landmark || "");
        setCity(addr.city);
        setState(addr.state);
        setPostalCode(addr.postalCode);
      }
    }
  }, [user]);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    setCouponMsg(null);
    const res = await applyCoupon(couponCodeInput.trim());
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCodeInput("");
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const payload = {
        items: items.map((i) => ({
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        shippingAddress: {
          fullName,
          phone,
          addressLine1,
          addressLine2,
          landmark,
          city,
          state,
          postalCode,
        },
        paymentMethod,
        couponCode: coupon?.code || null,
        guestEmail: !user ? email : null,
      };

      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setOrderError(data.error || "Failed to place order. Please review your details.");
        setIsSubmitting(false);
        return;
      }

      // Order created successfully! Clear cart & redirect
      clearCart();
      router.push(`/checkout/success?orderNumber=${data.order.orderNumber}`);
    } catch (err: any) {
      setOrderError("A network error occurred while processing your order.");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-sand/20 flex items-center justify-center mx-auto mb-4 text-obsidian">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-obsidian mb-2">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Add some handcrafted trousers before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider px-6 py-3 rounded hover:bg-neutral-800 transition-colors"
        >
          <span>Explore Pants</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Header */}
      <div className="flex items-center justify-between pb-6 border-b border-sand/40 mb-8">
        <div>
          <Link
            href="/products"
            className="text-xs text-neutral-500 hover:text-obsidian flex items-center gap-1 mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Collection</span>
          </Link>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-obsidian tracking-tight">
            Checkout &amp; Shipping
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-olive font-semibold bg-olive/10 px-3 py-1.5 rounded-full border border-olive/20">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Form: Contact, Shipping, Payment (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-xl border border-sand/40 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-editorial text-lg font-bold text-obsidian">
                  1. Contact Information
                </h2>
                {!user && (
                  <span className="text-xs text-neutral-500">
                    Have an account?{" "}
                    <Link href="/auth/login" className="text-obsidian font-bold underline">
                      Sign in
                    </Link>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Email Address (for order updates) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul.sharma@example.com"
                    className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Mobile Number (for delivery SMS) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9812345678"
                    className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-6 rounded-xl border border-sand/40 shadow-subtle space-y-4">
              <h2 className="font-editorial text-lg font-bold text-obsidian">
                2. Shipping Address (India)
              </h2>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Address Line 1 (Flat, House No., Building) *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="e.g. Tower B, Flat 402, Green Glen Layout"
                    className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-obsidian mb-1">
                      Address Line 2 (Street, Area)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="e.g. Outer Ring Road, Bellandur"
                      className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-obsidian mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near EcoSpace Tech Park"
                      className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-obsidian mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-obsidian mb-1">
                      State *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                    >
                      {[
                        "Delhi",
                        "Karnataka",
                        "Maharashtra",
                        "Tamil Nadu",
                        "Telangana",
                        "Uttar Pradesh",
                        "Haryana",
                        "Gujarat",
                        "West Bengal",
                        "Rajasthan",
                        "Punjab",
                        "Kerala",
                        "Madhya Pradesh",
                        "Chandigarh",
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-obsidian mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="560103"
                      className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-xl border border-sand/40 shadow-subtle space-y-4">
              <h2 className="font-editorial text-lg font-bold text-obsidian">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "COD"
                      ? "border-obsidian bg-sand/15 shadow-sm"
                      : "border-sand/40 hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="accent-obsidian mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-obsidian flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-olive" />
                        <span>Cash On Delivery (COD)</span>
                      </span>
                      <span className="text-[10px] bg-olive/15 text-olive font-semibold px-2 py-0.5 rounded">
                        Available
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Pay via Cash or UPI QR Code directly to the courier agent upon doorstep delivery.
                    </p>
                  </div>
                </label>

                {/* Razorpay Online */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === "RAZORPAY"
                      ? "border-obsidian bg-sand/15 shadow-sm"
                      : "border-sand/40 hover:bg-neutral-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={() => setPaymentMethod("RAZORPAY")}
                    className="accent-obsidian mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-obsidian flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-olive" />
                        <span>Online Payment (UPI, Credit/Debit Card, NetBanking)</span>
                      </span>
                      <span className="text-[10px] bg-sand text-obsidian font-semibold px-2 py-0.5 rounded">
                        Fast &amp; Secure
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Supports GPay, PhonePe, Paytm, all major bank cards, and EMI. (Sandbox integration verified)
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {orderError && (
              <div className="p-4 bg-terracotta/10 border border-terracotta/30 rounded-xl text-xs text-terracotta flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Place Order Button (Mobile / Desktop) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-elevated flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-sand" />
                  <span>Place Order • {formatINR(total)}</span>
                </>
              )}
            </button>
          </div>

          {/* Right Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-sand/40 shadow-subtle space-y-4">
              <h2 className="font-editorial text-lg font-bold text-obsidian">
                Order Summary ({items.length} item{items.length > 1 ? "s" : ""})
              </h2>

              {/* Items in summary */}
              <div className="divide-y divide-sand/20 max-h-72 overflow-y-auto pr-2 space-y-3">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 pt-3 first:pt-0">
                    <div className="w-14 h-16 relative rounded bg-neutral-100 overflow-hidden flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-semibold text-obsidian truncate">{item.name}</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.colorName} • {item.waistSize}W × {item.inseamLength}L
                      </p>
                      <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right text-xs font-bold text-obsidian">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-3 border-t border-sand/30">
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-olive/10 border border-olive/30 rounded text-xs text-olive-dark">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag className="w-3.5 h-3.5 text-olive" />
                      <span>Coupon &quot;{coupon.code}&quot; active</span>
                      <span className="text-terracotta font-semibold">(-{formatINR(discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] underline text-neutral-500 hover:text-terracotta"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Coupon (e.g. WELCOME10)"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 text-xs px-3 py-2 bg-ivory border border-sand/60 rounded text-obsidian uppercase focus:outline-none focus:border-obsidian"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-2 bg-neutral-900 text-ivory text-xs font-medium rounded hover:bg-neutral-800"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMsg && (
                      <div
                        className={`text-[11px] ${
                          couponMsg.error ? "text-terracotta" : "text-olive-dark"
                        }`}
                      >
                        {couponMsg.text}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price Calculations */}
              <div className="border-t border-sand/30 pt-4 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-obsidian">{formatINR(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-terracotta font-semibold">
                    <span>Discount Applied</span>
                    <span>-{formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-olive">FREE EXPRESS</strong>
                    ) : (
                      formatINR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% Apparel Standard)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-obsidian border-t border-sand/40 pt-3">
                  <span>Grand Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="bg-sand/15 p-4 rounded-xl border border-sand/40 text-xs space-y-2 text-neutral-600">
              <div className="flex items-center gap-2 font-semibold text-obsidian">
                <ShieldCheck className="w-4 h-4 text-olive" />
                <span>The MENZPLAZA Indian Fit Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                If the waist or length does not sit with tailored precision, we will arrange a complimentary size exchange right at your doorstep.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

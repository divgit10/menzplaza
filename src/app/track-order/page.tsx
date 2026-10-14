"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, MapPin, Clock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [verificationInput, setVerificationInput] = useState("");
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !verificationInput) return;

    setIsLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders/${orderNumber.trim()}?verify=${encodeURIComponent(verificationInput.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found or verification failed.");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Failed to query order tracking status. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-olive uppercase">
          Live Dispatch Tracking
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
          Track Your MENZPLAZA Order
        </h1>
        <p className="text-xs text-neutral-500">
          Enter your order number and registered email or phone to check live status and courier tracking.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sand/60 shadow-elevated">
        <form onSubmit={handleTrack} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-obsidian mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. MZ-2025-89104"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-obsidian mb-1">
                Email or 10-Digit Mobile Phone *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. rahul.sharma@example.com"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-obsidian text-ivory py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-elevated flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Querying Courier Network...</span>
            ) : (
              <>
                <Search className="w-4 h-4 text-sand" />
                <span>Track Order Status</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3.5 bg-terracotta/10 border border-terracotta/30 rounded-lg text-xs text-terracotta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Display */}
      {order && (
        <div className="bg-white rounded-2xl border border-sand/60 shadow-elevated p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-sand/30 gap-2">
            <div>
              <span className="text-[11px] text-neutral-400 block font-mono">
                Order {order.orderNumber}
              </span>
              <h2 className="font-editorial text-xl font-bold text-obsidian">
                Status: <span className="text-olive">{order.status}</span>
              </h2>
            </div>
            <span className="px-3 py-1 bg-olive/15 text-olive font-bold text-xs rounded-full">
              Payment: {order.paymentStatus}
            </span>
          </div>

          {/* Tracking Details */}
          <div className="p-4 bg-sand/15 rounded-xl border border-sand/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 text-[11px] block">Courier Tracking Number</span>
              <span className="font-mono font-bold text-obsidian text-sm">
                {order.trackingNumber || "Assigned upon dispatch"}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 text-[11px] block">Estimated Doorstep Arrival</span>
              <span className="font-bold text-olive text-sm flex items-center gap-1">
                <Truck className="w-4 h-4" /> {order.estimatedDelivery || "3 - 4 business days"}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-obsidian uppercase tracking-wider">
              Enclosed Trousers ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-sand/20 border border-sand/40 rounded-lg bg-ivory text-xs">
              {order.items?.map((item: any) => (
                <div key={item.id} className="p-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-obsidian">{item.productName}</h4>
                    <p className="text-neutral-500 text-[11px]">
                      Color: {item.colorName} • Size: {item.waistSize}W × {item.inseamLength}L • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="font-bold text-obsidian">{formatINR(item.totalPrice)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className="text-xs text-neutral-600 border-t border-sand/30 pt-4 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-olive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-obsidian">Delivering to {order.shippingAddress?.fullName}</p>
              <p>
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city},{" "}
                {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

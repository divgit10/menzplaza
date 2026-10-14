"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

function OrderSuccessView() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      setIsLoading(false);
      return;
    }

    fetch(`/api/orders/${orderNumber}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.order) setOrder(data.order);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian" />
        <p className="mt-4 text-xs text-neutral-500">Retrieving order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center px-4">
        <h2 className="font-editorial text-2xl font-bold text-obsidian mb-2">Order Confirmed</h2>
        <p className="text-xs text-neutral-600 mb-6">
          Your order has been recorded. Check your registered email for confirmation and dispatch updates.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider px-6 py-3 rounded"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-2xl border border-sand/60 shadow-elevated p-6 sm:p-10 space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-3 pb-6 border-b border-sand/30">
          <div className="w-16 h-16 bg-olive/15 rounded-full flex items-center justify-center mx-auto text-olive">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-olive">
            Order Confirmed &amp; In Production
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
            Thank You For Your Order
          </h1>
          <p className="text-xs text-neutral-600 max-w-md mx-auto">
            Order <strong className="text-obsidian font-mono">{order.orderNumber}</strong> has been received and our master craftsmen are preparing your trousers.
          </p>
        </div>

        {/* Tracking & Timeline Card */}
        <div className="bg-sand/15 p-5 rounded-xl border border-sand/40 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
            <div>
              <span className="text-neutral-500 block text-[11px]">Tracking Number</span>
              <span className="font-mono font-bold text-obsidian text-sm">
                {order.trackingNumber || "Assigned upon dispatch"}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[11px]">Estimated Doorstep Arrival</span>
              <span className="font-bold text-olive text-sm flex items-center gap-1">
                <Truck className="w-4 h-4" /> {order.estimatedDelivery || "3 - 4 business days"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-sand/30 text-xs text-neutral-600">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span>Updates and tracking links have been sent to <strong>{order.guestEmail || "your registered email"}</strong>.</span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <h3 className="font-editorial text-lg font-bold text-obsidian">
            Items in this Dispatch ({order.items?.length || 0})
          </h3>
          <div className="divide-y divide-sand/20 border border-sand/40 rounded-xl overflow-hidden bg-ivory">
            {order.items?.map((item: any) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-obsidian">{item.productName}</h4>
                  <p className="text-neutral-500 text-[11px] mt-0.5">
                    Color: {item.colorName} • Size: {item.waistSize}W × {item.inseamLength}L • Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right font-bold text-obsidian">
                  {formatINR(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-sand/30 text-xs">
          <div>
            <h4 className="font-bold text-obsidian mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-olive" />
              <span>Delivering To</span>
            </h4>
            <div className="text-neutral-600 space-y-0.5 pl-5">
              <p className="font-bold text-obsidian">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
              </p>
              <p className="pt-1 text-neutral-500">Phone: {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-obsidian mb-2">Order &amp; Payment Details</h4>
            <div className="space-y-1.5 text-neutral-600">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold text-obsidian">
                  {order.paymentMethod === "COD" ? "Cash On Delivery" : "Online Payment (Verified)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className="font-bold text-olive uppercase tracking-wider text-[11px]">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between border-t border-sand/30 pt-1.5 text-sm font-bold text-obsidian">
                <span>Amount Paid/Due:</span>
                <span>{formatINR(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-sand/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto px-6 py-3 border border-sand text-neutral-700 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-50 text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/account/orders"
            className="w-full sm:w-auto px-6 py-3 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 text-center shadow-elevated"
          >
            View Order In Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian" />
        </div>
      }
    >
      <OrderSuccessView />
    </Suspense>
  );
}

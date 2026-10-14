"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Truck,
  RotateCcw,
  XCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function CustomerOrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Return modal state
  const [activeReturnOrder, setActiveReturnOrder] = useState<any | null>(null);
  const [returnType, setReturnType] = useState<"RETURN" | "EXCHANGE">("EXCHANGE");
  const [returnReason, setReturnReason] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchOrders = () => {
    setIsLoading(true);
    fetch("/api/orders/my-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchOrders();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading]);

  const handleCancelOrder = async (orderNumber: string) => {
    if (!confirm(`Are you sure you wish to cancel order ${orderNumber}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderNumber}/cancel`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(`Order ${orderNumber} has been successfully cancelled.`);
        fetchOrders();
      } else {
        alert(data.error || "Failed to cancel order");
      }
    } catch {
      alert("Error cancelling order");
    }
  };

  const handleSubmitReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReturnOrder || !returnReason.trim()) return;
    setIsSubmittingReturn(true);

    try {
      const res = await fetch(`/api/orders/${activeReturnOrder.orderNumber}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: returnType,
          reason: returnReason,
          notes: returnNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionSuccessMsg(
          `Your ${returnType.toLowerCase()} request for order ${activeReturnOrder.orderNumber} has been received. Our team will contact you for reverse pickup.`
        );
        setActiveReturnOrder(null);
        setReturnReason("");
        setReturnNotes("");
        fetchOrders();
      } else {
        alert(data.error || "Failed to submit request");
      }
    } catch {
      alert("Network error submitting return request");
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian" />
        <p className="mt-4 text-xs text-neutral-500">Loading your order history...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-sand/20 flex items-center justify-center mx-auto mb-4 text-obsidian">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-obsidian mb-2">
          Sign In to View Orders
        </h2>
        <p className="text-xs text-neutral-500 mb-6">
          Please log into your account or use the guest tracking tool with your order number.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/auth/login"
            className="px-6 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded"
          >
            Sign In
          </Link>
          <Link
            href="/track-order"
            className="px-6 py-2.5 border border-sand text-neutral-700 text-xs font-semibold rounded"
          >
            Track Guest Order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-sand/40 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
            Customer Dashboard
          </span>
          <h1 className="font-editorial text-3xl font-extrabold text-obsidian tracking-tight">
            Order History &amp; Tracking
          </h1>
        </div>
        <div className="text-xs text-neutral-600">
          Signed in as: <strong className="text-obsidian">{user.name}</strong> ({user.email})
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-olive/10 border border-olive/30 rounded-xl text-xs text-olive-dark flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-sand/60 p-12 text-center max-w-md mx-auto">
          <Package className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="font-editorial text-xl font-bold text-obsidian mb-1">No Orders Yet</h3>
          <p className="text-xs text-neutral-500 mb-6">
            You haven&apos;t placed any pant orders under this account.
          </p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded"
          >
            Explore Pants Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";
            const canReturn = order.status === "DELIVERED" || order.status === "CONFIRMED";

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-sand/40 shadow-subtle overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-sand/15 p-4 sm:p-5 border-b border-sand/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 text-[11px] block">Order Number</span>
                    <span className="font-mono font-bold text-obsidian text-sm">
                      {order.orderNumber}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-neutral-500 text-[11px] block">Order Placed</span>
                    <span className="font-medium text-obsidian">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-neutral-500 text-[11px] block">Status</span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                        order.status === "CONFIRMED" || order.status === "DELIVERED"
                          ? "bg-olive/15 text-olive"
                          : order.status === "CANCELLED"
                          ? "bg-terracotta/15 text-terracotta"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-0.5 text-right">
                    <span className="text-neutral-500 text-[11px] block">Total Amount</span>
                    <span className="font-bold text-obsidian text-sm">
                      {formatINR(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-5 divide-y divide-sand/20">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                    >
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

                {/* Delivery & Actions Footer */}
                <div className="p-4 sm:p-5 bg-ivory border-t border-sand/30 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3 text-neutral-600">
                    <Truck className="w-4 h-4 text-olive" />
                    <span>
                      Tracking: <strong className="font-mono text-obsidian">{order.trackingNumber || "Assigned upon dispatch"}</strong>
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span>
                      Est. Arrival: <strong className="text-obsidian">{order.estimatedDelivery || "3-4 days"}</strong>
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order.orderNumber)}
                        className="px-3 py-1.5 border border-terracotta/50 text-terracotta rounded text-xs font-semibold hover:bg-terracotta/10 transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    {canReturn && (
                      <button
                        onClick={() => setActiveReturnOrder(order)}
                        className="px-3 py-1.5 border border-sand text-neutral-700 rounded text-xs font-semibold hover:bg-white transition-colors flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Return / Exchange</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Return / Exchange Modal */}
      {activeReturnOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm"
              onClick={() => setActiveReturnOrder(null)}
            />
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-sand p-6 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-obsidian">
                Request Return or Size Exchange
              </h3>
              <p className="text-xs text-neutral-500">
                Order <strong className="font-mono">{activeReturnOrder.orderNumber}</strong>. Our courier will inspect and collect the item with original tags attached.
              </p>

              <form onSubmit={handleSubmitReturn} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Request Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setReturnType("EXCHANGE")}
                      className={`p-2 border rounded font-semibold transition-colors ${
                        returnType === "EXCHANGE"
                          ? "bg-obsidian text-ivory border-obsidian"
                          : "bg-ivory text-neutral-700 border-sand/60"
                      }`}
                    >
                      Size Exchange
                    </button>
                    <button
                      type="button"
                      onClick={() => setReturnType("RETURN")}
                      className={`p-2 border rounded font-semibold transition-colors ${
                        returnType === "RETURN"
                          ? "bg-obsidian text-ivory border-obsidian"
                          : "bg-ivory text-neutral-700 border-sand/60"
                      }`}
                    >
                      Return &amp; Refund
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Primary Reason *
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    required
                    className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                  >
                    <option value="">Select reason...</option>
                    <option value="Waist too tight">Waist too tight</option>
                    <option value="Waist too loose">Waist too loose</option>
                    <option value="Inseam length too long">Inseam length too long</option>
                    <option value="Inseam length too short">Inseam length too short</option>
                    <option value="Fabric / Color aesthetic different than expected">
                      Fabric / Color aesthetic different than expected
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-obsidian mb-1">
                    Additional Notes (Desired replacement size, etc.)
                  </label>
                  <textarea
                    rows={3}
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. Please swap waist 32W for 34W in Obsidian Black..."
                    className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveReturnOrder(null)}
                    className="px-4 py-2 border border-sand rounded text-neutral-600 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReturn || !returnReason}
                    className="px-4 py-2 bg-obsidian text-ivory rounded font-semibold disabled:opacity-50"
                  >
                    {isSubmittingReturn ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

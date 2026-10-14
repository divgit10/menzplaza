"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  Tag,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Truck,
  ExternalLink,
  Layers,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "coupons" | "returns" | "settings"
  >("overview");

  // Admin Data states
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [returns, setReturns] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // New Product Modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    slug: "",
    categoryId: "",
    description: "",
    fabricCare: "Machine wash cold. Warm iron.",
    materialComposition: "98% Combed Cotton, 2% Spandex",
    regularPrice: "2499",
    salePrice: "1999",
    fitType: "slim",
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    colorName: "Obsidian Black",
    colorHex: "#171717",
  });

  // Edit Product Modal state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // New Coupon Modal state
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "15",
    minOrderValue: "1499",
    maxDiscount: "600",
    usageLimit: "100",
  });

  // Load all admin data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, ordersRes, productsRes, couponsRes, returnsRes, settingsRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/products"),
          fetch("/api/admin/coupons"),
          fetch("/api/admin/returns"),
          fetch("/api/admin/settings"),
        ]);

      if (statsRes.status === 403 || ordersRes.status === 403) {
        setIsLoading(false);
        return;
      }

      const [statsData, ordersData, productsData, couponsData, returnsData, settingsData] =
        await Promise.all([
          statsRes.json(),
          ordersRes.json(),
          productsRes.json(),
          couponsRes.json(),
          returnsRes.json(),
          settingsRes.json(),
        ]);

      setStats(statsData.stats);
      setOrders(ordersData.orders || []);
      setProducts(productsData.products || []);
      setCoupons(couponsData.coupons || []);
      setReturns(returnsData.returns || []);
      setStoreSettings(settingsData.setting || {});
    } catch (e) {
      console.error("Error loading admin data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user && user.role === "ADMIN") {
        loadAdminData();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading]);

  // Order update handlers
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: string,
    trackingNumber?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, trackingNumber }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  // Product creation handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        setIsAddProductOpen(false);
        loadAdminData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create product");
      }
    } catch {
      alert("Error creating product");
    }
  };

  // Product edit handler
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setEditingProduct(null);
        loadAdminData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to update product");
      }
    } catch {
      alert("Error updating product");
    }
  };

  // Product deactivate handler
  const handleDeactivateProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to deactivate this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (res.ok) {
        loadAdminData();
      }
    } catch {
      alert("Error deleting product");
    }
  };

  // Coupon create handler
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCoupon),
      });
      if (res.ok) {
        setIsAddCouponOpen(false);
        loadAdminData();
      } else {
        const d = await res.json();
        alert(d.error || "Failed to create coupon");
      }
    } catch {
      alert("Error creating coupon");
    }
  };

  // Return status update handler
  const handleUpdateReturnStatus = async (returnId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/returns/${returnId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch {
      alert("Error updating return status");
    }
  };

  // Store setting update handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(storeSettings),
      });
      if (res.ok) {
        alert("Store settings saved successfully!");
        loadAdminData();
      }
    } catch {
      alert("Error saving settings");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian" />
        <p className="mt-4 text-xs text-neutral-500 font-medium">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4 text-terracotta">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-2xl font-bold text-obsidian mb-2">
          Administrator Access Required
        </h2>
        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          This portal is restricted to authorized MENZPLAZA administrators. Please sign in with an administrator account.
        </p>
        <Link
          href="/auth/login"
          className="px-6 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded inline-block"
        >
          Sign In As Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-sand/40 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-obsidian text-sand-light text-[10px] font-mono rounded">
              ADMIN CONSOLE
            </span>
            <span className="text-xs text-neutral-500">• {user.name}</span>
          </div>
          <h1 className="font-editorial text-3xl font-extrabold text-obsidian tracking-tight mt-1">
            MENZPLAZA Operations Control
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAdminData}
            className="p-2 border border-sand/60 rounded-lg text-neutral-600 hover:text-obsidian hover:bg-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/products"
            className="px-4 py-2 bg-sand text-obsidian text-xs font-bold uppercase tracking-wider rounded hover:bg-sand-light transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Store Front</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-sand/30 text-xs font-medium">
        {[
          { id: "overview", label: "Executive Overview", icon: TrendingUp },
          { id: "orders", label: `Orders (${orders.length})`, icon: Package },
          { id: "products", label: `Catalog (${products.length})`, icon: Layers },
          { id: "coupons", label: `Promotions (${coupons.length})`, icon: Tag },
          { id: "returns", label: `Exchanges (${returns.length})`, icon: RotateCcw },
          { id: "settings", label: "Policies & Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-obsidian text-ivory font-bold shadow-sm"
                  : "bg-white text-neutral-600 hover:text-obsidian border border-sand/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && stats && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-xl border border-sand/40 shadow-subtle">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Total Realized Revenue
              </span>
              <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-obsidian mt-1 block">
                {formatINR(stats.totalRevenue || 0)}
              </span>
              <span className="text-[10px] text-olive font-medium mt-1 block">
                From settled orders &amp; COD dispatches
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-sand/40 shadow-subtle">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Total Orders Placed
              </span>
              <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-obsidian mt-1 block">
                {stats.totalOrders}
              </span>
              <span className="text-[10px] text-neutral-500 mt-1 block">
                Pan-India across 19,000+ PIN codes
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-sand/40 shadow-subtle">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Active Pant Styles
              </span>
              <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-obsidian mt-1 block">
                {stats.totalProducts}
              </span>
              <span className="text-[10px] text-olive font-medium mt-1 block">
                Live in public archive
              </span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-sand/40 shadow-subtle">
              <span className="text-[11px] text-neutral-500 uppercase tracking-wider font-semibold block">
                Low Stock Variants (&le; 5)
              </span>
              <span className="font-editorial text-2xl sm:text-3xl font-extrabold text-terracotta mt-1 block">
                {stats.lowStockVariants}
              </span>
              <span className="text-[10px] text-terracotta font-medium mt-1 block">
                Immediate loom restock recommended
              </span>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-xl border border-sand/40 shadow-subtle p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-editorial text-lg font-bold text-obsidian">
                Recent Customer Orders
              </h2>
              <button
                onClick={() => setActiveTab("orders")}
                className="text-xs text-olive font-semibold hover:underline"
              >
                View All Orders &rarr;
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/15 text-obsidian font-semibold border-b border-sand/30">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/20 text-neutral-700">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-sand/10 transition-colors">
                      <td className="p-3 font-mono font-bold text-obsidian">{o.orderNumber}</td>
                      <td className="p-3">{o.shippingAddress?.fullName || o.guestName || "Guest"}</td>
                      <td className="p-3">{o.items?.length || 0} pairs</td>
                      <td className="p-3 font-bold text-obsidian">{formatINR(o.totalAmount)}</td>
                      <td className="p-3">
                        <span className="uppercase text-[10px] font-bold text-neutral-600">
                          {o.paymentMethod} ({o.paymentStatus})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-olive/15 text-olive">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS MANAGEMENT TAB */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-xl border border-sand/40 shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-xl font-bold text-obsidian">
              Order Fulfillment &amp; Status Processing
            </h2>
            <span className="text-xs text-neutral-500">{orders.length} total orders</span>
          </div>

          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-5 border border-sand/40 rounded-xl bg-ivory space-y-4 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand/30 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-obsidian">
                      {o.orderNumber}
                    </span>
                    <span className="text-neutral-400">•</span>
                    <span className="text-neutral-500">
                      {new Date(o.createdAt).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">Status:</span>
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className="bg-white border border-sand font-bold text-obsidian px-2.5 py-1 rounded focus:outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Items */}
                  <div className="space-y-1">
                    <span className="font-bold text-obsidian block mb-1">Enclosed Trousers:</span>
                    {o.items?.map((item: any) => (
                      <div key={item.id} className="text-[11px] text-neutral-600">
                        • {item.productName} ({item.colorName}, {item.waistSize}W × {item.inseamLength}L) × {item.quantity} = {formatINR(item.totalPrice)}
                      </div>
                    ))}
                  </div>

                  {/* Customer & Address */}
                  <div className="text-[11px] text-neutral-600">
                    <span className="font-bold text-obsidian block mb-1">Shipping Details:</span>
                    <p className="font-semibold">{o.shippingAddress?.fullName}</p>
                    <p>{o.shippingAddress?.addressLine1}</p>
                    <p>
                      {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.postalCode}
                    </p>
                    <p>Phone: {o.shippingAddress?.phone}</p>
                    <p>Email: {o.guestEmail || o.user?.email}</p>
                  </div>

                  {/* Tracking & Amount */}
                  <div className="space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-obsidian block">
                        Tracking Number:
                      </span>
                      <input
                        type="text"
                        defaultValue={o.trackingNumber || ""}
                        onBlur={(e) => {
                          if (e.target.value !== o.trackingNumber) {
                            handleUpdateOrderStatus(o.id, o.status, e.target.value);
                          }
                        }}
                        placeholder="Assign tracking ID"
                        className="w-full text-xs p-1.5 bg-white border border-sand rounded font-mono mt-0.5"
                      />
                    </div>
                    <div className="pt-1 flex justify-between items-baseline">
                      <span className="text-neutral-500">Total:</span>
                      <span className="font-bold text-sm text-obsidian">
                        {formatINR(o.totalAmount)} ({o.paymentMethod})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PRODUCTS & CATALOG TAB */}
      {activeTab === "products" && (
        <div className="bg-white rounded-xl border border-sand/40 shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-xl font-bold text-obsidian">
                Trousers &amp; Catalog Management
              </h2>
              <p className="text-xs text-neutral-500">
                Adjust prices, stock levels, and publish new trouser releases.
              </p>
            </div>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="px-4 py-2 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 shadow-elevated"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Pant</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand/15 text-obsidian font-semibold border-b border-sand/30">
                <tr>
                  <th className="p-3">Pant Style</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Fit Type</th>
                  <th className="p-3">Sale Price</th>
                  <th className="p-3">Regular Price</th>
                  <th className="p-3">Variants</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand/20 text-neutral-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-sand/10 transition-colors">
                    <td className="p-3 font-semibold text-obsidian max-w-xs truncate">
                      {p.name}
                    </td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3 capitalize">{p.fitType}</td>
                    <td className="p-3 font-bold text-obsidian">{formatINR(p.salePrice)}</td>
                    <td className="p-3 text-neutral-400 line-through">
                      {formatINR(p.regularPrice)}
                    </td>
                    <td className="p-3">{p.variants?.length || 0} size combos</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.isActive ? "bg-olive/15 text-olive" : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 hover:text-obsidian text-neutral-500"
                        title="Edit Price & Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeactivateProduct(p.id)}
                        className="p-1.5 hover:text-terracotta text-neutral-500"
                        title="Deactivate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. COUPONS TAB */}
      {activeTab === "coupons" && (
        <div className="bg-white rounded-xl border border-sand/40 shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-xl font-bold text-obsidian">
                Promotional Campaigns &amp; Coupons
              </h2>
              <p className="text-xs text-neutral-500">
                Configure percentage or flat discounts with minimum order thresholds.
              </p>
            </div>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="px-4 py-2 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="p-4 bg-ivory rounded-xl border border-sand/40 shadow-subtle space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-obsidian text-sm bg-sand/30 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                  <span className="text-[10px] text-olive font-bold">
                    {c.isActive ? "ACTIVE" : "DISABLED"}
                  </span>
                </div>
                <p className="text-neutral-600 text-[11px]">{c.description}</p>
                <div className="pt-2 border-t border-sand/30 text-neutral-500 space-y-0.5">
                  <div>
                    Discount:{" "}
                    <strong>
                      {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : formatINR(c.discountValue)}
                    </strong>
                  </div>
                  <div>
                    Min Order: <strong>{formatINR(c.minOrderValue)}</strong>
                  </div>
                  <div>
                    Used Count: <strong>{c.usedCount} times</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RETURNS & EXCHANGES TAB */}
      {activeTab === "returns" && (
        <div className="bg-white rounded-xl border border-sand/40 shadow-subtle p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-editorial text-xl font-bold text-obsidian">
              Return &amp; Size Exchange Concierge
            </h2>
            <span className="text-xs text-neutral-500">{returns.length} requests</span>
          </div>

          <div className="space-y-4 text-xs">
            {returns.length === 0 ? (
              <p className="text-neutral-500">No pending return requests.</p>
            ) : (
              returns.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-ivory border border-sand/40 rounded-xl space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-obsidian uppercase px-2 py-0.5 bg-sand/30 rounded text-[10px]">
                        {r.type}
                      </span>
                      <span className="font-mono font-bold">Order {r.order?.orderNumber}</span>
                      <span className="text-neutral-400">• Customer: {r.user?.name || "Guest"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{r.status}</span>
                      {r.status === "REQUESTED" && (
                        <>
                          <button
                            onClick={() => handleUpdateReturnStatus(r.id, "APPROVED")}
                            className="px-2.5 py-1 bg-olive text-white rounded font-semibold text-[11px]"
                          >
                            Approve Pickup
                          </button>
                          <button
                            onClick={() => handleUpdateReturnStatus(r.id, "REJECTED")}
                            className="px-2.5 py-1 bg-terracotta text-white rounded font-semibold text-[11px]"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-neutral-700">
                    <strong>Reason:</strong> {r.reason}
                  </p>
                  {r.notes && (
                    <p className="text-neutral-500">
                      <strong>Customer Notes:</strong> {r.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === "settings" && storeSettings && (
        <div className="bg-white rounded-xl border border-sand/40 shadow-subtle p-6 max-w-2xl space-y-6">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            Storefront Configuration &amp; Policy Rules
          </h2>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-obsidian mb-1">
                Announcement Bar Banner Text
              </label>
              <input
                type="text"
                value={storeSettings.announcementText || ""}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, announcementText: e.target.value })
                }
                className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-obsidian mb-1">
                  Free Shipping Minimum (₹)
                </label>
                <input
                  type="number"
                  value={storeSettings.freeShippingThreshold || 1499}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      freeShippingThreshold: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                />
              </div>

              <div>
                <label className="block font-semibold text-obsidian mb-1">
                  Standard Shipping Fee (₹)
                </label>
                <input
                  type="number"
                  value={storeSettings.standardShippingFee || 99}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      standardShippingFee: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-obsidian mb-1">
                  GST Tax Rate Percentage (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={storeSettings.taxRatePercentage || 5.0}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      taxRatePercentage: Number(e.target.value),
                    })
                  }
                  className="w-full p-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="cod-toggle"
                  checked={storeSettings.codEnabled ?? true}
                  onChange={(e) =>
                    setStoreSettings({ ...storeSettings, codEnabled: e.target.checked })
                  }
                  className="accent-obsidian w-4 h-4"
                />
                <label htmlFor="cod-toggle" className="font-semibold text-obsidian cursor-pointer">
                  Enable Cash On Delivery (COD)
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-elevated"
            >
              Save Store Policies
            </button>
          </form>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm"
              onClick={() => setIsAddProductOpen(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-sand p-6 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-obsidian">
                Add New Trouser Style
              </h3>
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: e.target.value,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      })
                    }
                    placeholder="The Oxford Bespoke Wool Trouser"
                    className="w-full p-2 bg-ivory border border-sand rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, categoryId: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    >
                      <option value="">Select category...</option>
                      {stats?.categoryDistribution?.map((c: any) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Fit Silhouette</label>
                    <select
                      value={newProduct.fitType}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, fitType: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    >
                      <option value="slim">Slim</option>
                      <option value="tapered">Tapered</option>
                      <option value="regular">Regular</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Sale Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.salePrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, salePrice: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Regular Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={newProduct.regularPrice}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, regularPrice: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    className="w-full p-2 bg-ivory border border-sand rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProduct.imageUrl}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, imageUrl: e.target.value })
                    }
                    className="w-full p-2 bg-ivory border border-sand rounded"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-obsidian text-ivory rounded font-semibold"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm"
              onClick={() => setEditingProduct(null)}
            />
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-sand p-6 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-obsidian">
                Edit Trouser Pricing &amp; Details
              </h3>
              <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    className="w-full p-2 bg-ivory border border-sand rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Sale Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.salePrice}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, salePrice: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Regular Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.regularPrice}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, regularPrice: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFeatured}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })
                      }
                      className="accent-obsidian"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isBestseller}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })
                      }
                      className="accent-obsidian"
                    />
                    <span>Bestseller</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isActive}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, isActive: e.target.checked })
                      }
                      className="accent-obsidian"
                    />
                    <span>Active in Store</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-obsidian text-ivory rounded font-semibold"
                  >
                    Update Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm"
              onClick={() => setIsAddCouponOpen(false)}
            />
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-sand p-6 space-y-4">
              <h3 className="font-editorial text-lg font-bold text-obsidian">
                Create Promotional Coupon
              </h3>
              <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE25"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                    }
                    className="w-full p-2 bg-ivory border border-sand rounded uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <input
                    type="text"
                    placeholder="Flat 15% discount on orders over ₹1,499"
                    value={newCoupon.description}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, description: e.target.value })
                    }
                    className="w-full p-2 bg-ivory border border-sand rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Discount Type</label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discountType: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FLAT">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.discountValue}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, discountValue: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1">Min Order Value (₹)</label>
                    <input
                      type="number"
                      value={newCoupon.minOrderValue}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, minOrderValue: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Max Cap (₹ optional)</label>
                    <input
                      type="number"
                      value={newCoupon.maxDiscount}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, maxDiscount: e.target.value })
                      }
                      className="w-full p-2 bg-ivory border border-sand rounded"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCouponOpen(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-obsidian text-ivory rounded font-semibold"
                  >
                    Activate Coupon
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

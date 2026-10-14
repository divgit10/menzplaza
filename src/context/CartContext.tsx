"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  slug: string;
  colorName: string;
  colorHex: string;
  waistSize: number;
  inseamLength: number;
  price: number;
  regularPrice: number;
  image: string;
  quantity: number;
  stockQuantity: number;
}

export interface AppliedCoupon {
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  description?: string;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  progressToFreeShipping: number;
  tax: number;
  coupon: AppliedCoupon | null;
  discountAmount: number;
  total: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1499;
const STANDARD_SHIPPING_FEE = 99;
const TAX_RATE = 0.05; // 5% GST

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("menz_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem("menz_coupon");
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("menz_cart", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [items, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      if (coupon) {
        localStorage.setItem("menz_coupon", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("menz_coupon");
      }
    } catch (e) {
      console.error("Failed to persist coupon", e);
    }
  }, [coupon, isInitialized]);

  const addItem = (newItem: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.variantId === newItem.variantId);
      if (existing) {
        const newQty = Math.min(existing.quantity + newItem.quantity, newItem.stockQuantity);
        return prev.map((item) =>
          item.variantId === newItem.variantId ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.variantId === variantId) {
          const clamped = Math.min(quantity, item.stockQuantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate discount based on subtotal
  let discountAmount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }
    discountAmount = Math.round(discountAmount * 100) / 100;
  }

  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount);
  const shippingFee =
    subtotal === 0 || subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const tax = Math.round(subtotalAfterDiscount * TAX_RATE * 100) / 100;
  const total = Math.round((subtotalAfterDiscount + shippingFee + tax) * 100) / 100;

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Invalid coupon" };
      }

      setCoupon({
        code: data.coupon.code,
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        description: data.coupon.description,
        discountAmount: data.discountAmount,
      });

      return { success: true, message: data.message };
    } catch {
      return { success: false, message: "Error validating coupon" };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        progressToFreeShipping,
        tax,
        coupon,
        discountAmount,
        total,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

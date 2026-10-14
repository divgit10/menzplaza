import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { z } from "zod";

const orderCreateSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().min(1, "Variant ID is required"),
      quantity: z.number().int().min(1, "Quantity must be at least 1"),
    })
  ).min(1, "Cart cannot be empty"),
  shippingAddress: z.object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z.string().regex(/^[0-9+ -]{10,14}$/, "Valid phone number required"),
    addressLine1: z.string().min(5, "Address line 1 is required"),
    addressLine2: z.string().optional(),
    landmark: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().regex(/^\d{6}$/, "Valid 6-digit PIN code required"),
  }),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  couponCode: z.string().optional().nullable(),
  guestEmail: z.string().email("Valid email required").optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = orderCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentMethod, couponCode, guestEmail } =
      result.data;

    // Check user session
    const session = await getSessionUser();
    const userId = session?.userId || null;
    const customerEmail = session?.email || guestEmail;

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Email address is required for order updates." },
        { status: 400 }
      );
    }

    // Load store settings for shipping threshold and tax
    const storeSetting = await prisma.storeSetting.findUnique({
      where: { id: "GENERAL" },
    });

    const freeShippingThreshold = storeSetting?.freeShippingThreshold ?? 1499;
    const standardShippingFee = storeSetting?.standardShippingFee ?? 99;
    const taxRatePercentage = storeSetting?.taxRatePercentage ?? 5.0;

    // Fetch variants from database to verify prices and stock
    const variantIds = items.map((i) => i.variantId);
    const dbVariants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: {
        product: true,
      },
    });

    if (dbVariants.length !== items.length) {
      return NextResponse.json(
        { error: "One or more selected products are no longer available." },
        { status: 400 }
      );
    }

    // Verify stock and compute subtotal
    let subtotal = 0;
    const validatedItems: Array<{
      variant: (typeof dbVariants)[0];
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of items) {
      const dbVariant = dbVariants.find((v) => v.id === item.variantId)!;

      if (dbVariant.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${dbVariant.product.name}" (${dbVariant.colorName}, Size ${dbVariant.waistSize}x${dbVariant.inseamLength}). Only ${dbVariant.stockQuantity} left.`,
          },
          { status: 400 }
        );
      }

      // Never trust client price; use database salePrice
      const unitPrice = dbVariant.price ?? dbVariant.product.salePrice;
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;

      validatedItems.push({
        variant: dbVariant,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // Apply Coupon server-side
    let discount = 0;
    let appliedCoupon: any = null;

    if (couponCode) {
      appliedCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (appliedCoupon && appliedCoupon.isActive) {
        const notExpired =
          !appliedCoupon.expiresAt || new Date(appliedCoupon.expiresAt) >= new Date();
        const underLimit =
          !appliedCoupon.usageLimit || appliedCoupon.usedCount < appliedCoupon.usageLimit;
        const meetsMin = subtotal >= appliedCoupon.minOrderValue;

        if (notExpired && underLimit && meetsMin) {
          if (appliedCoupon.discountType === "PERCENTAGE") {
            discount = (subtotal * appliedCoupon.discountValue) / 100;
            if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
              discount = appliedCoupon.maxDiscount;
            }
          } else {
            discount = Math.min(appliedCoupon.discountValue, subtotal);
          }
          discount = Math.round(discount * 100) / 100;
        }
      }
    }

    // Calculate shipping
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const shippingFee = subtotalAfterDiscount >= freeShippingThreshold ? 0 : standardShippingFee;

    // Calculate tax (5% GST standard on apparel)
    const tax = Math.round(((subtotalAfterDiscount * taxRatePercentage) / 100) * 100) / 100;
    const totalAmount = Math.round((subtotalAfterDiscount + shippingFee + tax) * 100) / 100;

    // Generate unique order number (e.g. MZ-2025-XXXXX)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `MZ-${new Date().getFullYear()}-${randomSuffix}`;

    // Execute atomic transaction: Create Order, Items, Payment record, and Decrement Stock
    const createdOrder = await prisma.$transaction(async (tx) => {
      // 1. Decrement inventory
      for (const item of validatedItems) {
        await tx.productVariant.update({
          where: { id: item.variant.id },
          data: {
            stockQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Increment coupon usedCount if applied
      if (appliedCoupon && discount > 0) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 3. Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          guestEmail: customerEmail,
          guestName: shippingAddress.fullName,
          guestPhone: shippingAddress.phone,
          status: "CONFIRMED",
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
          paymentMethod,
          subtotal,
          discount,
          shippingFee,
          tax,
          totalAmount,
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          shippingAddressJson: JSON.stringify(shippingAddress),
          trackingNumber: `DELHIVERY-${Math.floor(10000000 + Math.random() * 90000000)}`,
          estimatedDelivery: "3 - 4 business days",
          items: {
            create: validatedItems.map((item) => ({
              variantId: item.variant.id,
              productName: item.variant.product.name,
              colorName: item.variant.colorName,
              waistSize: item.variant.waistSize,
              inseamLength: item.variant.inseamLength,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            })),
          },
          payments: {
            create: [
              {
                amount: totalAmount,
                currency: "INR",
                status: paymentMethod === "COD" ? "PENDING" : "SUCCESS",
                paymentMethod,
                razorpayOrderId:
                  paymentMethod === "RAZORPAY"
                    ? `order_test_${Math.random().toString(36).substring(7)}`
                    : null,
                razorpayPaymentId:
                  paymentMethod === "RAZORPAY"
                    ? `pay_test_${Math.random().toString(36).substring(7)}`
                    : null,
              },
            ],
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      // 4. Save address for user if logged in and has no default
      if (userId) {
        const addressCount = await tx.address.count({ where: { userId } });
        if (addressCount === 0) {
          await tx.address.create({
            data: {
              userId,
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              addressLine1: shippingAddress.addressLine1,
              addressLine2: shippingAddress.addressLine2,
              landmark: shippingAddress.landmark,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postalCode: shippingAddress.postalCode,
              isDefault: true,
            },
          });
        }
      }

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: {
        id: createdOrder.id,
        orderNumber: createdOrder.orderNumber,
        status: createdOrder.status,
        paymentStatus: createdOrder.paymentStatus,
        paymentMethod: createdOrder.paymentMethod,
        totalAmount: createdOrder.totalAmount,
        estimatedDelivery: createdOrder.estimatedDelivery,
        trackingNumber: createdOrder.trackingNumber,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminUser } from "@/lib/auth";

export async function GET() {
  try {
    const setting = await prisma.storeSetting.findUnique({
      where: { id: "GENERAL" },
    });
    return NextResponse.json({ setting });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdminUser();
    const body = await req.json();

    const {
      announcementText,
      freeShippingThreshold,
      standardShippingFee,
      taxRatePercentage,
      codEnabled,
    } = body;

    const setting = await prisma.storeSetting.upsert({
      where: { id: "GENERAL" },
      update: {
        ...(announcementText !== undefined ? { announcementText } : {}),
        ...(freeShippingThreshold !== undefined ? { freeShippingThreshold: parseFloat(freeShippingThreshold) } : {}),
        ...(standardShippingFee !== undefined ? { standardShippingFee: parseFloat(standardShippingFee) } : {}),
        ...(taxRatePercentage !== undefined ? { taxRatePercentage: parseFloat(taxRatePercentage) } : {}),
        ...(codEnabled !== undefined ? { codEnabled: Boolean(codEnabled) } : {}),
      },
      create: {
        id: "GENERAL",
        announcementText: announcementText || "Complimentary Express Shipping on Orders Over ₹1,499",
        freeShippingThreshold: parseFloat(freeShippingThreshold || "1499"),
        standardShippingFee: parseFloat(standardShippingFee || "99"),
        taxRatePercentage: parseFloat(taxRatePercentage || "5.0"),
        codEnabled: Boolean(codEnabled ?? true),
      },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

import React from "react";
import Link from "next/link";
import { RotateCcw, CheckCircle2, Shield, Truck, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Returns & Exchanges Policy | MENZPLAZA",
  description: "Learn about the MENZPLAZA 7-day doorstep return and size exchange guarantee.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-sand/40 pb-6">
        <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
          The MENZPLAZA Guarantee
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
          7-Day Complimentary Returns &amp; Exchanges
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          &ldquo;The Right Fit. Every Time.&rdquo; is more than a motto—it is our binding sartorial pledge.
        </p>
      </div>

      <div className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div className="p-5 bg-sand/15 rounded-xl border border-sand/40 space-y-2">
          <h2 className="font-bold text-sm text-obsidian flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-olive" />
            <span>How Doorstep Size Exchanges Work</span>
          </h2>
          <p>
            If your trousers are either slightly snug or loose at the waist, or if you prefer a different inseam crop, you can request an instant size exchange directly from your{" "}
            <Link href="/account/orders" className="text-obsidian font-bold underline">
              Order History
            </Link>{" "}
            within 7 calendar days of delivery.
          </p>
          <p>
            Our logistics partner will arrive at your address with the freshly tailored replacement size and seamlessly swap the garment on the spot.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            Return Conditions
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
            <li>The trousers must be unworn, unwashed, and in their original packaging.</li>
            <li>All brand tags, pocket stitching, and button protective sleeves must remain intact.</li>
            <li>No customized hem alterations or monogrammed embroidery must have been performed externally.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            Refund Timelines
          </h2>
          <p>
            For prepaid orders (UPI / Cards / NetBanking), refunds are credited back to the original source method within 3 to 5 business days after quality verification.
          </p>
          <p>
            For Cash on Delivery (COD) orders, a secure direct bank account transfer (NEFT/IMPS) or store privilege credit is issued upon parcel receipt.
          </p>
        </div>
      </div>
    </div>
  );
}

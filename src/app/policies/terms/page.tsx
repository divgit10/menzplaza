import React from "react";

export const metadata = {
  title: "Terms of Service | MENZPLAZA",
  description: "Terms and conditions governing orders, tailoring guarantees, and website usage at MENZPLAZA.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-sand/40 pb-6">
        <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
          Legal Agreement
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          Effective Date: January 1, 2025. Governing operations under MENZPLAZA Menswear Pvt Ltd.
        </p>
      </div>

      <div className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div className="space-y-2">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            1. Commercial Orders &amp; Contract Formation
          </h2>
          <p>
            By placing an order through MENZPLAZA, you represent that you are at least 18 years of age and authorized to transact using the designated payment method. Order acceptance is confirmed upon issuance of a formal MENZPLAZA order number.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            2. Fit Estimates &amp; Tailoring Advice
          </h2>
          <p>
            The MENZ FIT FINDER provides estimated recommendations based on standard sizing geometry. While highly reliable, natural variances in human body morphology mean individual preferences may require standard size adjustment. We offer complimentary 7-day exchanges to guarantee satisfaction.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            3. Pricing, Taxes &amp; GST
          </h2>
          <p>
            All consumer prices are quoted in Indian Rupees (INR) and are inclusive of standard applicable GST. We reserve the right to correct typographical inaccuracies in pricing prior to shipment dispatch.
          </p>
        </div>
      </div>
    </div>
  );
}

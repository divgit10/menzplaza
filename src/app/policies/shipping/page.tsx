import React from "react";
import { Truck, CheckCircle2, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Shipping & Delivery Policy | MENZPLAZA",
  description: "Information regarding Pan-India express delivery, shipping thresholds, and tracking.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-sand/40 pb-6">
        <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
          Logistics Excellence
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
          Pan-India Shipping &amp; Delivery Terms
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          Precision crafted trousers safely delivered to over 19,000 postal codes across India.
        </p>
      </div>

      <div className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-1">
            <span className="text-olive font-bold text-xs uppercase tracking-wider block">
              Complimentary Shipping
            </span>
            <p className="font-editorial text-xl font-bold text-obsidian">Orders Over ₹1,499</p>
            <p className="text-[11px] text-neutral-500">
              Zero shipping fee applied automatically at checkout.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-1">
            <span className="text-neutral-500 font-bold text-xs uppercase tracking-wider block">
              Standard Orders
            </span>
            <p className="font-editorial text-xl font-bold text-obsidian">Flat ₹99</p>
            <p className="text-[11px] text-neutral-500">
              For cart subtotals under ₹1,499 across all states.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-1">
            <span className="text-olive font-bold text-xs uppercase tracking-wider block">
              Dispatch Window
            </span>
            <p className="font-editorial text-xl font-bold text-obsidian">24 - 48 Hours</p>
            <p className="text-[11px] text-neutral-500">
              Rigorous steam finish and quality audit before packing.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-4">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            Regional Transit Timelines
          </h2>
          <div className="p-4 bg-white rounded-xl border border-sand/40 divide-y divide-sand/20">
            <div className="py-2.5 flex justify-between">
              <span className="font-bold text-obsidian">Metro Cities (Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad, Chennai)</span>
              <span className="text-olive font-semibold">2 - 3 Business Days</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-bold text-obsidian">Tier-2 Hubs (Ahmedabad, Jaipur, Chandigarh, Lucknow, Kolkata, Kochi)</span>
              <span className="text-olive font-semibold">3 - 4 Business Days</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="font-bold text-obsidian">Rest of India &amp; North East</span>
              <span className="text-olive font-semibold">4 - 6 Business Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

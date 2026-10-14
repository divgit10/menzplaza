"use client";

import React, { useState } from "react";
import { MapPin, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import { checkIndianPincode, PincodeDeliveryInfo } from "@/lib/utils";

export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<PincodeDeliveryInfo | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode) return;
    const res = checkIndianPincode(pincode);
    setResult(res);
  };

  return (
    <div className="p-4 bg-sand/15 rounded-lg border border-sand/40">
      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-obsidian uppercase tracking-wider">
        <Truck className="w-4 h-4 text-olive" />
        <span>Delivery & Serviceability Check</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Indian PIN code"
            value={pincode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setPincode(val);
              if (result) setResult(null);
            }}
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-sand/60 rounded text-obsidian placeholder-neutral-400 focus:outline-none focus:border-obsidian"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-obsidian text-ivory text-xs font-medium rounded hover:bg-neutral-800 transition-colors"
        >
          Check
        </button>
      </form>

      {result && (
        <div
          className={`mt-2.5 p-2.5 rounded text-xs flex items-start gap-2 ${
            result.valid
              ? "bg-white text-neutral-700 border border-olive/30"
              : "bg-terracotta/10 text-terracotta border border-terracotta/30"
          }`}
        >
          {result.valid ? (
            <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-medium">{result.message}</p>
            {result.valid && (
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Eligible for Free Standard Delivery on orders over ₹1,499.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

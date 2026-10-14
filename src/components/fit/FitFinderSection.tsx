"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Sparkles, CheckCircle2, ArrowRight, RotateCcw, Info } from "lucide-react";
import { calculateFitFinder, FitFinderResult } from "@/lib/utils";

interface FitFinderSectionProps {
  onSelectSize?: (waist: number, inseam: number) => void;
  showShopLink?: boolean;
}

export default function FitFinderSection({
  onSelectSize,
  showShopLink = true,
}: FitFinderSectionProps) {
  const [heightCm, setHeightCm] = useState<number>(175);
  const [waistInches, setWaistInches] = useState<number>(32);
  const [inseamInches, setInseamInches] = useState<number | undefined>(undefined);
  const [preferredFit, setPreferredFit] = useState<"slim" | "regular" | "relaxed" | "tapered">("slim");
  const [wearingStyle, setWearingStyle] = useState<"low-rise" | "mid-rise" | "high-rise">("mid-rise");

  const [result, setResult] = useState<FitFinderResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const calculated = calculateFitFinder({
      heightCm,
      waistInches,
      inseamInches,
      preferredFit,
      wearingStyle,
    });
    setResult(calculated);
    if (onSelectSize) {
      onSelectSize(calculated.recommendedWaist, calculated.recommendedInseam);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-sand shadow-elevated p-6 sm:p-8 md:p-10 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-olive/10 border border-olive/20 rounded-full text-olive text-xs font-semibold uppercase tracking-wider mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Tailoring Intelligence</span>
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl font-bold text-obsidian tracking-tight">
          MENZ FIT FINDER
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          Find your ideal trouser waist and inseam length in seconds. Engineered for Indian men&apos;s proportions with zero guesswork.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleCalculate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Height */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-obsidian">
                <label htmlFor="fit-height">Your Height (cm)</label>
                <span className="text-olive font-bold">{heightCm} cm ({Math.floor(heightCm / 30.48)}&apos;{Math.round((heightCm % 30.48) / 2.54)}&quot;)</span>
              </div>
              <input
                id="fit-height"
                type="range"
                min={155}
                max={205}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="w-full accent-olive cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>155 cm (5&apos;1&quot;)</span>
                <span>180 cm (5&apos;11&quot;)</span>
                <span>205 cm (6&apos;9&quot;)</span>
              </div>
            </div>

            {/* Waist */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-obsidian">
                <label htmlFor="fit-waist">Waist Measurement (inches)</label>
                <span className="text-olive font-bold">{waistInches} inches</span>
              </div>
              <input
                id="fit-waist"
                type="range"
                min={26}
                max={44}
                value={waistInches}
                onChange={(e) => setWaistInches(Number(e.target.value))}
                className="w-full accent-olive cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>26&quot;</span>
                <span>34&quot;</span>
                <span>44&quot;</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Preferred Fit */}
            <div>
              <label className="block text-xs font-semibold text-obsidian mb-2">
                Preferred Leg Silhouette
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["slim", "tapered", "regular", "relaxed"] as const).map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setPreferredFit(fit)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium capitalize border transition-all ${
                      preferredFit === fit
                        ? "bg-obsidian text-ivory border-obsidian shadow-sm"
                        : "bg-ivory text-neutral-700 border-sand/60 hover:bg-white"
                    }`}
                  >
                    {fit} Fit
                  </button>
                ))}
              </div>
            </div>

            {/* Wearing Style / Rise */}
            <div>
              <label className="block text-xs font-semibold text-obsidian mb-2">
                Where Do You Rest Your Pants?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["low-rise", "mid-rise", "high-rise"] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setWearingStyle(style)}
                    className={`py-2 px-2 rounded-lg text-xs font-medium capitalize border transition-all text-center ${
                      wearingStyle === style
                        ? "bg-obsidian text-ivory border-obsidian shadow-sm"
                        : "bg-ivory text-neutral-700 border-sand/60 hover:bg-white"
                    }`}
                  >
                    {style.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Inseam field */}
          <div className="pt-2">
            <div className="flex items-center justify-between">
              <label htmlFor="fit-inseam" className="text-xs font-semibold text-obsidian">
                Specific Inseam Length (Optional)
              </label>
              <span className="text-[11px] text-neutral-400">
                Leave empty to estimate from your height
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setInseamInches(undefined)}
                className={`py-1.5 px-3 rounded text-xs font-medium border ${
                  inseamInches === undefined
                    ? "bg-sand text-obsidian border-sand font-bold"
                    : "bg-white text-neutral-600 border-sand/40"
                }`}
              >
                Auto-Estimate
              </button>
              {[30, 32, 34].map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setInseamInches(len)}
                  className={`py-1.5 px-3 rounded text-xs font-medium border ${
                    inseamInches === len
                      ? "bg-obsidian text-ivory border-obsidian"
                      : "bg-white text-neutral-600 border-sand/40 hover:bg-ivory"
                  }`}
                >
                  {len}&quot; Inseam
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-obsidian text-ivory py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shadow-elevated flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sand" />
              <span>Calculate My Tailored Fit</span>
            </button>
            <p className="text-[11px] text-center text-neutral-400 mt-2">
              We never store your personal body measurements. Calculated locally in your browser.
            </p>
          </div>
        </form>
      ) : (
        /* Result View */
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-ivory rounded-xl border border-sand/60 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-olive uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-olive" />
              <span>Tailoring Recommendation</span>
            </div>

            <div className="flex items-center justify-center gap-4 my-3">
              <div className="bg-white px-6 py-3 rounded-lg border border-sand shadow-subtle text-center">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block">
                  Waist Size
                </span>
                <span className="font-editorial text-3xl font-extrabold text-obsidian">
                  {result.recommendedWaist}W
                </span>
              </div>

              <span className="text-xl font-bold text-sand-dark">×</span>

              <div className="bg-white px-6 py-3 rounded-lg border border-sand shadow-subtle text-center">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold block">
                  Inseam Length
                </span>
                <span className="font-editorial text-3xl font-extrabold text-obsidian">
                  {result.recommendedInseam}L
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-700 max-w-lg mx-auto leading-relaxed mt-4">
              {result.fitAdvice}
            </p>
          </div>

          {/* Honest Disclaimer as required by prompt */}
          <div className="flex items-start gap-2.5 p-3.5 bg-neutral-100 rounded-lg text-[11px] text-neutral-500 border border-neutral-200">
            <Info className="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" />
            <p>{result.disclaimer}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-5 py-2.5 border border-sand text-neutral-700 text-xs font-medium rounded-lg hover:bg-ivory flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adjust Measurements</span>
            </button>

            {showShopLink && (
              <Link
                href={`/products?waist=${result.recommendedWaist}`}
                className="w-full sm:w-auto px-6 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 flex items-center justify-center gap-2 shadow-elevated"
              >
                <span>Shop Size {result.recommendedWaist}W Pants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

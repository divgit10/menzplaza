import React from "react";
import FitFinderSection from "@/components/fit/FitFinderSection";
import { Scissors, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "MENZ FIT FINDER | Precision Men's Sizing & Tailoring Tool",
  description:
    "Find your perfect trouser waist size and inseam length in seconds with the MENZ FIT FINDER. Engineered for Indian men's body profiles.",
};

export default function FitFinderPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-olive uppercase block mb-2">
          Tailored Proprietary Algorithm
        </span>
        <h1 className="font-editorial text-3xl sm:text-5xl font-extrabold text-obsidian tracking-tight">
          Find Your Perfect Fit.
        </h1>
        <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
          Say farewell to ill-fitting trousers and tailor alterations. Our algorithm maps your natural waistline, stature, and fit aesthetics to recommend the ideal size combination.
        </p>
      </div>

      <FitFinderSection />

      {/* Tailoring Principles */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-sand/40">
        <div className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle">
          <div className="p-2.5 bg-sand/20 rounded-lg w-fit text-obsidian mb-3">
            <Scissors className="w-5 h-5 text-olive" />
          </div>
          <h3 className="font-bold text-sm text-obsidian mb-1">Anatomical Rise Balance</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Engineered seat curves prevent fabric bunching when seated and ensure clean leg lines when standing.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle">
          <div className="p-2.5 bg-sand/20 rounded-lg w-fit text-obsidian mb-3">
            <Sparkles className="w-5 h-5 text-olive" />
          </div>
          <h3 className="font-bold text-sm text-obsidian mb-1">Flex Comfort Waistbands</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Up to 1.5 inches of invisible stretch allows for natural day-to-day fluctuations without belt pinching.
          </p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle">
          <div className="p-2.5 bg-sand/20 rounded-lg w-fit text-obsidian mb-3">
            <CheckCircle2 className="w-5 h-5 text-olive" />
          </div>
          <h3 className="font-bold text-sm text-obsidian mb-1">Doorstep Size Exchange</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            In the rare event that the size isn&apos;t flawless, our reverse courier will pick up and swap your pair for free.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import { Ruler, Compass, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Sartorial Size & Measurement Guide | MENZPLAZA",
  description:
    "Comprehensive trouser size chart, waist dimensions, inseam breaks, and fit guidance for Indian men.",
};

export default function SizeGuidePage() {
  const sizeTable = [
    { waist: 28, hipIn: 36, thighIn: 22, hemIn: 13 },
    { waist: 30, hipIn: 38, thighIn: 23, hemIn: 13.5 },
    { waist: 32, hipIn: 40, thighIn: 24, hemIn: 14 },
    { waist: 34, hipIn: 42, thighIn: 25, hemIn: 14.5 },
    { waist: 36, hipIn: 44, thighIn: 26, hemIn: 15 },
    { waist: 38, hipIn: 46, thighIn: 27, hemIn: 15.5 },
    { waist: 40, hipIn: 48, thighIn: 28, hemIn: 16 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="border-b border-sand/40 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
            Precision Tailoring
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
            Trouser Sizing &amp; Measurement Guide
          </h1>
        </div>
        <Link
          href="/fit-finder"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded shadow-elevated"
        >
          <Compass className="w-3.5 h-3.5 text-sand" />
          <span>Launch Fit Finder</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-sand/40 shadow-subtle overflow-hidden">
        <div className="p-4 bg-sand/15 border-b border-sand/30 font-bold text-xs text-obsidian">
          Standard Waist &amp; Silhouette Dimensions (Inches)
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-sand/10 text-neutral-600 border-b border-sand/20">
            <tr>
              <th className="p-3">Waist Size</th>
              <th className="p-3">Hip Circumference</th>
              <th className="p-3">Thigh Width</th>
              <th className="p-3">Leg Opening (Hem)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/20 text-neutral-700">
            {sizeTable.map((row) => (
              <tr key={row.waist} className="hover:bg-sand/5">
                <td className="p-3 font-bold text-obsidian">{row.waist}&quot;</td>
                <td className="p-3">{row.hipIn}&quot;</td>
                <td className="p-3">{row.thighIn}&quot;</td>
                <td className="p-3">{row.hemIn}&quot;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600">
        <div className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-2">
          <h3 className="font-bold text-obsidian">Short Inseam (30&quot;)</h3>
          <p>Ideal for heights under 5&apos;7&quot; (&lt;170 cm). Leaves a crisp, modern crop without cuff stacking.</p>
        </div>
        <div className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-2">
          <h3 className="font-bold text-obsidian">Regular Inseam (32&quot;)</h3>
          <p>Ideal for heights 5&apos;8&quot; to 6&apos;0&quot; (172-183 cm). Slight forward break resting gracefully on dress shoes or sneakers.</p>
        </div>
        <div className="p-5 bg-white rounded-xl border border-sand/40 shadow-subtle space-y-2">
          <h3 className="font-bold text-obsidian">Long Inseam (34&quot;)</h3>
          <p>Ideal for heights 6&apos;1&quot; and above (&gt;185 cm). Full break drape suitable for tall statures and tailored turn-up cuffs.</p>
        </div>
      </div>
    </div>
  );
}

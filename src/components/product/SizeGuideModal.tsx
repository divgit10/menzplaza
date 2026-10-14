"use client";

import React, { useState } from "react";
import { X, Ruler, HelpCircle, Check } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"inches" | "cm">("inches");

  if (!isOpen) return null;

  const sizeTable = [
    { waist: 28, hipIn: 36, thighIn: 22, hemIn: 13, hipCm: 91, thighCm: 56, hemCm: 33 },
    { waist: 30, hipIn: 38, thighIn: 23, hemIn: 13.5, hipCm: 96, thighCm: 58, hemCm: 34 },
    { waist: 32, hipIn: 40, thighIn: 24, hemIn: 14, hipCm: 101, thighCm: 61, hemCm: 35.5 },
    { waist: 34, hipIn: 42, thighIn: 25, hemIn: 14.5, hipCm: 106, thighCm: 63.5, hemCm: 37 },
    { waist: 36, hipIn: 44, thighIn: 26, hemIn: 15, hipCm: 112, thighCm: 66, hemCm: 38 },
    { waist: 38, hipIn: 46, thighIn: 27, hemIn: 15.5, hipCm: 117, thighCm: 68.5, hemCm: 39 },
    { waist: 40, hipIn: 48, thighIn: 28, hemIn: 16, hipCm: 122, thighCm: 71, hemCm: 40.5 },
  ];

  const inseamTable = [
    { label: "Short (30\")", height: "Under 5'7\" (< 170 cm)", description: "No break or slight break for modern crop stance." },
    { label: "Regular (32\")", height: "5'8\" - 6'0\" (172 - 183 cm)", description: "Medium break touching top of shoe counter." },
    { label: "Long (34\")", height: "6'1\" and above (> 185 cm)", description: "Classic full break or tailored cuff fold." },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-[#FAF8F5] rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-sand">
          {/* Header */}
          <div className="bg-white p-5 border-b border-sand/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-olive" />
              <h3 className="font-editorial text-lg font-bold text-obsidian">
                MENZPLAZA Sartorial Size & Measurement Guide
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-obsidian p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Unit Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Waist Size Chart
              </span>
              <div className="flex bg-sand/30 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("inches")}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeTab === "inches"
                      ? "bg-white text-obsidian shadow-sm"
                      : "text-neutral-500 hover:text-obsidian"
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setActiveTab("cm")}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    activeTab === "cm"
                      ? "bg-white text-obsidian shadow-sm"
                      : "text-neutral-500 hover:text-obsidian"
                  }`}
                >
                  Centimeters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-sand/40 rounded-lg bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand/15 text-obsidian font-semibold border-b border-sand/30">
                  <tr>
                    <th className="p-3">Waist Size</th>
                    <th className="p-3">Hip Circumference</th>
                    <th className="p-3">Thigh Width</th>
                    <th className="p-3">Leg Opening (Hem)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand/20 text-neutral-700">
                  {sizeTable.map((row) => (
                    <tr key={row.waist} className="hover:bg-sand/10 transition-colors">
                      <td className="p-3 font-bold text-obsidian">
                        {row.waist}
                        {activeTab === "inches" ? '"' : ""}
                      </td>
                      <td className="p-3">
                        {activeTab === "inches" ? `${row.hipIn}"` : `${row.hipCm} cm`}
                      </td>
                      <td className="p-3">
                        {activeTab === "inches" ? `${row.thighIn}"` : `${row.thighCm} cm`}
                      </td>
                      <td className="p-3">
                        {activeTab === "inches" ? `${row.hemIn}"` : `${row.hemCm} cm`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Inseam Length Guide */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2">
                Inseam & Height Pairing
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {inseamTable.map((item) => (
                  <div
                    key={item.label}
                    className="p-3 bg-white border border-sand/40 rounded-lg text-xs"
                  >
                    <span className="font-bold text-obsidian block mb-0.5">{item.label}</span>
                    <span className="text-olive font-medium block text-[11px] mb-1">
                      {item.height}
                    </span>
                    <p className="text-[11px] text-neutral-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Understanding MENZ Fits */}
            <div className="p-4 bg-white border border-sand/40 rounded-lg space-y-2 text-xs">
              <h4 className="font-bold text-obsidian flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-olive" />
                <span>Our Signature Fits Explained</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-600 pt-1">
                <div>
                  <strong className="text-obsidian">Slim Fit:</strong> Contoured seat and thigh with a tailored taper toward the ankle. Modern, sharp silhouette.
                </div>
                <div>
                  <strong className="text-obsidian">Tapered Fit:</strong> Relaxed comfort through the hip and thigh, narrowing smoothly from the knee down.
                </div>
                <div>
                  <strong className="text-obsidian">Regular Fit:</strong> Classic straight leg drop from hip to hem with ease of movement throughout.
                </div>
                <div>
                  <strong className="text-obsidian">Relaxed Fit:</strong> Generous room across seat and thighs for effortless draping and all-day utility.
                </div>
              </div>
            </div>

            {/* Measuring Tips */}
            <div className="text-[11px] text-neutral-500 space-y-1 bg-sand/15 p-3 rounded border border-sand/30">
              <p className="font-semibold text-obsidian">How to Measure Accurately:</p>
              <p>• <strong>Waist:</strong> Measure around your natural waistline where your trousers normally rest, keeping tape comfortably loose.</p>
              <p>• <strong>Inseam:</strong> Measure from the lowest crotch seam down the inside of the leg to the ankle bone.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

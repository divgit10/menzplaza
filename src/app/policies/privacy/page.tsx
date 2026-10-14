import React from "react";
import { Shield, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy & Data Protection Policy | MENZPLAZA",
  description: "Our privacy policy outlining how customer measurements and personal data are protected.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      <div className="border-b border-sand/40 pb-6">
        <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
          Confidentiality &amp; Integrity
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-obsidian tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2">
          Your measurements, orders, and personal details are treated with the highest sartorial privacy standards.
        </p>
      </div>

      <div className="space-y-6 text-xs text-neutral-700 leading-relaxed">
        <div className="space-y-2">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            1. Zero Measurement Data Retention Without Consent
          </h2>
          <p>
            When utilizing the MENZ FIT FINDER tool, calculation of your waist and inseam recommendations occurs entirely within your client browser. We do not transmit or sell personal biometric measurements to any external third parties or advertisers.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            2. Payment Security
          </h2>
          <p>
            All online transactions are processed through tokenized, PCI-DSS Level 1 compliant gateway protocols. MENZPLAZA servers never store raw credit/debit card numbers, CVVs, or bank net-banking passwords.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-editorial text-xl font-bold text-obsidian">
            3. Address &amp; Delivery Logistics
          </h2>
          <p>
            Your shipping details and telephone numbers are shared strictly with our contracted courier logistics partners solely for fulfilling delivery, generating SMS delivery OTPs, and coordinating doorstep size exchanges.
          </p>
        </div>
      </div>
    </div>
  );
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(regularPrice: number, salePrice: number): number {
  if (regularPrice <= salePrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

// Indian Pincode Delivery Checker Simulation
export interface PincodeDeliveryInfo {
  valid: boolean;
  city?: string;
  state?: string;
  deliveryDays?: string;
  codAvailable: boolean;
  message: string;
}

export function checkIndianPincode(pincode: string): PincodeDeliveryInfo {
  const pin = pincode.trim();
  if (!/^\d{6}$/.test(pin)) {
    return {
      valid: false,
      codAvailable: false,
      message: "Please enter a valid 6-digit Indian PIN code.",
    };
  }

  const prefix = pin.substring(0, 2);
  const zones: Record<string, { city: string; state: string; days: string }> = {
    "11": { city: "New Delhi", state: "Delhi", days: "2 - 3 business days" },
    "12": { city: "Gurugram / Faridabad", state: "Haryana", days: "2 - 3 business days" },
    "13": { city: "Ambala / Karnal", state: "Haryana", days: "3 - 4 business days" },
    "14": { city: "Ludhiana / Jalandhar", state: "Punjab", days: "3 - 4 business days" },
    "16": { city: "Chandigarh", state: "Chandigarh", days: "2 - 3 business days" },
    "20": { city: "Noida / Ghaziabad", state: "Uttar Pradesh", days: "2 - 3 business days" },
    "22": { city: "Lucknow", state: "Uttar Pradesh", days: "3 - 4 business days" },
    "30": { city: "Jaipur", state: "Rajasthan", days: "3 - 4 business days" },
    "38": { city: "Ahmedabad", state: "Gujarat", days: "3 - 4 business days" },
    "39": { city: "Surat / Vadodara", state: "Gujarat", days: "3 - 4 business days" },
    "40": { city: "Mumbai / Thane", state: "Maharashtra", days: "2 - 3 business days" },
    "41": { city: "Pune", state: "Maharashtra", days: "2 - 3 business days" },
    "50": { city: "Hyderabad", state: "Telangana", days: "3 - 4 business days" },
    "56": { city: "Bengaluru", state: "Karnataka", days: "2 - 3 business days" },
    "60": { city: "Chennai", state: "Tamil Nadu", days: "3 - 4 business days" },
    "68": { city: "Kochi", state: "Kerala", days: "3 - 5 business days" },
    "70": { city: "Kolkata", state: "West Bengal", days: "3 - 4 business days" },
  };

  const matched = zones[prefix] || {
    city: "Standard Zone",
    state: "India",
    days: "4 - 6 business days",
  };

  return {
    valid: true,
    city: matched.city,
    state: matched.state,
    deliveryDays: matched.days,
    codAvailable: true,
    message: `Delivery available to ${matched.city}, ${matched.state} within ${matched.days}. Cash on Delivery eligible.`,
  };
}

// MENZ FIT FINDER size estimation logic
export interface FitFinderInput {
  heightCm: number;
  waistInches: number;
  inseamInches?: number;
  preferredFit: "slim" | "regular" | "relaxed" | "tapered";
  wearingStyle: "low-rise" | "mid-rise" | "high-rise";
}

export interface FitFinderResult {
  recommendedWaist: number;
  recommendedInseam: number;
  fitAdvice: string;
  confidence: "High" | "Moderate";
  disclaimer: string;
}

export function calculateFitFinder(input: FitFinderInput): FitFinderResult {
  let waist = Math.round(input.waistInches);
  // Standard waist sizes: 28, 30, 32, 34, 36, 38, 40
  const availableWaists = [28, 30, 32, 34, 36, 38, 40];

  // Adjust for wearing style
  if (input.wearingStyle === "low-rise") {
    waist += 0.5; // low rise rests wider at the hips
  } else if (input.wearingStyle === "high-rise") {
    waist -= 0.5; // rests higher at natural waist
  }

  // Adjust for fit preference
  if (input.preferredFit === "relaxed") {
    waist += 0.5;
  }

  // Find closest standard waist size
  const closestWaist = availableWaists.reduce((prev, curr) =>
    Math.abs(curr - waist) < Math.abs(prev - waist) ? curr : prev
  );

  // Calculate Inseam from height if not given
  let inseam = input.inseamInches || 32;
  if (!input.inseamInches) {
    if (input.heightCm < 168) {
      inseam = 30;
    } else if (input.heightCm <= 180) {
      inseam = 32;
    } else {
      inseam = 34;
    }
  } else {
    const availableInseams = [30, 32, 34];
    inseam = availableInseams.reduce((prev, curr) =>
      Math.abs(curr - inseam) < Math.abs(prev - inseam) ? curr : prev
    );
  }

  let advice = `Based on your waist measurement (${input.waistInches}") and ${input.preferredFit} fit preference, Size ${closestWaist} with a ${inseam}" inseam provides optimal draping and comfort.`;
  if (input.preferredFit === "slim") {
    advice += " The tapered thigh and narrow hem will create an athletic, tailored silhouette.";
  } else if (input.preferredFit === "relaxed") {
    advice += " The generous seat and roomier leg profile offer superior freedom of movement.";
  }

  return {
    recommendedWaist: closestWaist,
    recommendedInseam: inseam,
    fitAdvice: advice,
    confidence: "High",
    disclaimer:
      "Size recommendations are calculated estimates based on standard tailoring patterns. Individual body proportions may vary. Please consult the size chart before ordering.",
  };
}

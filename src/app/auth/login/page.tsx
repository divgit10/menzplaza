"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push("/account/orders");
    } else {
      setError(res.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-sand/60 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-olive uppercase">
            Gentleman&apos;s Portal
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-obsidian tracking-tight">
            Sign In to MENZPLAZA
          </h1>
          <p className="text-xs text-neutral-500">
            Access your tailored order history, saved addresses, and sizing preferences.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-terracotta/10 border border-terracotta/30 rounded-lg text-xs text-terracotta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-obsidian mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-obsidian mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-obsidian text-ivory py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors shadow-elevated flex items-center justify-center gap-2"
          >
            {isLoading ? <span>Signing In...</span> : <span>Sign In</span>}
          </button>
        </form>

        <div className="pt-4 border-t border-sand/30 text-center text-xs space-y-2">
          <p className="text-neutral-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-obsidian font-bold hover:underline">
              Create an account
            </Link>
          </p>
          <div className="p-3 bg-sand/15 rounded-lg border border-sand/30 text-[11px] text-neutral-600 text-left">
            <span className="font-bold text-obsidian block mb-1">Demo Access Credentials:</span>
            <p>• Admin: <code>admin@menzplaza.com</code> / <code>Admin@Menzplaza2025!</code></p>
            <p>• Customer: <code>rahul.sharma@example.com</code> / <code>Customer@123!</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

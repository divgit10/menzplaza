"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await register(name, email, password, phone);
    setIsLoading(false);

    if (res.success) {
      router.push("/account/orders");
    } else {
      setError(res.error || "Failed to create account");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-sand/60 shadow-elevated space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-olive uppercase">
            Exclusive Membership
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-extrabold text-obsidian tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-neutral-500">
            Enjoy personal fit history, fast checkout, and complimentary exchanges.
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
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Sharma"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-obsidian mb-1">
              Email Address *
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
              Mobile Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98123 45678"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory border border-sand/60 rounded focus:outline-none focus:border-obsidian"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-obsidian mb-1">
              Password (min. 8 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={8}
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
            {isLoading ? <span>Creating Account...</span> : <span>Join MENZPLAZA</span>}
          </button>
        </form>

        <div className="pt-4 border-t border-sand/30 text-center text-xs">
          <p className="text-neutral-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-obsidian font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

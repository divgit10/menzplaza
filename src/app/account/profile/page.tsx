"use client";

import React from "react";
import Link from "next/link";
import { User, Mail, Phone, MapPin, ShieldCheck, LogOut, Package } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CustomerProfilePage() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-obsidian" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4">
        <h2 className="font-editorial text-2xl font-bold text-obsidian mb-2">Account Sign In</h2>
        <p className="text-xs text-neutral-500 mb-6">Please log in to manage your profile.</p>
        <Link
          href="/auth/login"
          className="px-6 py-2.5 bg-obsidian text-ivory text-xs font-bold uppercase tracking-wider rounded"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <div className="border-b border-sand/40 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-olive font-bold block mb-1">
            Account Preferences
          </span>
          <h1 className="font-editorial text-3xl font-extrabold text-obsidian tracking-tight">
            Profile &amp; Saved Addresses
          </h1>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 border border-terracotta/40 text-terracotta text-xs font-semibold rounded-lg hover:bg-terracotta/10 transition-colors flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="bg-white p-6 rounded-xl border border-sand/40 shadow-subtle space-y-4">
          <h2 className="font-editorial text-lg font-bold text-obsidian flex items-center gap-2">
            <User className="w-4 h-4 text-olive" />
            <span>Personal Information</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Full Name</span>
              <span className="font-bold text-obsidian text-sm">{user.name}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Email Address</span>
              <span className="font-medium text-obsidian">{user.email}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Contact Number</span>
              <span className="font-medium text-obsidian">{user.phone || "Not provided"}</span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Account Membership</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-olive/15 text-olive font-bold text-[10px] rounded uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white p-6 rounded-xl border border-sand/40 shadow-subtle space-y-4">
          <h2 className="font-editorial text-lg font-bold text-obsidian flex items-center gap-2">
            <MapPin className="w-4 h-4 text-olive" />
            <span>Primary Delivery Address</span>
          </h2>

          {user.addresses && user.addresses.length > 0 ? (
            <div className="p-4 bg-sand/15 rounded-lg border border-sand/30 text-xs space-y-1 text-neutral-600">
              <div className="flex items-center justify-between font-bold text-obsidian">
                <span>{user.addresses[0].fullName}</span>
                {user.addresses[0].isDefault && (
                  <span className="text-[10px] bg-olive text-white px-1.5 py-0.5 rounded font-mono">
                    DEFAULT
                  </span>
                )}
              </div>
              <p>{user.addresses[0].addressLine1}</p>
              {user.addresses[0].addressLine2 && <p>{user.addresses[0].addressLine2}</p>}
              {user.addresses[0].landmark && (
                <p className="text-neutral-500">Landmark: {user.addresses[0].landmark}</p>
              )}
              <p className="font-medium text-obsidian">
                {user.addresses[0].city}, {user.addresses[0].state} - {user.addresses[0].postalCode}
              </p>
              <p className="pt-1 text-neutral-500">Phone: {user.addresses[0].phone}</p>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              No saved addresses yet. Address will be saved automatically upon your first order.
            </p>
          )}

          <div className="pt-2">
            <Link
              href="/account/orders"
              className="inline-flex items-center gap-2 text-xs font-semibold text-olive hover:underline"
            >
              <Package className="w-4 h-4" />
              <span>View Past Orders</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

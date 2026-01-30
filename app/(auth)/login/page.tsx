"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Mail, Lock, Globe, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      subdomain: formData.get("subdomain"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials or organization subdomain.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden">
      
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-green-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[140px]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_0_60px_-15px_rgba(0,0,0,0.7)] p-8">
          
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-500/30">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white tracking-tight">
              FarmStack
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Smart agriculture management platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 text-xs px-4 py-3 text-center">
                {error}
              </div>
            )}

            {/* Organization */}
            <Field
              icon={<Globe />}
              name="subdomain"
              label="Organization"
              placeholder="green-acres"
            />

            {/* Email */}
            <Field
              icon={<Mail />}
              name="email"
              type="email"
              label="Email"
              placeholder="admin@farm.com"
            />

            {/* Password */}
            <Field
              icon={<Lock />}
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
            />

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 py-3.5 font-semibold text-white shadow-lg shadow-green-600/30 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign in to Dashboard"
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-xs text-white/30">
            © 2026 FarmStack Systems. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Reusable Input Field Component     */
/* ---------------------------------- */

function Field({
  icon,
  label,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="ml-1 text-[11px] font-medium uppercase tracking-wider text-white/60">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
          {icon}
        </div>
        <input
          required
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition-all focus:border-green-400/40 focus:bg-white/10 focus:ring-2 focus:ring-green-400/30"
          {...props}
        />
      </div>
    </div>
  );
}

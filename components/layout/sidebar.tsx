"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Container,
  Thermometer,
  Utensils,
  Activity,
  TrendingUp,
  Stethoscope,
  ShieldCheck,
  ShoppingBag,
  CircleDollarSign,
  Users,
  History,
  Settings,
  ChevronDown,
  Search,
  LogOut,
  Sprout,
} from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

/* -------------------------------------------------------
   Sidebar
-------------------------------------------------------- */
export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // ✅ Only CORE open by default
  const [open, setOpen] = useState<Record<string, boolean>>({
    core: true,
    operations: false,
    production: false,
    health: false,
    finance: false,
    admin: false,
  });

  const toggle = (key: string) =>
    setOpen((p) => ({ ...p, [key]: !p[key] }));

  return (
    <aside className="w-72 bg-neutral-950 border-r border-white/10 flex flex-col h-screen">
      
      {/* BRAND */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center shadow-lg">
            <Sprout className="text-neutral-950" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">FarmStack</h1>
            <p className="text-[10px] text-emerald-400 uppercase tracking-wider">
              {session?.user?.name ? `${session.user.name}'s Farm` : "Enterprise"}
            </p>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="p-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 transition">
          <Search size={14} />
          <span className="text-xs">Search...</span>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 overflow-y-auto space-y-2 sidebar-scroll">

        {/* CORE */}
        <Section label="Core" open={open.core} onToggle={() => toggle("core")}>
          <Item href="/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={pathname === "/dashboard"} />
          <Item href="/projects" icon={<Package />} label="Projects" active={pathname.startsWith("/projects")} />
        </Section>

        {/* OPERATIONS */}
        <Section label="Operations" open={open.operations} onToggle={() => toggle("operations")}>
          <Item href="/housing" icon={<Warehouse />} label="Housing Units" active={pathname.startsWith("/housing")} />
          <Item href="/batches" icon={<Container />} label="Animal Batches" active={pathname.startsWith("/batches")} />
          <Item href="/environment" icon={<Thermometer />} label="Environment Logs" active={pathname.startsWith("/environment")} />
        </Section>

        {/* PRODUCTION */}
        <Section label="Production" open={open.production} onToggle={() => toggle("production")}>
          <Item href="/feeding" icon={<Utensils />} label="Feeding Logs" active={pathname.startsWith("/feeding")} />
          <Item href="/growth" icon={<Activity />} label="Growth Records" active={pathname.startsWith("/growth")} />
          <Item href="/production" icon={<TrendingUp />} label="Production Output" active={pathname.startsWith("/production")} />
        </Section>

        {/* HEALTH */}
        <Section label="Health" open={open.health} onToggle={() => toggle("health")}>
          <Item href="/diseases" icon={<ShieldCheck />} label="Diseases" active={pathname.startsWith("/diseases")} />
          <Item href="/treatments" icon={<Stethoscope />} label="Treatments" active={pathname.startsWith("/treatments")} />
        </Section>

        {/* FINANCIALS */}
        <Section label="Financials" open={open.finance} onToggle={() => toggle("finance")}>
          <Item href="/harvests" icon={<ShoppingBag />} label="Harvests" active={pathname.startsWith("/harvests")} />
          <Item href="/sales" icon={<CircleDollarSign />} label="Sales" active={pathname.startsWith("/sales")} />
          <Item href="/expenses" icon={<CircleDollarSign />} label="Expenses" active={pathname.startsWith("/expenses")} />
          <Item href="/analytics" icon={<TrendingUp />} label="Analytics" active={pathname.startsWith("/analytics")} />
        </Section>

        {/* ADMIN */}
        <Section label="Admin" open={open.admin} onToggle={() => toggle("admin")}>
          <Item href="/users" icon={<Users />} label="Users" active={pathname.startsWith("/users")} />
          <Item href="/roles" icon={<ShieldCheck />} label="Roles & Permissions" active={pathname.startsWith("/roles")} />
          <Item href="/audit-logs" icon={<History />} label="Audit Logs" active={pathname.startsWith("/audit-logs")} />
          <Item href="/settings" icon={<Settings />} label="Tenant Settings" active={pathname.startsWith("/settings")} />
        </Section>
      </nav>

      {/* USER */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-neutral-800 flex items-center justify-center text-sm text-emerald-400 font-bold">
            {session?.user?.name?.[0] ?? "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-[10px] text-white/40 uppercase">
              {session?.user?.role ?? "Operator"}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="p-2 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------
   Section
-------------------------------------------------------- */
function Section({ label, open, onToggle, children }: any) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white/70 transition"
      >
        {label}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden space-y-0.5 mt-1"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------
   Nav Item
-------------------------------------------------------- */
function Item({ href, icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-emerald-500/10 text-emerald-400"
          : "text-white/50 hover:bg-white/5 hover:text-white"
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 w-1 h-4 bg-emerald-500 rounded-r-full"
        />
      )}
      <span className="opacity-80">{icon}</span>
      {label}
    </Link>
  );
}

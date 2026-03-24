"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import type { PortalRole } from "@/types";
import { DEMO_USERS } from "@/data/demoData";

export default function Home() {
  const [role, setRole] = useState<PortalRole | null>(null);
  const [quickLogging, setQuickLogging] = useState<string | null>(null);

  const handleQuickLogin = (loginRole: PortalRole) => {
    setQuickLogging(loginRole);
    setTimeout(() => {
      setRole(loginRole);
      setQuickLogging(null);
    }, 600);
  };

  const handleLogout = () => {
    setRole(null);
  };

  if (role) {
    const user = DEMO_USERS.find((u) => u.role === role)!;
    return <Dashboard role={role} user={user} onLogout={handleLogout} />;
  }

  const portals = [
    {
      role: "tenant" as PortalRole,
      label: "Tenant Portal",
      sublabel: "Sarah Chen · Unit 101",
      short: "T",
      from: "from-teal-600",
      to: "to-cyan-600",
      hover: "hover:border-teal-600/50",
      glow: "group-hover:text-teal-400",
      description: "Pay rent, submit maintenance, view lease",
    },
    {
      role: "owner" as PortalRole,
      label: "Owner Portal",
      sublabel: "Marcus Rivera · 3 properties",
      short: "O",
      from: "from-blue-500",
      to: "to-indigo-600",
      hover: "hover:border-blue-600/50",
      glow: "group-hover:text-blue-400",
      description: "Portfolio KPIs, approvals, P&L",
    },
    {
      role: "contractor" as PortalRole,
      label: "Contractor Portal",
      sublabel: "Jake Torres · Plumber",
      short: "C",
      from: "from-amber-500",
      to: "to-orange-600",
      hover: "hover:border-amber-600/50",
      glow: "group-hover:text-amber-400",
      description: "Job requests, schedule, invoices",
    },
    {
      role: "admin" as PortalRole,
      label: "Admin Portal",
      sublabel: "Platform Admin",
      short: "A",
      from: "from-purple-500",
      to: "to-violet-600",
      hover: "hover:border-purple-600/50",
      glow: "group-hover:text-purple-400",
      description: "Accounts, disputes, platform settings",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-900/40" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Pivot</h1>
              <p className="text-xs text-gray-500 -mt-0.5">Property Management Platform</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">Select a portal to explore the demo</p>
        </div>

        {/* Quick Login Cards */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {portals.map((p) => (
            <button
              key={p.role}
              onClick={() => handleQuickLogin(p.role)}
              disabled={!!quickLogging}
              className={`group flex flex-col items-start gap-3 p-4 rounded-xl border border-navy-700 bg-navy-900 ${p.hover} hover:bg-navy-800 transition-all text-left disabled:opacity-60`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.from} ${p.to} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {quickLogging === p.role ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : p.short}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold text-white ${p.glow} transition-colors`}>{p.label}</div>
                  <div className="text-[11px] text-gray-500 truncate">{p.sublabel}</div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{p.description}</p>
            </button>
          ))}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["AI Maintenance Triage", "AutoPay", "STR/LTR Switching", "Dynamic Pricing", "Smart Lock Integration"].map((f) => (
            <span key={f} className="text-[11px] text-gray-500 bg-navy-900 border border-navy-800 rounded-full px-3 py-1">
              {f}
            </span>
          ))}
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-6">
          Demo environment · No real data · No backend required
        </p>
      </div>
    </div>
  );
}

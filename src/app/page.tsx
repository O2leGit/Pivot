"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import type { PortalRole, DemoUser } from "@/types";
import { DEMO_USERS } from "@/data/demoData";

type ViewType = "platform" | "partner" | "tenant" | "contractor";

const ROLE_TO_VIEW: Record<PortalRole, ViewType> = {
  admin: "platform",
  owner: "partner",
  tenant: "tenant",
  contractor: "contractor",
};

const VIEW_LABEL: Record<ViewType, string> = {
  platform: "Platform Admin",
  partner: "Partner Portal",
  tenant: "Tenant Portal",
  contractor: "Contractor Portal",
};

export default function Home() {
  const [viewType, setViewType] = useState<ViewType | null>(null);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [impersonating, setImpersonating] = useState<{ fromType: ViewType; fromUser: DemoUser } | null>(null);
  const [quickLogging, setQuickLogging] = useState<string | null>(null);

  const handleQuickLogin = (role: PortalRole) => {
    setQuickLogging(role);
    setTimeout(() => {
      const user = DEMO_USERS.find((u) => u.role === role)!;
      setCurrentUser(user);
      setViewType(ROLE_TO_VIEW[role]);
      setQuickLogging(null);
    }, 600);
  };

  const handleLogout = () => {
    setViewType(null);
    setCurrentUser(null);
    setImpersonating(null);
  };

  const handleLoginAs = (role: PortalRole) => {
    if (viewType && currentUser) {
      setImpersonating({ fromType: viewType, fromUser: currentUser });
    }
    const user = DEMO_USERS.find((u) => u.role === role)!;
    setCurrentUser(user);
    setViewType(ROLE_TO_VIEW[role]);
  };

  const handleReturnToAdmin = () => {
    if (impersonating) {
      setCurrentUser(impersonating.fromUser);
      setViewType(impersonating.fromType);
      setImpersonating(null);
    }
  };

  if (viewType && currentUser) {
    return (
      <div className="flex flex-col h-screen">
        {/* Impersonation banner */}
        {impersonating && (
          <div className="bg-amber-900/90 border-b border-amber-700/60 px-4 py-2 flex items-center justify-between text-sm z-50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-200">
                Viewing as: <strong className="text-white">{currentUser.name}</strong>
              </span>
              <span className="text-amber-600">·</span>
              <span className="text-amber-400 text-xs">{VIEW_LABEL[viewType]}</span>
            </div>
            <button
              onClick={handleReturnToAdmin}
              className="bg-amber-700/80 hover:bg-amber-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 border border-amber-600/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Return to {VIEW_LABEL[impersonating.fromType]}
            </button>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <Dashboard
            role={currentUser.role}
            user={currentUser}
            onLogout={handleLogout}
            onLoginAs={handleLoginAs}
          />
        </div>
      </div>
    );
  }

  const layers = [
    {
      layer: "Layer 1",
      title: "Platform Administration",
      subtitle: "Full visibility · Create anything · Login as any client",
      color: "from-teal-600/20 to-teal-900/20",
      border: "border-teal-700/50",
      role: "admin" as PortalRole,
      short: "PA",
      gradient: "from-teal-600 to-cyan-600",
      hover: "hover:border-teal-600/70",
      badge: "bg-teal-900/60 text-teal-300 border-teal-700/50",
      features: ["All partners + all clients", "Create partners, tenants, demos", "Login as any client"],
    },
    {
      layer: "Layer 2",
      title: "Partner Portal",
      subtitle: "Your properties · Your tenants · One-click client login",
      color: "from-blue-600/20 to-blue-900/20",
      border: "border-blue-700/50",
      role: "owner" as PortalRole,
      short: "PM",
      gradient: "from-blue-500 to-indigo-600",
      hover: "hover:border-blue-600/70",
      badge: "bg-blue-900/60 text-blue-300 border-blue-700/50",
      features: ["Tenants assigned to you", "One-click demo — switch into client view", "Maintenance, invoices, P&L"],
    },
  ];

  const clientLogins = [
    {
      role: "tenant" as PortalRole,
      label: "Tenant",
      sublabel: "Sarah Chen · Unit 101",
      short: "T",
      gradient: "from-teal-600 to-cyan-600",
      hover: "hover:border-teal-600/50",
      description: "Pay rent, submit maintenance, view lease",
    },
    {
      role: "contractor" as PortalRole,
      label: "Contractor",
      sublabel: "Jake Torres · Plumber",
      short: "C",
      gradient: "from-amber-500 to-orange-600",
      hover: "hover:border-amber-600/50",
      description: "Job requests, schedule, invoices",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/filter-pros-logo.png"
            alt="Filter Pros, LLC"
            className="h-28 w-auto mx-auto mb-3 drop-shadow-lg"
          />
          <p className="text-xs text-gray-500">Property Management Platform</p>
        </div>

        {/* Layer 1 & 2 */}
        <div className="space-y-3 mb-3">
          {layers.map((l) => (
            <button
              key={l.role}
              onClick={() => handleQuickLogin(l.role)}
              disabled={!!quickLogging}
              className={`w-full group bg-gradient-to-br ${l.color} border ${l.border} ${l.hover} rounded-xl p-4 transition-all text-left disabled:opacity-60`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${l.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0`}>
                  {quickLogging === l.role ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : l.short}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${l.badge}`}>{l.layer}</span>
                    <span className="text-sm font-semibold text-white">{l.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{l.subtitle}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {l.features.map((f) => (
                      <span key={f} className="text-[10px] text-gray-500 bg-navy-900/60 border border-navy-700/50 rounded-md px-2 py-0.5">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center my-1 text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Layer 3 — Client portals */}
        <div className="bg-gradient-to-br from-navy-800/60 to-navy-900/60 border border-navy-700/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy-700/80 text-gray-400 border border-navy-600/50">Layer 3</span>
            <span className="text-sm font-semibold text-white">Client Portals</span>
            <span className="text-xs text-gray-500">· Each client sees only their own environment</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {clientLogins.map((c) => (
              <button
                key={c.role}
                onClick={() => handleQuickLogin(c.role)}
                disabled={!!quickLogging}
                className={`group flex flex-col items-start gap-2 p-3 rounded-lg border border-navy-700 bg-navy-900/60 ${c.hover} hover:bg-navy-800/60 transition-all text-left disabled:opacity-60`}
              >
                <div className="flex items-center gap-2.5 w-full">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                    {quickLogging === c.role ? (
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : c.short}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white">{c.label}</div>
                    <div className="text-[10px] text-gray-500 truncate">{c.sublabel}</div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{c.description}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-5">
          Demo environment · No real data · No backend required
        </p>
      </div>
    </div>
  );
}

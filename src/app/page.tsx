"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import type { PortalRole, DemoUser } from "@/types";
import { DEMO_USERS } from "@/data/demoData";

type ViewType = "platform" | "partner" | "tenant" | "contractor";

const ROLE_TO_VIEW: Record<PortalRole, ViewType> = {
  admin: "platform", owner: "partner", tenant: "tenant", contractor: "contractor",
};
const VIEW_LABEL: Record<ViewType, string> = {
  platform: "Platform Admin", partner: "Owner Portal", tenant: "Tenant Portal", contractor: "Contractor Portal",
};

export default function Home() {
  const [viewType, setViewType] = useState<ViewType | null>(null);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [impersonating, setImpersonating] = useState<{ fromType: ViewType; fromUser: DemoUser } | null>(null);
  const [quickLogging, setQuickLogging] = useState<PortalRole | null>(null);
  const [tourActive, setTourActive] = useState(false);

  const handleQuickLogin = (role: PortalRole, withTour = false) => {
    setQuickLogging(role);
    setTimeout(() => {
      const user = DEMO_USERS.find((u) => u.role === role)!;
      setCurrentUser(user);
      setViewType(ROLE_TO_VIEW[role]);
      setQuickLogging(null);
      if (withTour) setTourActive(true);
    }, 600);
  };

  const handleTakeTour = () => handleQuickLogin("owner", true);

  const handleLogout = () => { setViewType(null); setCurrentUser(null); setImpersonating(null); };

  const handleLoginAs = (role: PortalRole) => {
    if (viewType && currentUser) setImpersonating({ fromType: viewType, fromUser: currentUser });
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
        {impersonating && (
          <div className="bg-amber-900/90 border-b border-amber-700/60 px-4 py-2 flex items-center justify-between text-sm z-50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-200">Viewing as: <strong className="text-white">{currentUser.name}</strong></span>
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
          <Dashboard role={currentUser.role} user={currentUser} onLogout={handleLogout} onLoginAs={handleLoginAs} tourActive={tourActive} onTourEnd={() => setTourActive(false)} />
        </div>
      </div>
    );
  }

  const portals = [
    {
      role: "tenant" as PortalRole,
      label: "Tenant Portal",
      sub: "Sarah Chen · Unit 101",
      short: "T",
      from: "from-cyan-500", to: "to-teal-600",
      hover: "hover:border-cyan-600/50", text: "group-hover:text-cyan-400",
    },
    {
      role: "owner" as PortalRole,
      label: "Owner Portal",
      sub: "Marcus Rivera · 3 properties",
      short: "O",
      from: "from-blue-500", to: "to-indigo-600",
      hover: "hover:border-blue-600/50", text: "group-hover:text-blue-400",
    },
    {
      role: "contractor" as PortalRole,
      label: "Contractor Portal",
      sub: "Jake Torres · Plumber",
      short: "C",
      from: "from-amber-500", to: "to-orange-600",
      hover: "hover:border-amber-600/50", text: "group-hover:text-amber-400",
    },
    {
      role: "admin" as PortalRole,
      label: "Admin Portal",
      sub: "Platform Admin",
      short: "A",
      from: "from-teal-500", to: "to-emerald-600",
      hover: "hover:border-teal-600/50", text: "group-hover:text-teal-400",
    },
  ];

  const features = [
    {
      icon: (
        <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered from Unit 1",
      body: "Maintenance triage, tenant screening, and lease drafting — no minimums.",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: "STR ↔ LTR Switching",
      body: "Seasonal mode switching across your entire portfolio in one click.",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Open IoT API",
      body: "Any smart lock, sensor, or device connects via webhook instantly.",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "5 Portals, 1 Platform",
      body: "Tenant, Owner, Contractor, Admin + AI layer — fully unified.",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-5">

        {/* Brand card */}
        <div className="card">
          {/* Logo */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center mb-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pivot</h1>
            <p className="text-sm text-gray-400 mt-0.5">Property Management Platform</p>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">AI-powered tools for independent landlords managing 1–50 units</p>
          </div>

          {/* Take a Tour CTA */}
          <button
            onClick={handleTakeTour}
            disabled={!!quickLogging}
            className="w-full mb-4 flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-teal-700/60 bg-teal-900/20 text-teal-300 text-sm font-medium hover:bg-teal-900/40 transition-all disabled:opacity-50"
          >
            {quickLogging === "owner" ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            Take a Guided Tour
          </button>

          {/* Quick Login */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2.5 text-center">Or select a portal to explore</p>
            <div className="grid grid-cols-2 gap-2.5">
              {portals.map((btn) => (
                <button
                  key={btn.role}
                  onClick={() => handleQuickLogin(btn.role)}
                  disabled={!!quickLogging}
                  aria-label={`Log in as ${btn.label}`}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border border-navy-700 bg-navy-900 ${btn.hover} hover:bg-navy-800 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 group disabled:opacity-50 text-left`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${btn.from} ${btn.to} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {quickLogging === btn.role ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : btn.short}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold text-white ${btn.text} transition-colors truncate`}>{btn.label}</div>
                    <div className="text-[11px] text-gray-500 truncate">{btn.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-1.5 justify-center">
            {[
              { label: "AI Maintenance Triage", icon: "🔧" },
              { label: "AutoPay", icon: "💳" },
              { label: "STR/LTR Switching", icon: "🔄" },
              { label: "Dynamic Pricing", icon: "📈" },
              { label: "Smart Lock Integration", icon: "🔐" },
            ].map((chip) => (
              <span key={chip.label} className="flex items-center gap-1 text-[10px] bg-navy-800/80 border border-navy-600/60 text-gray-300 px-2.5 py-1 rounded-full hover:border-navy-500 hover:text-gray-200 transition-colors">
                <span>{chip.icon}</span>
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.title} className="bg-navy-900/80 border border-navy-700/60 rounded-xl p-4 hover:border-navy-600 transition-colors">
              <div className="mb-2">{f.icon}</div>
              <div className="text-xs font-semibold text-white mb-1">{f.title}</div>
              <div className="text-[11px] text-gray-500 leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>

        {/* Social proof + trust signals */}
        <div className="card py-4 px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {["teal", "blue", "amber", "purple"].map((c, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full bg-${c}-600 border-2 border-navy-800 flex items-center justify-center text-white text-[10px] font-bold`}>
                    {["M","S","J","A"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">200+ independent landlords</p>
                <p className="text-[10px] text-gray-500">managing 1–3,000 units on Pivot</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-400">
              <span className="flex items-center gap-1"><span className="text-yellow-400">★★★★★</span> 4.9/5</span>
              <span className="text-navy-600">·</span>
              <span>Starting at $19/mo</span>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-600">
          Interactive product demo
        </p>
      </div>
    </div>
  );
}

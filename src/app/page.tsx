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
  const [quickLogging, setQuickLogging] = useState<PortalRole | null>(null);

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

  const quickLogins = [
    { role: "admin" as PortalRole,      label: "Platform Admin", short: "PA", from: "from-teal-500",  to: "to-cyan-600",    hover: "hover:border-teal-600/50",   text: "group-hover:text-teal-400" },
    { role: "owner" as PortalRole,      label: "Partner",        short: "PM", from: "from-blue-500",  to: "to-indigo-600",  hover: "hover:border-blue-600/50",   text: "group-hover:text-blue-400" },
    { role: "tenant" as PortalRole,     label: "Tenant",         short: "T",  from: "from-cyan-500",  to: "to-teal-600",    hover: "hover:border-cyan-600/50",   text: "group-hover:text-cyan-400" },
    { role: "contractor" as PortalRole, label: "Contractor",     short: "C",  from: "from-amber-500", to: "to-orange-600",  hover: "hover:border-amber-600/50",  text: "group-hover:text-amber-400" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md">

        {/* Logo & title */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-3">
            <img src="/filter-pros-logo.png" alt="Filter Pros, LLC" className="h-24 w-auto drop-shadow-lg" />
          </div>
          <h1 className="text-xl font-bold text-white">Property Management Platform</h1>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-xs font-semibold text-gray-400">ikigaiOS</span>
            <span className="text-[10px] text-gray-600">|</span>
            <span className="text-xs font-semibold text-gray-400">ScaleOS</span>
          </div>
        </div>

        {/* Quick Login */}
        <div className="mb-2">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2 text-center">Quick Login</p>
          <div className="grid grid-cols-4 gap-2">
            {quickLogins.map((btn) => (
              <button
                key={btn.role}
                onClick={() => handleQuickLogin(btn.role)}
                disabled={!!quickLogging}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border border-navy-700 bg-navy-900 ${btn.hover} hover:bg-navy-800 transition-colors group disabled:opacity-50`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${btn.from} ${btn.to} flex items-center justify-center text-white text-xs font-bold`}>
                  {quickLogging === btn.role ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : btn.short}
                </div>
                <span className={`text-[10px] text-gray-400 ${btn.text} transition-colors text-center leading-tight`}>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-4">
          Demo environment · No real data · No backend required
        </p>
      </div>
    </div>
  );
}

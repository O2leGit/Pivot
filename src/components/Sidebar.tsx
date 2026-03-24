"use client";

import { useState, useEffect } from "react";
import type { PortalRole, DemoUser } from "@/types";
import type { Page } from "./Dashboard";

interface SidebarProps {
  role: PortalRole;
  user: DemoUser;
  currentPage: Page;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const Icon = ({ path, path2 }: { path: string; path2?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    {path2 && <path strokeLinecap="round" strokeLinejoin="round" d={path2} />}
  </svg>
);

const NAV_BY_ROLE: Record<PortalRole, NavItem[]> = {
  tenant: [
    { id: "dashboard", label: "Home", icon: <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: "payments", label: "Payments", icon: <Icon path="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> },
    { id: "maintenance", label: "Maintenance", icon: <Icon path="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /> },
    { id: "lease", label: "Lease", icon: <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
    { id: "messages", label: "Messages", icon: <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
  ],
  owner: [
    { id: "dashboard", label: "Dashboard", icon: <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { id: "properties", label: "Properties", icon: <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: "maintenance", label: "Maintenance", icon: <Icon path="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /> },
    { id: "tenants", label: "Tenants", icon: <Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /> },
    { id: "invoices", label: "Invoices", icon: <Icon path="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" /> },
    { id: "pl", label: "P&L", icon: <Icon path="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /> },
    { id: "messages", label: "Messages", icon: <Icon path="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
  ],
  contractor: [
    { id: "dashboard", label: "Dashboard", icon: <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { id: "jobs", label: "Job Requests", icon: <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
    { id: "schedule", label: "Schedule", icon: <Icon path="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: "completion", label: "Job Completion", icon: <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    { id: "payments", label: "Payments", icon: <Icon path="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /> },
  ],
  admin: [
    { id: "dashboard", label: "Business Dashboard", icon: <Icon path="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { id: "accounts", label: "Accounts", icon: <Icon path="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
    { id: "vetting", label: "Contractor Vetting", icon: <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
    { id: "disputes", label: "Disputes", icon: <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
    { id: "settings", label: "Platform Settings", icon: <Icon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
    { id: "audit-log", label: "Audit Log", icon: <Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /> },
  ],
};

const ROLE_COLORS: Record<PortalRole, string> = {
  tenant: "#0D9488",
  owner: "#3B82F6",
  contractor: "#F59E0B",
  admin: "#8B5CF6",
};

const ROLE_LABELS: Record<PortalRole, string> = {
  tenant: "Tenant",
  owner: "Owner",
  contractor: "Contractor",
  admin: "Admin",
};

export default function Sidebar({ role, user, currentPage, onNavigate, onLogout }: SidebarProps) {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navItems = NAV_BY_ROLE[role];
  const brandColor = ROLE_COLORS[role];

  return (
    <div
      className={`bg-navy-900 border-r border-navy-700 flex flex-col transition-all duration-200 no-print flex-shrink-0 ${expanded ? "w-60" : "w-14"}`}
      onMouseEnter={() => { if (!isMobile) setExpanded(true); }}
      onMouseLeave={() => { if (!isMobile) setExpanded(false); }}
    >
      {/* Logo header */}
      <div className="border-b border-navy-700 flex items-center" style={{ minHeight: "64px" }}>
        {expanded ? (
          <div className="flex items-center gap-2.5 px-3 py-2 w-full overflow-hidden">
            {role !== "admin" ? (
              <img src="/filter-pros-logo.png" alt="Filter Pros" className="h-9 w-auto shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-md" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, #0891B2 100%)` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
            <div className="overflow-hidden min-w-0">
              <div className="text-sm font-bold text-white leading-tight truncate">
                {role !== "admin" ? "Filter Pros, LLC" : "Pivot"}
              </div>
              <div className="text-[10px] text-gray-500">{ROLE_LABELS[role]} Portal</div>
            </div>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-3">
            {role !== "admin" ? (
              <img src="/filter-pros-logo.png" alt="Filter Pros" className="h-8 w-8 object-contain rounded" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md" style={{ background: `linear-gradient(135deg, ${brandColor} 0%, #0891B2 100%)` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Back to portals — always visible */}
      <button
        onClick={onLogout}
        title="Back to portal select"
        className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-gray-400 hover:text-white hover:bg-navy-800 transition-colors border-b border-navy-800 w-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {expanded && <span className="font-medium">Switch Portal</span>}
      </button>

      {/* Nav items */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { onNavigate(item.id); if (isMobile) setExpanded(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors border-r-2 ${
              currentPage === item.id
                ? "bg-navy-800 text-white border-r-[3px]"
                : "text-gray-400 hover:text-gray-200 hover:bg-navy-800/50 border-transparent"
            }`}
            style={currentPage === item.id ? { color: brandColor, borderColor: brandColor } : undefined}
            title={!expanded ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {expanded && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-navy-700 space-y-2">
        {expanded && (
          <div className="mb-1">
            <div className="text-xs font-medium text-white truncate">{user.name}</div>
            <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
          </div>
        )}

        {/* Branding */}
        {expanded && (
          <div className="pt-1 border-t border-navy-800">
            {role === "admin" ? (
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-semibold text-gray-500">ikigaiOS</span>
                <span className="text-[9px] text-gray-700">|</span>
                <span className="text-[10px] font-semibold text-gray-500">ScaleOS</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <img src="/filter-pros-logo.png" alt="Filter Pros" className="h-5 w-auto opacity-70" />
                <div>
                  <p className="text-[9px] text-gray-600 leading-none">Managed by</p>
                  <p className="text-[10px] text-gray-400 font-medium leading-tight">Filter Pros, LLC</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

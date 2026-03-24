"use client";

import type { PortalRole } from "@/types";
import type { Page } from "./Dashboard";

interface Props {
  role: PortalRole;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onOpenChat: () => void;
}

const TENANT_TABS = [
  {
    id: "dashboard" as Page, label: "Home",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-teal-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "payments" as Page, label: "Payments",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-teal-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: "maintenance" as Page, label: "Requests",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-teal-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "messages" as Page, label: "Messages",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-teal-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

const CONTRACTOR_TABS = [
  {
    id: "dashboard" as Page, label: "Home",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-amber-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "jobs" as Page, label: "Jobs",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-amber-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    id: "schedule" as Page, label: "Schedule",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-amber-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "completion" as Page, label: "Complete",
    icon: (active: boolean) => (
      <svg className={`w-6 h-6 ${active ? "text-amber-400" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2.5 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function MobileNav({ role, currentPage, onNavigate, onOpenChat }: Props) {
  const tabs = role === "tenant" ? TENANT_TABS : CONTRACTOR_TABS;
  const activeColor = role === "tenant" ? "text-teal-400" : "text-amber-400";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-navy-900/95 backdrop-blur-md border-t border-navy-700 z-40 safe-area-bottom">
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const active = currentPage === tab.id ||
            (tab.id === "jobs" && ["jobs", "schedule", "completion"].includes(currentPage) && role === "contractor");
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] transition-colors ${
                active ? "bg-navy-800/60" : "hover:bg-navy-800/30"
              }`}
            >
              {tab.icon(active)}
              <span className={`text-[10px] font-medium ${active ? activeColor : "text-gray-500"}`}>{tab.label}</span>
            </button>
          );
        })}
        {/* AI Chat shortcut */}
        <button
          onClick={onOpenChat}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] hover:bg-navy-800/30 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-[10px] font-medium text-gray-500">AI Chat</span>
        </button>
      </div>
    </nav>
  );
}

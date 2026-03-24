"use client";

import { useState } from "react";
import type { PortalRole, DemoUser } from "@/types";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import ChatPanel from "./ChatPanel";
import DashboardHome from "./DashboardHome";
import PropertiesPage from "./PropertiesPage";
import MaintenancePage from "./MaintenancePage";
import PaymentsPage from "./PaymentsPage";
import TenantsPage from "./TenantsPage";
import InvoicesPage from "./InvoicesPage";
import PLPage from "./PLPage";
import ContractorJobsPage from "./ContractorJobsPage";
import AdminDashboard from "./AdminDashboard";
import DisputesPage from "./DisputesPage";
import AuditLogPage from "./AuditLogPage";
import SettingsPage from "./SettingsPage";
import LeasePage from "./LeasePage";
import MessagesPage from "./MessagesPage";
import FeaturesPage from "./FeaturesPage";

interface DashboardProps {
  role: PortalRole;
  user: DemoUser;
  onLogout: () => void;
  onLoginAs?: (role: PortalRole) => void;
}

export type Page =
  | "dashboard" | "maintenance" | "payments" | "messages"
  | "lease"
  | "properties" | "tenants" | "invoices" | "pl"
  | "jobs" | "schedule" | "completion"
  | "accounts" | "vetting" | "disputes" | "settings" | "audit-log"
  | "features";

const MOBILE_NAV_ROLES: PortalRole[] = ["tenant", "contractor"];

export default function Dashboard({ role, user, onLogout, onLoginAs }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleOpenChat = (message?: string) => {
    if (message) setChatInitialMessage(message);
    setChatOpen(true);
  };

  const hasMobileNav = MOBILE_NAV_ROLES.includes(role);

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardHome role={role} user={user} onNavigate={(p) => setCurrentPage(p as Page)} onOpenChat={handleOpenChat} showToast={showToast} onLoginAs={onLoginAs} />;
      case "properties":
        return <PropertiesPage role={role} onNavigate={(p) => setCurrentPage(p as Page)} showToast={showToast} />;
      case "maintenance":
        return <MaintenancePage role={role} user={user} onOpenChat={handleOpenChat} showToast={showToast} />;
      case "payments":
        return <PaymentsPage role={role} user={user} showToast={showToast} />;
      case "tenants":
        return <TenantsPage onOpenChat={handleOpenChat} showToast={showToast} />;
      case "invoices":
        return <InvoicesPage showToast={showToast} />;
      case "pl":
        return <PLPage />;
      case "jobs":
      case "schedule":
      case "completion":
        return <ContractorJobsPage user={user} currentTab={currentPage as "jobs" | "schedule" | "completion"} onNavigate={(p) => setCurrentPage(p as Page)} showToast={showToast} />;
      case "lease":
        return <LeasePage user={user} showToast={showToast} />;
      case "messages":
        return <MessagesPage user={user} role={role} />;
      case "accounts":
      case "vetting":
        return <AdminDashboard currentTab={currentPage as "accounts" | "vetting"} onNavigate={(p) => setCurrentPage(p as Page)} showToast={showToast} />;
      case "disputes":
        return <DisputesPage showToast={showToast} />;
      case "audit-log":
        return <AuditLogPage />;
      case "settings":
        return <SettingsPage showToast={showToast} />;
      case "features":
        return <FeaturesPage />;
      default:
        return <DashboardHome role={role} user={user} onNavigate={(p) => setCurrentPage(p as Page)} onOpenChat={handleOpenChat} showToast={showToast} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — hidden on mobile for tenant/contractor */}
      <div className={hasMobileNav ? "hidden md:block" : ""}>
        <Sidebar
          role={role}
          user={user}
          currentPage={currentPage}
          onNavigate={(p) => setCurrentPage(p as Page)}
          onLogout={onLogout}
        />
      </div>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-200 ${chatOpen ? "md:mr-[380px]" : ""}`}>
        <div className={`p-4 md:p-6 max-w-7xl mx-auto ${hasMobileNav ? "pb-24 md:pb-6" : ""}`}>
          {renderPage()}
        </div>
      </main>

      {/* Mobile bottom nav — tenant + contractor only */}
      {hasMobileNav && (
        <MobileNav
          role={role}
          currentPage={currentPage}
          onNavigate={(p) => setCurrentPage(p as Page)}
          onOpenChat={() => setChatOpen(true)}
        />
      )}

      {/* AI chat toggle button — hidden on mobile when bottom nav present */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className={`fixed right-4 bottom-4 text-white rounded-full shadow-lg z-50 transition-all flex items-center gap-2 px-4 py-3 hover:scale-105 animate-ai-pulse ${hasMobileNav ? "hidden md:flex" : "flex"}`}
          style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}
          title="Ask Pivot AI"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span className="text-sm font-medium">Ask Pivot AI</span>
        </button>
      )}

      {/* Chat panel — full-screen overlay on mobile, side panel on desktop */}
      {chatOpen && (
        <ChatPanel
          role={role}
          user={user}
          currentPage={currentPage}
          initialMessage={chatInitialMessage}
          onInitialMessageSent={() => setChatInitialMessage(undefined)}
          onClose={() => setChatOpen(false)}
          onNavigate={(p) => setCurrentPage(p as Page)}
        />
      )}

      {/* Toast notifications */}
      <div className={`fixed z-[100] flex flex-col gap-2 pointer-events-none ${hasMobileNav ? "bottom-20 right-4 md:bottom-6 md:right-6" : "bottom-6 right-6"}`}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg text-sm font-medium border animate-slide-in-right ${
              toast.type === "success"
                ? "bg-green-900/90 text-green-200 border-green-700"
                : "bg-red-900/90 text-red-200 border-red-700"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-400 shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-400 shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )}
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

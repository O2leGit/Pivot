"use client";

import { useState, useEffect } from "react";
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
  tourActive?: boolean;
  onTourEnd?: () => void;
}

// Guided tour steps for Owner portal
const TOUR_STEPS = [
  {
    title: "Portfolio Overview",
    icon: "📊",
    desc: "Your dashboard shows real-time KPIs: monthly revenue, occupancy rate, maintenance alerts, and overdue rent — all in one glance.",
    hint: "Tip: Click any KPI card to drill into details.",
  },
  {
    title: "AI Maintenance Triage",
    icon: "🔧",
    desc: "Tenants submit requests with photos. Pivot AI classifies urgency, estimates repair cost, and routes to the right contractor — before you see it.",
    hint: "Navigate to Maintenance to see active requests.",
  },
  {
    title: "Properties & Mode Switching",
    icon: "🔄",
    desc: "Toggle any property between STR and LTR mode with a single click. Set seasonal schedules to automate transitions.",
    hint: "Click any property card to see units, IoT devices, and mode controls.",
  },
  {
    title: "P&L Dashboard",
    icon: "💰",
    desc: "Per-property profit & loss with 6-month trends and one-click CSV export for your accountant.",
    hint: "Navigate to P&L to see revenue vs. expenses by property.",
  },
  {
    title: "Ask Pivot AI",
    icon: "🤖",
    desc: "Your AI assistant knows your entire portfolio. Ask anything: 'What's my occupancy?', 'Which units are overdue?', 'Estimate repair cost for Unit 102'.",
    hint: "Click the Ask Pivot AI button (bottom-right) anytime.",
  },
];

export type Page =
  | "dashboard" | "maintenance" | "payments" | "messages"
  | "lease"
  | "properties" | "tenants" | "invoices" | "pl"
  | "jobs" | "schedule" | "completion"
  | "accounts" | "vetting" | "disputes" | "settings" | "audit-log"
  | "features";

const MOBILE_NAV_ROLES: PortalRole[] = ["tenant", "contractor"];

function PageSkeleton() {
  return (
    <div className="space-y-6 page-skeleton">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-4 w-72 rounded" />
        </div>
        <div className="skeleton h-9 w-24 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="skeleton h-56 rounded-xl md:col-span-2" />
        <div className="skeleton h-56 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="skeleton h-40 rounded-xl" />
        <div className="skeleton h-40 rounded-xl" />
      </div>
    </div>
  );
}

export default function Dashboard({ role, user, onLogout, onLoginAs, tourActive = false, onTourEnd }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);
  const [tourStep, setTourStep] = useState(0);
  const [showTour, setShowTour] = useState(tourActive);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => { setShowTour(tourActive); setTourStep(0); }, [tourActive]);

  // Dynamic browser tab title per portal
  const PORTAL_TITLES: Record<string, string> = {
    tenant: "Pivot | Tenant Portal",
    owner: "Pivot | Owner Portal",
    contractor: "Pivot | Contractor Portal",
    admin: "Pivot | Admin Portal",
  };
  useEffect(() => {
    document.title = PORTAL_TITLES[role] ?? "Pivot | Property Management Platform";
    return () => { document.title = "Pivot | Property Management Platform"; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const navigateTo = (page: string) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(page as Page);
      setPageLoading(false);
    }, 180);
  };

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
        return <DashboardHome role={role} user={user} onNavigate={navigateTo} onOpenChat={handleOpenChat} showToast={showToast} onLoginAs={onLoginAs} />;
      case "properties":
        return <PropertiesPage role={role} onNavigate={navigateTo} showToast={showToast} />;
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
        return <ContractorJobsPage user={user} currentTab={currentPage as "jobs" | "schedule" | "completion"} onNavigate={navigateTo} showToast={showToast} />;
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
        return <DashboardHome role={role} user={user} onNavigate={navigateTo} onOpenChat={handleOpenChat} showToast={showToast} />;
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
          onNavigate={navigateTo}
          onLogout={onLogout}
        />
      </div>

      {/* Main content */}
      <main className={`flex-1 overflow-y-auto transition-all duration-200 ${chatOpen ? "md:mr-[380px]" : ""}`}>
        <div className={`p-4 md:p-6 max-w-7xl mx-auto ${hasMobileNav ? "pb-24 md:pb-6" : ""}`}>
          {pageLoading ? <PageSkeleton /> : renderPage()}
        </div>
      </main>

      {/* Mobile bottom nav — tenant + contractor only */}
      {hasMobileNav && (
        <MobileNav
          role={role}
          currentPage={currentPage}
          onNavigate={navigateTo}
          onOpenChat={() => setChatOpen(true)}
        />
      )}

      {/* AI chat toggle button — hidden on mobile when bottom nav present */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className={`fixed right-5 bottom-6 text-white rounded-full shadow-xl shadow-black/30 z-50 transition-all flex items-center gap-2 px-4 py-3 hover:scale-105 hover:shadow-teal-900/50 animate-ai-pulse ${hasMobileNav ? "hidden md:flex" : "flex"}`}
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
          onNavigate={navigateTo}
        />
      )}

      {/* Guided Tour Overlay */}
      {showTour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-navy-800 border border-navy-600 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
            {/* Progress dots */}
            <div className="flex items-center justify-center gap-1.5 pt-5 pb-1">
              {TOUR_STEPS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === tourStep ? "w-6 bg-teal-500" : i < tourStep ? "w-2 bg-teal-700" : "w-2 bg-navy-600"}`} />
              ))}
            </div>
            <div className="p-6">
              <div className="text-4xl mb-3">{TOUR_STEPS[tourStep].icon}</div>
              <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
                Step {tourStep + 1} of {TOUR_STEPS.length}
              </div>
              <h2 className="text-lg font-bold text-white mb-2">{TOUR_STEPS[tourStep].title}</h2>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">{TOUR_STEPS[tourStep].desc}</p>
              <div className="flex items-center gap-1.5 p-2.5 bg-navy-900/60 border border-navy-700 rounded-lg">
                <svg className="w-3.5 h-3.5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-400">{TOUR_STEPS[tourStep].hint}</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 pb-5 gap-3">
              <button
                onClick={() => { setShowTour(false); onTourEnd?.(); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2">
                {tourStep > 0 && (
                  <button
                    onClick={() => setTourStep(s => s - 1)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    ← Back
                  </button>
                )}
                {tourStep < TOUR_STEPS.length - 1 ? (
                  <button
                    onClick={() => setTourStep(s => s + 1)}
                    className="btn-primary text-sm px-5 py-2"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => { setShowTour(false); onTourEnd?.(); }}
                    className="btn-primary text-sm px-5 py-2"
                  >
                    Start Exploring ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
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

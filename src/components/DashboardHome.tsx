"use client";

import type { PortalRole, DemoUser } from "@/types";
import type { Page } from "./Dashboard";
import TenantDashboard from "./dashboards/TenantDashboard";
import OwnerDashboard from "./dashboards/OwnerDashboard";
import ContractorDashboard from "./dashboards/ContractorDashboard";
import AdminDashboardHome from "./dashboards/AdminDashboardHome";

interface DashboardHomeProps {
  role: PortalRole;
  user: DemoUser;
  onNavigate: (page: Page) => void;
  onOpenChat: (message?: string) => void;
  showToast: (message: string, type?: "success" | "error") => void;
  onLoginAs?: (role: PortalRole) => void;
}

export default function DashboardHome({ role, user, onNavigate, onOpenChat, showToast, onLoginAs }: DashboardHomeProps) {
  switch (role) {
    case "tenant":
      return <TenantDashboard user={user} onNavigate={onNavigate} onOpenChat={onOpenChat} showToast={showToast} />;
    case "owner":
      return <OwnerDashboard user={user} onNavigate={onNavigate} onOpenChat={onOpenChat} onLoginAs={onLoginAs} />;
    case "contractor":
      return <ContractorDashboard user={user} onNavigate={onNavigate} />;
    case "admin":
      return <AdminDashboardHome onNavigate={onNavigate} onLoginAs={onLoginAs} />;
    default:
      return null;
  }
}

"use client";

import type { DemoUser } from "@/types";
import type { Page } from "../Dashboard";
import { TENANTS, PAYMENTS, MAINTENANCE_REQUESTS, MESSAGE_THREADS } from "@/data/demoData";

interface Props {
  user: DemoUser;
  onNavigate: (page: Page) => void;
  onOpenChat: (msg?: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function TenantDashboard({ user, onNavigate, showToast }: Props) {
  const tenant = TENANTS.find((t) => t.id === user.entityId)!;
  const upcoming = PAYMENTS.find((p) => p.tenantId === tenant.id && p.status === "pending");
  const myRequests = MAINTENANCE_REQUESTS.filter((r) => r.tenantId === tenant.id).slice(0, 4);
  const threads = MESSAGE_THREADS.filter((t) => t.participantIds.includes(tenant.id));
  const unreadCount = threads.reduce((s, t) => s + t.unreadCount, 0);

  const daysUntilDue = upcoming
    ? Math.ceil((new Date(upcoming.dueDate).getTime() - Date.now()) / 86400000)
    : null;

  const urgencyColor: Record<string, string> = {
    emergency: "text-red-400",
    high: "text-amber-400",
    medium: "text-blue-400",
    low: "text-gray-400",
  };
  const statusBadge: Record<string, string> = {
    open: "badge-amber",
    triaged: "badge-blue",
    assigned: "badge-blue",
    in_progress: "badge-teal",
    pending_approval: "badge-amber",
    completed: "badge-green",
    cancelled: "badge-gray",
  };
  const statusLabel: Record<string, string> = {
    open: "Open",
    triaged: "Triaged",
    assigned: "Assigned",
    in_progress: "In Progress",
    pending_approval: "Pending Approval",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-white">Good morning, {tenant.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">Unit 101 · The Harlow Apartments · 2840 Market St, SF</p>
      </div>

      {/* Rent Hero Card */}
      <div className={`rounded-2xl p-6 relative overflow-hidden ${
        daysUntilDue !== null && daysUntilDue <= 3
          ? "bg-gradient-to-br from-amber-900/50 to-navy-800 border border-amber-700/50"
          : tenant.paymentStatus === "overdue"
          ? "bg-gradient-to-br from-red-900/50 to-navy-800 border border-red-700/50"
          : "bg-gradient-to-br from-teal-900/40 to-navy-800 border border-teal-700/40"
      }`}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-teal-400" />
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-blue-400" />
        </div>
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              {tenant.paymentStatus === "paid" ? "Last Payment" : "Rent Due"}
            </p>
            <div className="text-4xl font-bold text-white mb-1">
              ${upcoming?.amount.toLocaleString() ?? tenant.rentAmount.toLocaleString()}
            </div>
            {upcoming && (
              <p className="text-sm text-gray-300">
                Due {new Date(upcoming.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                {daysUntilDue !== null && (
                  <span className={`ml-2 font-medium ${daysUntilDue <= 3 ? "text-amber-400" : "text-teal-400"}`}>
                    ({daysUntilDue > 0 ? `${daysUntilDue} days away` : "Due today!"})
                  </span>
                )}
              </p>
            )}
            {tenant.paymentStatus === "paid" && !upcoming && (
              <p className="text-sm text-green-400 font-medium flex items-center gap-1.5 mt-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                All paid · AutoPay active
              </p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => { onNavigate("payments"); showToast("Redirecting to payments…"); }}
                className="btn-primary px-5 py-2 text-sm rounded-lg"
              >
                Pay Now
              </button>
              <button
                onClick={() => onNavigate("payments")}
                className="btn-secondary px-4 py-2 text-sm rounded-lg"
              >
                View History
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs text-gray-500">AutoPay</p>
              <p className={`text-sm font-semibold ${tenant.autoPayEnabled ? "text-green-400" : "text-gray-400"}`}>
                {tenant.autoPayEnabled ? "✓ Enabled" : "Off"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Balance</p>
              <p className={`text-sm font-semibold ${tenant.balance > 0 ? "text-amber-400" : "text-green-400"}`}>
                {tenant.balance > 0 ? `-$${tenant.balance.toLocaleString()}` : "$0.00"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("maintenance")}>
          <div className="kpi-label">Open Requests</div>
          <div className="kpi-value">{myRequests.filter(r => r.status !== "completed").length}</div>
          <div className="text-xs text-gray-500">maintenance</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("messages")}>
          <div className="kpi-label">Messages</div>
          <div className="kpi-value">{unreadCount > 0 ? <span className="text-amber-400">{unreadCount}</span> : 0}</div>
          <div className="text-xs text-gray-500">{unreadCount > 0 ? "unread" : "all read"}</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("lease")}>
          <div className="kpi-label">Lease Ends</div>
          <div className="text-lg font-bold text-white">Aug 31</div>
          <div className="text-xs text-gray-500">2026</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Monthly Rent</div>
          <div className="kpi-value">${tenant.rentAmount.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Unit 101</div>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Requests */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Maintenance Requests</h2>
            <button onClick={() => onNavigate("maintenance")} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
              View all →
            </button>
          </div>
          {myRequests.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {myRequests.map((req) => (
                <div key={req.id} className="flex items-start gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50">
                  <div className={`mt-0.5 ${urgencyColor[req.urgency]}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium truncate">{req.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(req.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {req.scheduledDate && (
                        <span className="ml-2 text-teal-400">Scheduled {req.scheduledDate}</span>
                      )}
                    </p>
                  </div>
                  <span className={statusBadge[req.status]}>{statusLabel[req.status]}</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => onNavigate("maintenance")}
            className="mt-4 w-full py-2 text-sm border border-dashed border-navy-600 text-gray-400 hover:text-gray-200 hover:border-navy-500 rounded-lg transition-colors"
          >
            + Submit new request
          </button>
        </div>

        {/* Recent Messages */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
            <button onClick={() => onNavigate("messages")} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
              View all →
            </button>
          </div>
          {threads.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => onNavigate("messages")}
                  className="p-3 bg-navy-900/50 rounded-lg border border-navy-700/50 cursor-pointer hover:border-navy-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium truncate ${thread.unreadCount > 0 ? "text-white" : "text-gray-300"}`}>
                      {thread.subject}
                    </p>
                    {thread.unreadCount > 0 && (
                      <span className="badge-teal shrink-0">{thread.unreadCount}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{thread.lastMessage}</p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    {new Date(thread.lastMessageAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

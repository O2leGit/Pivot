"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { PortalRole } from "@/types";
import type { Page } from "../Dashboard";
import { ADMIN_METRICS, ADMIN_MRR_TREND, DISPUTES, MAINTENANCE_REQUESTS, ACCOUNT_RECORDS, IOT_EVENTS } from "@/data/demoData";

interface Props {
  onNavigate: (page: Page) => void;
  onLoginAs?: (role: PortalRole) => void;
}

const CHART_COLORS = { teal: "#0D9488", purple: "#8B5CF6", amber: "#F59E0B", red: "#EF4444" };

export default function AdminDashboardHome({ onNavigate, onLoginAs }: Props) {
  const openDisputes = DISPUTES.filter((d) => d.status !== "resolved").length;
  const openMaintenance = MAINTENANCE_REQUESTS.filter((r) => !["completed", "cancelled"].includes(r.status)).length;
  const criticalIoT = IOT_EVENTS.filter((e) => !e.resolved && e.severity === "critical").length;

  const accountsByPlan = [
    { plan: "Starter", count: ACCOUNT_RECORDS.filter(a => a.plan === "Starter").length },
    { plan: "Pro",     count: ACCOUNT_RECORDS.filter(a => a.plan === "Pro").length },
    { plan: "Enterprise", count: ACCOUNT_RECORDS.filter(a => a.plan === "Enterprise").length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Business Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Platform overview · March 2026</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="kpi-label">MRR</div>
          <div className="kpi-value">${ADMIN_METRICS.mrr.toLocaleString()}</div>
          <div className="kpi-delta-up">↑ {ADMIN_METRICS.mrrGrowth}% MoM</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Fees MTD</div>
          <div className="kpi-value">${ADMIN_METRICS.feesCollectedMTD.toLocaleString()}</div>
          <div className="text-xs text-gray-500">platform fees</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("accounts")}>
          <div className="kpi-label">Active Accounts</div>
          <div className="kpi-value">{ADMIN_METRICS.activeAccounts}</div>
          <div className="text-xs text-gray-500">{ADMIN_METRICS.totalUnits} total units</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("disputes")}>
          <div className="kpi-label">Open Disputes</div>
          <div className="kpi-value text-amber-400">{openDisputes}</div>
          <div className="text-xs text-amber-400/70">need review</div>
        </div>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Open Maintenance", value: openMaintenance, color: "text-blue-400", nav: "dashboard" },
          { label: "Pending Applications", value: ADMIN_METRICS.pendingApplications, color: "text-amber-400", nav: "vetting" },
          { label: "Critical IoT Alerts", value: criticalIoT, color: "text-red-400", nav: "dashboard" },
          { label: "Contractors Pending", value: ADMIN_METRICS.contractorsPending, color: "text-purple-400", nav: "vetting" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-navy-800/50 rounded-xl border border-navy-700 p-4 cursor-pointer hover:border-navy-600 transition-colors"
            onClick={() => onNavigate(kpi.nav as Page)}
          >
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</div>
            <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* MRR trend */}
        <div className="card md:col-span-2">
          <h2 className="text-sm font-semibold text-white mb-4">MRR Growth (6 months)</h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={ADMIN_MRR_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27426c" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "#1B2A4A", border: "1px solid #27426c", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "MRR"]}
              />
              <Area type="monotone" dataKey="mrr" stroke={CHART_COLORS.purple} fill={CHART_COLORS.purple} fillOpacity={0.15} strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Accounts by plan */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Accounts by Plan</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={accountsByPlan} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27426c" vertical={false} />
              <XAxis dataKey="plan" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#1B2A4A", border: "1px solid #27426c", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [v, "Accounts"]}
              />
              <Bar dataKey="count" fill={CHART_COLORS.teal} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Open disputes */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Open Disputes</h2>
            <button onClick={() => onNavigate("disputes")} className="text-xs text-teal-400 hover:text-teal-300">Manage →</button>
          </div>
          <div className="space-y-2">
            {DISPUTES.filter(d => d.status !== "resolved").map((d) => (
              <div key={d.id} className="flex items-start gap-2 p-2.5 bg-navy-900/50 rounded-lg border border-navy-700/50">
                <div className={`mt-0.5 shrink-0 ${d.status === "under_review" ? "text-amber-400" : "text-red-400"}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{d.description}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{d.openedBy} · {d.amount ? `$${d.amount.toLocaleString()}` : ""}</p>
                </div>
                <span className={`badge shrink-0 ${d.status === "open" ? "badge-red" : "badge-amber"}`}>
                  {d.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Access */}
        {onLoginAs && (
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-white">Login As Client</h2>
              <span className="text-[10px] text-gray-500 bg-navy-900 border border-navy-700 rounded-full px-2 py-0.5">Full visibility</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Marcus Rivera", sub: "Partner · 3 properties", role: "owner" as PortalRole, initials: "MR", color: "from-blue-500 to-indigo-600", badge: "bg-blue-900/40 text-blue-300 border-blue-700/40 hover:bg-blue-900/70" },
                { label: "Sarah Chen", sub: "Tenant · Harlow Apt Unit 101", role: "tenant" as PortalRole, initials: "SC", color: "from-teal-600 to-cyan-600", badge: "bg-teal-900/40 text-teal-300 border-teal-700/40 hover:bg-teal-900/70" },
                { label: "Jake Torres", sub: "Contractor · Plumber", role: "contractor" as PortalRole, initials: "JT", color: "from-amber-500 to-orange-600", badge: "bg-amber-900/40 text-amber-300 border-amber-700/40 hover:bg-amber-900/70" },
              ].map((c) => (
                <div key={c.role} className="flex items-center gap-2.5 p-2.5 bg-navy-900/50 rounded-lg border border-navy-700/50">
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{c.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200">{c.label}</p>
                    <p className="text-[10px] text-gray-500">{c.sub}</p>
                  </div>
                  <button onClick={() => onLoginAs(c.role)} className={`text-[10px] px-2 py-1 rounded-md border transition-colors shrink-0 ${c.badge}`}>
                    Login As →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IoT Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">IoT Alerts</h2>
            <span className="badge-red">{IOT_EVENTS.filter(e => !e.resolved).length} unresolved</span>
          </div>
          <div className="space-y-2">
            {IOT_EVENTS.filter(e => !e.resolved).map((evt) => (
              <div key={evt.id} className="flex items-start gap-2 p-2.5 bg-navy-900/50 rounded-lg border border-navy-700/50">
                <div className={`mt-0.5 shrink-0 ${evt.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-200 truncate">{evt.description}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {new Date(evt.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} · {evt.deviceType.replace("_", " ")}
                  </p>
                </div>
                <span className={`badge shrink-0 ${evt.severity === "critical" ? "badge-red" : "badge-amber"}`}>
                  {evt.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

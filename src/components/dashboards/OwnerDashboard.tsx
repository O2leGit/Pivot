"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { DemoUser } from "@/types";
import type { Page } from "../Dashboard";
import { PROPERTIES, MAINTENANCE_REQUESTS, TENANTS, PL_DATA_P1, PL_DATA_P2, PL_DATA_P3 } from "@/data/demoData";

interface Props {
  user: DemoUser;
  onNavigate: (page: Page) => void;
  onOpenChat: (msg?: string) => void;
}

const CHART_COLORS = { teal: "#0D9488", blue: "#3B82F6", amber: "#F59E0B", red: "#EF4444" };

export default function OwnerDashboard({ onNavigate, onOpenChat }: Props) {
  const properties = PROPERTIES.filter((p) => p.ownerId === "o-1");
  const allUnits = properties.reduce((s, p) => s + p.totalUnits, 0);
  const occupiedUnits = properties.reduce((s, p) => s + p.occupiedUnits, 0);
  const occupancyPct = Math.round((occupiedUnits / allUnits) * 100);
  const vacancyPct = 100 - occupancyPct;

  // MRR from all LTR + STR
  const monthlyRevenue = properties.reduce((s, p) => s + p.monthlyRevenue + p.strRevenueMTD, 0);

  const pendingApprovals = MAINTENANCE_REQUESTS.filter((r) => r.status === "pending_approval").length;
  const openMaintenance = MAINTENANCE_REQUESTS.filter((r) => !["completed", "cancelled"].includes(r.status)).length;
  const overdueTenantsCount = TENANTS.filter((t) => t.paymentStatus === "overdue").length;

  // Revenue trend (last 6 months, aggregated across properties)
  const revenueTrend = PL_DATA_P1.map((entry, i) => ({
    month: entry.month,
    revenue: entry.rentIncome + entry.strIncome + PL_DATA_P2[i].strIncome + PL_DATA_P3[i].rentIncome + PL_DATA_P3[i].strIncome,
    expenses: entry.maintenanceCost + entry.platformFees + PL_DATA_P2[i].maintenanceCost + PL_DATA_P2[i].platformFees + PL_DATA_P3[i].maintenanceCost + PL_DATA_P3[i].platformFees,
  }));

  const occupancyData = [
    { name: "Occupied", value: occupiedUnits },
    { name: "Vacant", value: allUnits - occupiedUnits },
  ];

  const modeBadge: Record<string, string> = {
    LTR: "badge-blue",
    STR: "badge-teal",
    mixed: "badge-amber",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Portfolio Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">Marcus Rivera · 3 properties · {allUnits} units</p>
        </div>
        <button
          onClick={() => onOpenChat("What's my portfolio occupancy rate?")}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Ask AI
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="kpi-label">Monthly Revenue</div>
          <div className="kpi-value">${monthlyRevenue.toLocaleString()}</div>
          <div className="kpi-delta-up">↑ 8.2% vs last mo.</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Occupancy</div>
          <div className="kpi-value">{occupancyPct}%</div>
          <div className="text-xs text-gray-500">{occupiedUnits}/{allUnits} units</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("maintenance")}>
          <div className="kpi-label">Maintenance</div>
          <div className="kpi-value">
            {pendingApprovals > 0 ? <span className="text-amber-400">{pendingApprovals}</span> : openMaintenance}
          </div>
          <div className="text-xs text-amber-400/80">{pendingApprovals > 0 ? "need approval" : "open"}</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("tenants")}>
          <div className="kpi-label">Overdue Rent</div>
          <div className="kpi-value">{overdueTenantsCount > 0 ? <span className="text-red-400">{overdueTenantsCount}</span> : 0}</div>
          <div className="text-xs text-gray-500">tenants</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="card md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Revenue vs Expenses (6 months)</h2>
            <span className="badge-teal">All Properties</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueTrend} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.teal} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={CHART_COLORS.teal} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.red} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={CHART_COLORS.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27426c" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1B2A4A", border: "1px solid #27426c", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#e5e7eb" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
              />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.teal} fill="url(#rev)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke={CHART_COLORS.red} fill="url(#exp)" strokeWidth={2} name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-end">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-teal-500" /><span className="text-xs text-gray-400">Revenue</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-red-500" /><span className="text-xs text-gray-400">Expenses</span></div>
          </div>
        </div>

        {/* Occupancy donut */}
        <div className="card flex flex-col items-center">
          <h2 className="text-sm font-semibold text-white mb-2 self-start">Occupancy</h2>
          <div className="relative">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={occupancyData} cx={75} cy={75} innerRadius={48} outerRadius={68} dataKey="value" strokeWidth={0}>
                  <Cell fill={CHART_COLORS.teal} />
                  <Cell fill="#27426c" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{occupancyPct}%</span>
              <span className="text-[11px] text-gray-400">occupied</span>
            </div>
          </div>
          <div className="mt-2 space-y-1.5 w-full">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Occupied</span>
              <span className="text-white font-medium">{occupiedUnits} units</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Vacant</span>
              <span className="text-amber-400 font-medium">{allUnits - occupiedUnits} units</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Vacancy rate</span>
              <span className="text-gray-300 font-medium">{vacancyPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Properties</h2>
          <button onClick={() => onNavigate("properties")} className="text-xs text-teal-400 hover:text-teal-300">
            Manage properties →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onNavigate("properties")}
              className="card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl">{prop.coverImage}</div>
                <span className={modeBadge[prop.mode]}>{prop.mode}</span>
              </div>
              <div className="font-semibold text-white text-sm mb-0.5">{prop.name}</div>
              <div className="text-xs text-gray-500 mb-3">{prop.city}, {prop.state}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Units</p>
                  <p className="text-gray-200 font-medium">{prop.occupiedUnits}/{prop.totalUnits}</p>
                </div>
                <div>
                  <p className="text-gray-500">Revenue</p>
                  <p className="text-gray-200 font-medium">
                    ${(prop.monthlyRevenue + prop.strRevenueMTD).toLocaleString()}
                    <span className="text-gray-500">/mo</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Approvals alert */}
      {pendingApprovals > 0 && (
        <div
          onClick={() => onNavigate("maintenance")}
          className="flex items-center gap-3 p-4 bg-amber-900/20 border border-amber-700/40 rounded-xl cursor-pointer hover:bg-amber-900/30 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-300">{pendingApprovals} maintenance request{pendingApprovals > 1 ? "s" : ""} need your approval</p>
            <p className="text-xs text-gray-400 mt-0.5">Review contractor estimates and approve to unblock repairs</p>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </div>
  );
}

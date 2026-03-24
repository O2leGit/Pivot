"use client";

import type { DemoUser } from "@/types";
import type { Page } from "../Dashboard";
import { CONTRACTORS, CONTRACTOR_JOBS, INVOICES } from "@/data/demoData";

interface Props {
  user: DemoUser;
  onNavigate: (page: Page) => void;
}

// Mock drive times for demo
const DRIVE_TIMES: Record<string, string> = {
  "cj-1": "~12 min",
  "cj-2": "~18 min",
  "cj-3": "~7 min",
  "cj-4": "~25 min",
  "cj-5": "~15 min",
};

export default function ContractorDashboard({ user, onNavigate }: Props) {
  const contractor = CONTRACTORS.find((c) => c.id === user.entityId)!;
  const myJobs = CONTRACTOR_JOBS.filter((j) => j.status !== "completed" && j.status !== "cancelled");
  const completedJobs = CONTRACTOR_JOBS.filter((j) => j.status === "completed");
  const completedThisWeek = completedJobs.length;
  const pendingPay = INVOICES.filter((i) => i.contractorId === user.entityId && ["pending", "approved"].includes(i.status));
  const pendingPayTotal = pendingPay.reduce((s, i) => s + i.amount, 0);
  const openJobs = myJobs.filter((j) => j.status === "open").length;

  // Earnings stats
  const paidInvoices = INVOICES.filter((i) => i.contractorId === user.entityId && i.status === "paid");
  const totalEarnedMonth = paidInvoices.reduce((s, i) => s + i.amount, 0) + 840; // mock YTD boost
  const avgPerJob = completedThisWeek > 0 ? Math.round((totalEarnedMonth) / Math.max(completedThisWeek, 1)) : 0;
  const isPreferred = contractor.rating >= 4.8;

  const urgencyBadge: Record<string, string> = {
    emergency: "badge-red",
    high: "badge-amber",
    medium: "badge-blue",
    low: "badge-gray",
  };

  const statusBadge: Record<string, string> = {
    open: "badge-amber",
    accepted: "badge-blue",
    in_progress: "badge-teal",
    completed: "badge-green",
    cancelled: "badge-gray",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-white">Welcome back, {contractor.name.split(" ")[0]}</h1>
            {isPreferred && (
              <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full px-2 py-0.5">
                ⭐ Preferred Contractor
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            {contractor.specialty.join(", ")} · ⭐ {contractor.rating} rating · {contractor.completedJobs} lifetime jobs
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
          contractor.status === "available" ? "bg-green-900/40 text-green-400 border-green-700/50" :
          contractor.status === "busy" ? "bg-amber-900/40 text-amber-400 border-amber-700/50" :
          "bg-gray-800 text-gray-400 border-gray-700"
        }`}>
          {contractor.status === "available" ? "● Available" : contractor.status === "busy" ? "● Busy" : "● Offline"}
        </div>
      </div>

      {/* Earnings dashboard */}
      <div className="card bg-gradient-to-br from-amber-950/20 to-navy-800 border-amber-700/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Earnings This Month</h2>
          <span className="text-xs text-amber-400 bg-amber-900/30 border border-amber-700/40 rounded-full px-2.5 py-1">March 2026</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-amber-300">${totalEarnedMonth.toLocaleString()}</p>
            <p className="text-[11px] text-green-400 mt-0.5">↑ 18% vs last month</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Avg. Per Job</p>
            <p className="text-2xl font-bold text-white">${avgPerJob}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">this month</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Jobs Completed</p>
            <p className="text-2xl font-bold text-white">{completedThisWeek}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">this month</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Your Rating</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-white">{contractor.rating}</p>
              <span className="text-yellow-400 text-sm">★</span>
            </div>
            <div className="flex gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.round(contractor.rating) ? "bg-amber-400" : "bg-navy-700"}`} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-navy-700/50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Pending payout: <span className="text-teal-300 font-semibold">${pendingPayTotal.toLocaleString()}</span> across {pendingPay.length} invoice{pendingPay.length !== 1 ? "s" : ""}
          </p>
          <button onClick={() => onNavigate("payments")} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">
            View payouts →
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("jobs")}>
          <div className="kpi-label">Open Requests</div>
          <div className="kpi-value text-amber-400">{openJobs}</div>
          <div className="text-xs text-gray-500">available</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">This Month</div>
          <div className="kpi-value">{completedThisWeek}</div>
          <div className="text-xs text-gray-500">jobs done</div>
        </div>
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("payments")}>
          <div className="kpi-label">Pending Pay</div>
          <div className="kpi-value text-teal-400">${pendingPayTotal.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{pendingPay.length} invoices</div>
        </div>
      </div>

      {/* Active Jobs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Active & Upcoming Jobs</h2>
          <button onClick={() => onNavigate("jobs")} className="text-xs text-teal-400 hover:text-teal-300">
            See all →
          </button>
        </div>
        <div className="space-y-3">
          {myJobs.slice(0, 4).map((job) => (
            <div key={job.id} className="flex items-start gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50">
              <div className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm text-white font-medium">{job.title}</p>
                  <span className={statusBadge[job.status]}>{job.status.replace("_", " ")}</span>
                  <span className={urgencyBadge[job.urgency]}>{job.urgency}</span>
                  {job.urgency === "low" && (
                    <span className="text-[10px] font-medium bg-blue-900/40 text-blue-300 border border-blue-700/40 rounded-full px-1.5 py-0.5">🔄 Recurring</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{job.propertyName} · Unit {job.unitNumber}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  {DRIVE_TIMES[job.id] && (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {DRIVE_TIMES[job.id]} away
                    </p>
                  )}
                  {job.scheduledDate && (
                    <p className="text-xs text-teal-400">Scheduled: {job.scheduledDate}</p>
                  )}
                </div>
                {job.accessCode && (
                  <p className="text-xs text-amber-400 mt-0.5">Access code: {job.accessCode}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-white">${job.estimatedPay}</p>
                <p className="text-xs text-gray-500">est. pay</p>
              </div>
            </div>
          ))}
          {myJobs.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No active jobs right now</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate("completion")}
          className="card-hover p-4 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-900/40 border border-teal-700/30 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white">Complete a Job</p>
          <p className="text-xs text-gray-500 mt-0.5">Upload photos & submit invoice</p>
        </button>
        <button
          onClick={() => onNavigate("schedule")}
          className="card-hover p-4 text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-900/40 border border-blue-700/30 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white">View Schedule</p>
          <p className="text-xs text-gray-500 mt-0.5">Upcoming appointments</p>
        </button>
      </div>
    </div>
  );
}

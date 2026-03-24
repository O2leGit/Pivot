"use client";

import type { DemoUser } from "@/types";
import type { Page } from "../Dashboard";
import { CONTRACTORS, CONTRACTOR_JOBS, INVOICES } from "@/data/demoData";

interface Props {
  user: DemoUser;
  onNavigate: (page: Page) => void;
}

export default function ContractorDashboard({ user, onNavigate }: Props) {
  const contractor = CONTRACTORS.find((c) => c.id === user.entityId)!;
  const myJobs = CONTRACTOR_JOBS.filter((j) => j.status !== "completed" && j.status !== "cancelled");
  const completedThisWeek = CONTRACTOR_JOBS.filter((j) => j.status === "completed").length;
  const pendingPay = INVOICES.filter((i) => i.contractorId === user.entityId && ["pending", "approved"].includes(i.status));
  const pendingPayTotal = pendingPay.reduce((s, i) => s + i.amount, 0);
  const openJobs = myJobs.filter((j) => j.status === "open").length;

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Welcome back, {contractor.name.split(" ")[0]}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {contractor.specialty.join(", ")} · ⭐ {contractor.rating} · {contractor.completedJobs} jobs completed
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

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card cursor-pointer hover:border-navy-600 transition-colors" onClick={() => onNavigate("jobs")}>
          <div className="kpi-label">Open Requests</div>
          <div className="kpi-value text-amber-400">{openJobs}</div>
          <div className="text-xs text-gray-500">available</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">This Week</div>
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
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{job.propertyName} · Unit {job.unitNumber}</p>
                {job.scheduledDate && (
                  <p className="text-xs text-teal-400 mt-0.5">Scheduled: {job.scheduledDate}</p>
                )}
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

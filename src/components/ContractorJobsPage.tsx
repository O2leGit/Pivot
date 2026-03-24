"use client";

import { useState } from "react";
import type { DemoUser, ContractorJob } from "@/types";
import type { Page } from "./Dashboard";
import { CONTRACTOR_JOBS } from "@/data/demoData";

interface Props {
  user: DemoUser;
  currentTab: "jobs" | "schedule" | "completion";
  onNavigate: (page: Page) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const URGENCY_BADGE: Record<string, string> = {
  emergency: "badge-red", high: "badge-amber", medium: "badge-blue", low: "badge-gray",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CALENDAR_JOBS = CONTRACTOR_JOBS.filter(j => j.scheduledDate);

export default function ContractorJobsPage({ currentTab, onNavigate, showToast }: Props) {
  const [selectedJob, setSelectedJob] = useState<ContractorJob | null>(null);
  const [completionNote, setCompletionNote] = useState("");

  const availableJobs = CONTRACTOR_JOBS.filter(j => j.status === "open");
  const activeJobs = CONTRACTOR_JOBS.filter(j => ["accepted", "in_progress"].includes(j.status));
  const completedJobs = CONTRACTOR_JOBS.filter(j => j.status === "completed");

  const handleAccept = (job: ContractorJob) => {
    showToast(`Accepted: ${job.title}`);
    setSelectedJob(null);
  };
  const handleDecline = (job: ContractorJob) => {
    showToast(`Declined job: ${job.title}`, "error");
    setSelectedJob(null);
  };
  const handleComplete = () => {
    if (!selectedJob) return;
    showToast(`Job completed! Invoice submitted.`);
    setSelectedJob(null);
    setCompletionNote("");
  };

  if (currentTab === "schedule") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Schedule</h1>
            <p className="page-subtitle">Week of March 24–30, 2025</p>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="card">
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center mb-2">
            {DAYS.map(d => <div key={d} className="font-medium py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[24, 25, 26, 27, 28, 29, 30].map((day) => {
              const job = CALENDAR_JOBS.find(j => j.scheduledDate === `2025-03-${day}`);
              return (
                <div
                  key={day}
                  className={`min-h-[80px] rounded-lg p-2 ${job ? "bg-teal-900/30 border border-teal-700/40 cursor-pointer hover:bg-teal-900/50" : "bg-navy-900/30 border border-navy-800"}`}
                  onClick={() => job && setSelectedJob(job)}
                >
                  <div className={`text-xs font-semibold mb-1 ${day === 23 ? "text-teal-400" : "text-gray-400"}`}>{day}</div>
                  {job && (
                    <div>
                      <p className="text-[10px] text-teal-300 font-medium leading-tight">{job.title}</p>
                      <p className="text-[9px] text-gray-500 mt-0.5">{job.propertyName}</p>
                      {job.accessCode && <p className="text-[9px] text-amber-400 mt-0.5">Code: {job.accessCode}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">Upcoming Jobs</h2>
          <div className="space-y-3">
            {CALENDAR_JOBS.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50 cursor-pointer hover:border-navy-600"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-900/40 border border-teal-700/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-teal-400 leading-none">MAR</span>
                  <span className="text-sm font-bold text-white leading-none">{job.scheduledDate?.split("-")[2]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.propertyAddress} · Unit {job.unitNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">${job.estimatedPay}</p>
                  {job.accessCode && <p className="text-xs text-amber-400">Code: {job.accessCode}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentTab === "completion") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <h1 className="page-title">Job Completion</h1>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">Active Jobs — Ready to Complete</h2>
          <div className="space-y-3">
            {activeJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="card-hover p-4 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{job.title}</span>
                      <span className={URGENCY_BADGE[job.urgency]}>{job.urgency}</span>
                    </div>
                    <p className="text-xs text-gray-400">{job.propertyName} · Unit {job.unitNumber}</p>
                    {job.scheduledDate && <p className="text-xs text-teal-400 mt-0.5">Scheduled: {job.scheduledDate}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">${job.estimatedPay}</p>
                    <p className="text-xs text-gray-500">est. pay</p>
                  </div>
                </div>
              </div>
            ))}
            {activeJobs.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No active jobs to complete</p>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">Completed Jobs</h2>
          <div className="space-y-2">
            {completedJobs.map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 bg-navy-900/40 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-green-900/40 flex items-center justify-center text-green-400 shrink-0">✓</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{job.title}</p>
                  <p className="text-xs text-gray-500">{job.completedAt ? new Date(job.completedAt).toLocaleDateString() : "Completed"}</p>
                </div>
                <span className="badge-green">Paid</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Jobs tab (default)
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Job Requests</h1>
          <p className="page-subtitle">{availableJobs.length} available · {activeJobs.length} active</p>
        </div>
      </div>

      {/* Available jobs */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Available Near You</h2>
        <div className="space-y-3">
          {availableJobs.map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{job.title}</span>
                    <span className={URGENCY_BADGE[job.urgency]}>{job.urgency}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{job.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{job.propertyAddress} · Unit {job.unitNumber}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-green-400">${job.estimatedPay}</p>
                  <p className="text-xs text-gray-500">est. pay</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">My Active Jobs</h2>
          <div className="space-y-3">
            {activeJobs.map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 bg-navy-800 rounded-lg border border-teal-700/30">
                <div className="flex-1">
                  <p className="text-sm text-white font-medium">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.propertyName} · {job.scheduledDate}</p>
                </div>
                <button
                  onClick={() => { onNavigate("completion"); }}
                  className="btn-primary text-xs px-3 py-1.5"
                >
                  Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job detail modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={() => setSelectedJob(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={URGENCY_BADGE[selectedJob.urgency]}>{selectedJob.urgency}</span>
                  <span className="text-xs text-gray-400">{selectedJob.category}</span>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <p className="text-sm text-gray-300">{selectedJob.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-navy-900/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Property</p>
                  <p className="text-gray-200">{selectedJob.propertyName}</p>
                  <p className="text-xs text-gray-400">{selectedJob.propertyAddress}</p>
                </div>
                <div className="p-3 bg-navy-900/50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-0.5">Estimated Pay</p>
                  <p className="text-xl font-bold text-green-400">${selectedJob.estimatedPay}</p>
                </div>
              </div>

              {(selectedJob.status === "accepted" || selectedJob.status === "in_progress") ? (
                <div className="space-y-3">
                  <div className="border border-dashed border-navy-600 rounded-lg p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-navy-500">
                    📷 Upload completion photos
                  </div>
                  <textarea
                    className="input-field w-full h-20 resize-none"
                    placeholder="Add completion notes (optional)…"
                    value={completionNote}
                    onChange={(e) => setCompletionNote(e.target.value)}
                  />
                  <button onClick={handleComplete} className="btn-primary w-full">
                    Submit Completion & Invoice
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => handleAccept(selectedJob)} className="btn-primary flex-1">Accept Job</button>
                  <button onClick={() => handleDecline(selectedJob)} className="btn-secondary flex-1">Decline</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

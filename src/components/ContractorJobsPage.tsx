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
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    showToast(`Access code ${code} copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (currentTab === "schedule") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Schedule</h1>
            <p className="page-subtitle">Week of March 24–30, 2026</p>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="card">
          <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 text-center mb-2">
            {DAYS.map(d => <div key={d} className="font-medium py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {[24, 25, 26, 27, 28, 29, 30].map((day) => {
              const job = CALENDAR_JOBS.find(j => j.scheduledDate === `2026-03-${day}`);
              return (
                <div
                  key={day}
                  className={`min-h-[80px] rounded-lg p-2 ${job ? "bg-teal-900/30 border border-teal-700/40 cursor-pointer hover:bg-teal-900/50" : "bg-navy-900/30 border border-navy-800"}`}
                  onClick={() => job && setSelectedJob(job)}
                >
                  <div className={`text-xs font-semibold mb-1 ${day === 24 ? "text-teal-400" : "text-gray-400"}`}>{day}</div>
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

        {/* Upcoming jobs list */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-3">Upcoming Jobs</h2>
          <div className="space-y-3">
            {CALENDAR_JOBS.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50 cursor-pointer hover:border-navy-600 min-h-[56px]"
              >
                <div className="w-10 h-10 rounded-lg bg-teal-900/40 border border-teal-700/30 flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-teal-400 leading-none">MAR</span>
                  <span className="text-sm font-bold text-white leading-none">{job.scheduledDate?.split("-")[2]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{job.title}</p>
                  <p className="text-xs text-gray-400">{job.propertyAddress} · Unit {job.unitNumber}</p>
                  {job.accessCode && (
                    <p className="text-xs text-amber-400 mt-0.5 font-mono">Access code: {job.accessCode}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-white">${job.estimatedPay}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job modal */}
        {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onAccept={handleAccept} onDecline={handleDecline} onComplete={handleComplete} completionNote={completionNote} setCompletionNote={setCompletionNote} copiedCode={copiedCode} copyCode={copyCode} showToast={showToast} />}
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
                    {job.accessCode && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">Access code:</span>
                        <span className="font-mono text-lg font-bold text-amber-400 tracking-widest">{job.accessCode}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); copyCode(job.accessCode!); }}
                          className="text-xs text-gray-400 hover:text-white bg-navy-700 px-2 py-0.5 rounded"
                        >
                          {copiedCode === job.accessCode ? "✓" : "Copy"}
                        </button>
                      </div>
                    )}
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

        {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onAccept={handleAccept} onDecline={handleDecline} onComplete={handleComplete} completionNote={completionNote} setCompletionNote={setCompletionNote} copiedCode={copiedCode} copyCode={copyCode} showToast={showToast} />}
      </div>
    );
  }

  // Jobs tab
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
              <div key={job.id} className="p-4 bg-navy-800 rounded-xl border border-teal-700/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-white font-medium">{job.title}</p>
                    <p className="text-xs text-gray-400">{job.propertyName} · {job.scheduledDate}</p>
                  </div>
                  <span className="badge-teal">Active</span>
                </div>
                {job.accessCode && (
                  <div className="flex items-center justify-between bg-navy-900/60 border border-amber-700/30 rounded-xl p-3 mb-3">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Access Code</p>
                      <p className="text-3xl font-bold text-amber-400 tracking-widest font-mono">{job.accessCode}</p>
                    </div>
                    <button
                      onClick={() => copyCode(job.accessCode!)}
                      className="flex flex-col items-center gap-1 bg-amber-900/30 border border-amber-700/40 rounded-lg px-4 py-2 text-amber-300 hover:bg-amber-900/50 transition-colors min-h-[44px]"
                    >
                      {copiedCode === job.accessCode ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span className="text-[10px]">{copiedCode === job.accessCode ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                )}
                <button
                  onClick={() => { onNavigate("completion"); }}
                  className="btn-primary w-full min-h-[44px]"
                >
                  Mark Complete & Submit Invoice
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJob && <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onAccept={handleAccept} onDecline={handleDecline} onComplete={handleComplete} completionNote={completionNote} setCompletionNote={setCompletionNote} copiedCode={copiedCode} copyCode={copyCode} showToast={showToast} />}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// Job Detail Modal — mobile-first
// ──────────────────────────────────────────────────────────────────────
interface ModalProps {
  job: ContractorJob;
  onClose: () => void;
  onAccept: (j: ContractorJob) => void;
  onDecline: (j: ContractorJob) => void;
  onComplete: () => void;
  completionNote: string;
  setCompletionNote: (s: string) => void;
  copiedCode: string | null;
  copyCode: (c: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

function JobModal({ job, onClose, onAccept, onDecline, onComplete, completionNote, setCompletionNote, copiedCode, copyCode, showToast }: ModalProps) {
  const [photoNames, setPhotoNames] = useState<string[]>([]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drag handle on mobile */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-navy-600" />
        </div>

        <div className="modal-header">
          <div>
            <h2 className="text-base font-semibold text-white">{job.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={URGENCY_BADGE[job.urgency]}>{job.urgency}</span>
              <span className="text-xs text-gray-400">{job.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost min-h-[44px] min-w-[44px] flex items-center justify-center">✕</button>
        </div>

        <div className="modal-body space-y-4">
          <p className="text-sm text-gray-300">{job.description}</p>

          {/* Property + pay */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-navy-900/50 rounded-xl">
              <p className="text-xs text-gray-500 mb-0.5">Property</p>
              <p className="text-gray-200 font-medium">{job.propertyName}</p>
              <p className="text-xs text-gray-400">{job.propertyAddress}</p>
              <p className="text-xs text-gray-400">Unit {job.unitNumber}</p>
            </div>
            <div className="p-3 bg-navy-900/50 rounded-xl">
              <p className="text-xs text-gray-500 mb-0.5">Estimated Pay</p>
              <p className="text-2xl font-bold text-green-400">${job.estimatedPay}</p>
              {job.scheduledDate && <p className="text-xs text-teal-400 mt-1">Mar {job.scheduledDate.split("-")[2]}</p>}
            </div>
          </div>

          {/* Access code — prominent */}
          {job.accessCode && (
            <div className="flex items-center justify-between bg-navy-900/60 border border-amber-700/30 rounded-xl p-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Smart Lock Code</p>
                <p className="text-4xl font-bold text-amber-400 tracking-widest font-mono">{job.accessCode}</p>
              </div>
              <button
                onClick={() => copyCode(job.accessCode!)}
                className="flex flex-col items-center gap-1.5 bg-amber-900/30 border border-amber-700/40 rounded-xl px-5 py-3 text-amber-300 hover:bg-amber-900/50 transition-colors min-h-[60px]"
              >
                {copiedCode === job.accessCode ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                <span className="text-xs font-medium">{copiedCode === job.accessCode ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          )}

          {/* Tenant contact */}
          <a
            href="tel:+14155550142"
            className="flex items-center gap-3 p-3 bg-navy-900/50 border border-navy-700/50 rounded-xl hover:border-teal-700/40 transition-colors min-h-[56px]"
            onClick={(e) => { e.preventDefault(); showToast("Calling tenant (demo — no real call)"); }}
          >
            <div className="w-9 h-9 rounded-full bg-green-900/40 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-white font-medium">Call Tenant</p>
              <p className="text-xs text-gray-400">(415) 555-0142 · Sarah Chen</p>
            </div>
            <svg className="w-4 h-4 text-gray-500 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Completion flow */}
          {(job.status === "accepted" || job.status === "in_progress") ? (
            <div className="space-y-3">
              {/* Photo upload — triggers camera on mobile */}
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Completion Photos</label>
                <label className="flex items-center gap-3 p-4 border border-dashed border-navy-600 rounded-xl cursor-pointer hover:border-teal-700/60 hover:bg-teal-900/10 transition-all min-h-[56px]">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length) {
                        setPhotoNames(p => [...p, ...files.map(f => f.name)]);
                        showToast(`${files.length} photo(s) added`);
                      }
                    }}
                  />
                  <svg className="w-6 h-6 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-400">Take or upload photos</span>
                </label>
                {photoNames.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {photoNames.map((n, i) => (
                      <span key={i} className="text-[10px] bg-navy-800 border border-navy-700 px-2 py-1 rounded-lg text-gray-300">{n}</span>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                className="input-field w-full h-20 resize-none"
                placeholder="Add completion notes (optional)…"
                value={completionNote}
                onChange={(e) => setCompletionNote(e.target.value)}
              />
              <button onClick={onComplete} className="btn-primary w-full min-h-[48px] text-base font-semibold">
                Submit Completion & Invoice
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button onClick={() => onAccept(job)} className="btn-primary w-full min-h-[52px] text-base font-semibold">
                Accept Job — ${job.estimatedPay}
              </button>
              <button onClick={() => onDecline(job)} className="btn-secondary w-full min-h-[48px]">
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

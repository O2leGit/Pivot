"use client";

import { useState } from "react";
import type { PortalRole, DemoUser, MaintenanceRequest } from "@/types";
import { MAINTENANCE_REQUESTS, CONTRACTORS, TENANTS, PROPERTIES, UNITS } from "@/data/demoData";

interface Props {
  role: PortalRole;
  user: DemoUser;
  onOpenChat: (msg?: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const STATUS_LABELS: Record<string, string> = {
  open: "Open", triaged: "Triaged", assigned: "Assigned",
  in_progress: "In Progress", pending_approval: "Pending Approval",
  completed: "Completed", cancelled: "Cancelled",
};
const STATUS_BADGE: Record<string, string> = {
  open: "badge-amber", triaged: "badge-blue", assigned: "badge-blue",
  in_progress: "badge-teal", pending_approval: "badge-amber",
  completed: "badge-green", cancelled: "badge-gray",
};
const URGENCY_BADGE: Record<string, string> = {
  emergency: "badge-red", high: "badge-amber", medium: "badge-blue", low: "badge-gray",
};

export default function MaintenancePage({ role, user, onOpenChat, showToast }: Props) {
  const [selectedReq, setSelectedReq] = useState<MaintenanceRequest | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [newRequest, setNewRequest] = useState({ title: "", description: "", urgency: "medium", category: "other" });

  const requests = role === "tenant"
    ? MAINTENANCE_REQUESTS.filter((r) => r.tenantId === user.entityId)
    : MAINTENANCE_REQUESTS;

  const filtered = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

  const handleApprove = (req: MaintenanceRequest) => {
    showToast(`Approved: ${req.title}`);
    setSelectedReq(null);
  };
  const handleReject = (req: MaintenanceRequest) => {
    showToast(`Rejected: ${req.title}`, "error");
    setSelectedReq(null);
  };
  const handleSubmitRequest = () => {
    if (!newRequest.title) { showToast("Please enter a title", "error"); return; }
    showToast("Maintenance request submitted! AI triaging now…");
    setShowNewForm(false);
    setNewRequest({ title: "", description: "", urgency: "medium", category: "other" });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {role === "owner" ? "Maintenance Approvals" : role === "tenant" ? "My Maintenance Requests" : "Maintenance"}
          </h1>
          <p className="page-subtitle">{filtered.length} requests</p>
        </div>
        <div className="flex gap-2">
          {role === "owner" && (
            <button onClick={() => onOpenChat("Which maintenance requests need my approval?")} className="btn-secondary text-sm">
              Ask AI
            </button>
          )}
          {role === "tenant" && (
            <button onClick={() => setShowNewForm(true)} className="btn-primary text-sm">
              + New Request
            </button>
          )}
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "open", "triaged", "assigned", "in_progress", "pending_approval", "completed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterStatus === s
                ? "bg-teal-700/40 border-teal-600/60 text-teal-300"
                : "border-navy-700 text-gray-400 hover:text-gray-200 hover:border-navy-600"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s]}
            {s !== "all" && (
              <span className="ml-1.5 text-gray-500">
                {requests.filter((r) => r.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request list */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const contractor = req.assignedContractorId ? CONTRACTORS.find((c) => c.id === req.assignedContractorId) : null;
          const property = PROPERTIES.find((p) => p.id === req.propertyId);
          const unit = UNITS.find((u) => u.id === req.unitId);
          const tenant = TENANTS.find((t) => t.id === req.tenantId);

          return (
            <div
              key={req.id}
              onClick={() => setSelectedReq(req)}
              className="card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{req.title}</span>
                    <span className={STATUS_BADGE[req.status]}>{STATUS_LABELS[req.status]}</span>
                    <span className={URGENCY_BADGE[req.urgency]}>{req.urgency}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{req.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    {property && <span>{property.name}</span>}
                    {unit && <span>· Unit {unit.unitNumber}</span>}
                    {role !== "tenant" && tenant && <span>· {tenant.name}</span>}
                    <span>· {new Date(req.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {req.estimatedCost && (
                    <div className="text-sm font-semibold text-white">${req.estimatedCost.toLocaleString()}</div>
                  )}
                  {contractor && (
                    <div className="text-xs text-gray-400 mt-0.5">{contractor.name}</div>
                  )}
                  {req.aiUrgencyScore !== undefined && (
                    <div className={`text-xs mt-1 ${req.aiUrgencyScore >= 70 ? "text-red-400" : req.aiUrgencyScore >= 45 ? "text-amber-400" : "text-green-400"}`}>
                      AI: {req.aiUrgencyScore}/100
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card text-center py-10 text-gray-400">No requests matching this filter</div>
        )}
      </div>

      {/* New Request Form Modal */}
      {showNewForm && (
        <div className="modal-overlay" onClick={() => setShowNewForm(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-lg font-semibold text-white">Submit Maintenance Request</h2>
              <button onClick={() => setShowNewForm(false)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Issue Title *</label>
                <input
                  className="input-field w-full"
                  placeholder="e.g. Bathroom sink is clogged"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Description</label>
                <textarea
                  className="input-field w-full h-24 resize-none"
                  placeholder="Describe the issue in detail…"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Category</label>
                  <select
                    className="input-field w-full"
                    value={newRequest.category}
                    onChange={(e) => setNewRequest((p) => ({ ...p, category: e.target.value }))}
                  >
                    {["plumbing", "electrical", "hvac", "appliance", "structural", "pest", "other"].map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Urgency</label>
                  <select
                    className="input-field w-full"
                    value={newRequest.urgency}
                    onChange={(e) => setNewRequest((p) => ({ ...p, urgency: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <div className="p-3 bg-teal-900/20 border border-teal-700/30 rounded-lg">
                <p className="text-xs text-teal-300 font-medium mb-1">AI Triage</p>
                <p className="text-xs text-gray-400">After submission, our AI will automatically assess urgency, estimate costs, and match the best available contractor from our vetted pool.</p>
              </div>
              <div className="border border-dashed border-navy-600 rounded-lg p-4 text-center text-sm text-gray-400 cursor-pointer hover:border-navy-500 transition-colors">
                📷 Add photos (optional) — click to upload
              </div>
              <div className="flex gap-3">
                <button onClick={handleSubmitRequest} className="btn-primary flex-1">Submit Request</button>
                <button onClick={() => setShowNewForm(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedReq && (
        <div className="modal-overlay" onClick={() => setSelectedReq(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedReq.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={STATUS_BADGE[selectedReq.status]}>{STATUS_LABELS[selectedReq.status]}</span>
                  <span className={URGENCY_BADGE[selectedReq.urgency]}>{selectedReq.urgency}</span>
                </div>
              </div>
              <button onClick={() => setSelectedReq(null)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-sm text-gray-200">{selectedReq.description}</p>
              </div>
              {selectedReq.aiTriageSummary && (
                <div className="p-3 bg-teal-900/20 border border-teal-700/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span className="text-xs font-medium text-teal-400">AI Triage Summary</span>
                    {selectedReq.aiUrgencyScore !== undefined && (
                      <span className={`ml-auto text-xs font-medium ${selectedReq.aiUrgencyScore >= 70 ? "text-red-400" : selectedReq.aiUrgencyScore >= 45 ? "text-amber-400" : "text-green-400"}`}>
                        Urgency score: {selectedReq.aiUrgencyScore}/100
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300">{selectedReq.aiTriageSummary}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Submitted</p>
                  <p className="text-gray-200">{new Date(selectedReq.submittedAt).toLocaleDateString()}</p>
                </div>
                {selectedReq.estimatedCost && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Est. Cost</p>
                    <p className="text-gray-200">${selectedReq.estimatedCost.toLocaleString()}</p>
                  </div>
                )}
                {selectedReq.scheduledDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Scheduled</p>
                    <p className="text-teal-400">{selectedReq.scheduledDate}</p>
                  </div>
                )}
                {selectedReq.accessCode && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Access Code</p>
                    <p className="text-amber-400 font-mono font-semibold">{selectedReq.accessCode}</p>
                  </div>
                )}
              </div>
              {selectedReq.assignedContractorId && (() => {
                const c = CONTRACTORS.find((c) => c.id === selectedReq.assignedContractorId);
                return c ? (
                  <div className="p-3 bg-navy-900/50 rounded-lg border border-navy-700">
                    <p className="text-xs text-gray-500 mb-1">Assigned Contractor</p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-700/30 flex items-center justify-center text-xs font-semibold text-teal-300">
                        {c.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{c.name}</p>
                        <p className="text-xs text-gray-400">{c.specialty.join(", ")} · ⭐ {c.rating}</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Owner approval actions */}
              {role === "owner" && selectedReq.status === "pending_approval" && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => handleApprove(selectedReq)} className="btn-primary flex-1">
                    ✓ Approve ${selectedReq.estimatedCost?.toLocaleString()}
                  </button>
                  <button onClick={() => handleReject(selectedReq)} className="btn-danger flex-1">
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

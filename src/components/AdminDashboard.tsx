"use client";

import { useState } from "react";
import type { AccountRecord } from "@/types";
import type { Page } from "./Dashboard";
import { ACCOUNT_RECORDS, CONTRACTORS } from "@/data/demoData";

interface Props {
  currentTab: "accounts" | "vetting";
  onNavigate: (page: Page) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function AdminDashboard({ currentTab, showToast }: Props) {
  const [selectedAccount, setSelectedAccount] = useState<AccountRecord | null>(null);
  const [feeOverride, setFeeOverride] = useState<string>("");

  const statusBadge: Record<string, string> = {
    active: "badge-green",
    trial: "badge-blue",
    suspended: "badge-red",
  };

  if (currentTab === "vetting") {
    const pendingContractors = [
      {
        id: "cv-1",
        name: "Monica Chang",
        email: "monica.c@contractor.demo",
        specialty: "electrical",
        licenseNumber: "EL-94120-2024",
        submittedAt: "2026-03-20",
        status: "pending",
        bgCheckStatus: "cleared",
        insuranceVerified: false,
        referencesSubmitted: 2,
        referencesRequired: 3,
      },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">Contractor Vetting</h1>
            <p className="page-subtitle">{pendingContractors.length} pending application · {CONTRACTORS.length} vetted</p>
          </div>
        </div>

        {/* Pending */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Pending Applications</h2>
          {pendingContractors.map((app) => (
            <div key={app.id} className="p-4 bg-navy-900/50 rounded-xl border border-navy-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{app.name}</h3>
                    <span className="badge-amber">Pending Review</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{app.specialty} · License: {app.licenseNumber}</p>
                </div>
                <p className="text-xs text-gray-500">Submitted {app.submittedAt}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={`p-2 rounded-lg text-center text-xs ${app.bgCheckStatus === "cleared" ? "bg-green-900/30 text-green-400" : "bg-amber-900/30 text-amber-400"}`}>
                  <div className="font-medium">Background Check</div>
                  <div className="capitalize mt-0.5">{app.bgCheckStatus}</div>
                </div>
                <div className={`p-2 rounded-lg text-center text-xs ${app.insuranceVerified ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                  <div className="font-medium">Insurance</div>
                  <div className="mt-0.5">{app.insuranceVerified ? "Verified" : "Missing"}</div>
                </div>
                <div className={`p-2 rounded-lg text-center text-xs ${app.referencesSubmitted >= app.referencesRequired ? "bg-green-900/30 text-green-400" : "bg-amber-900/30 text-amber-400"}`}>
                  <div className="font-medium">References</div>
                  <div className="mt-0.5">{app.referencesSubmitted}/{app.referencesRequired}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast(`${app.name} approved and added to contractor pool`)}
                  className="btn-primary text-sm flex-1"
                >
                  ✓ Approve
                </button>
                <button
                  onClick={() => showToast(`Request sent to ${app.name} for missing documents`, "error")}
                  className="btn-secondary text-sm"
                >
                  Request Docs
                </button>
                <button
                  onClick={() => showToast(`Application rejected`, "error")}
                  className="btn-danger text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vetted contractors */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Vetted Contractors ({CONTRACTORS.length})</h2>
          <div className="space-y-2">
            {CONTRACTORS.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-700 to-blue-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {c.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white font-medium">{c.name}</span>
                    <span className={`badge ${c.status === "available" ? "badge-green" : c.status === "busy" ? "badge-amber" : "badge-gray"}`}>{c.status}</span>
                  </div>
                  <p className="text-xs text-gray-400">{c.specialty.join(", ")} · ⭐ {c.rating} · {c.completedJobs} jobs</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                  ${c.hourlyRate}/hr
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Accounts tab
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Account Management</h1>
          <p className="page-subtitle">{ACCOUNT_RECORDS.length} accounts</p>
        </div>
        <button onClick={() => showToast("New account wizard")} className="btn-primary text-sm">
          + New Account
        </button>
      </div>

      <div className="space-y-3">
        {ACCOUNT_RECORDS.map((acc) => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccount(acc)}
            className="card-hover p-4 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-white">{acc.ownerName}</span>
                  <span className={statusBadge[acc.status]}>{acc.status}</span>
                  <span className="badge-gray">{acc.plan}</span>
                </div>
                <p className="text-xs text-gray-400">{acc.email} · Joined {acc.joinedAt}</p>
                <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
                  <span>{acc.properties} properties</span>
                  <span>{acc.units} units</span>
                  <span>Fee: {acc.platformFeeEffective}%{acc.platformFeeOverride !== null ? " (override)" : ""}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-bold text-white">${acc.mrr}<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                <p className="text-xs text-gray-500">MRR</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account detail modal */}
      {selectedAccount && (
        <div className="modal-overlay" onClick={() => setSelectedAccount(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedAccount.ownerName}</h2>
                <p className="text-xs text-gray-400">{selectedAccount.email}</p>
              </div>
              <button onClick={() => setSelectedAccount(null)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Plan", value: selectedAccount.plan },
                  { label: "Status", value: selectedAccount.status },
                  { label: "Properties", value: String(selectedAccount.properties) },
                  { label: "Units", value: String(selectedAccount.units) },
                  { label: "MRR", value: `$${selectedAccount.mrr}/mo` },
                  { label: "Joined", value: selectedAccount.joinedAt },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-gray-200 font-medium capitalize">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Fee configuration */}
              <div className="p-4 bg-navy-900/50 rounded-xl border border-navy-700">
                <h3 className="text-xs font-semibold text-gray-300 mb-3 uppercase tracking-wider">Platform Fee Configuration</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Default</span>
                    <span className="text-gray-300">{selectedAccount.platformFeeDefault}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account Override</span>
                    <div className="flex items-center gap-2">
                      <input
                        className="input-field w-20 text-right py-1 text-sm"
                        placeholder={String(selectedAccount.platformFeeDefault)}
                        value={feeOverride}
                        onChange={(e) => setFeeOverride(e.target.value)}
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                  </div>
                  <div className="flex justify-between font-medium border-t border-navy-700 pt-2">
                    <span className="text-gray-200">Effective Rate</span>
                    <span className="text-teal-400">{feeOverride || selectedAccount.platformFeeEffective}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => { showToast(`Fee updated for ${selectedAccount.ownerName}`); setSelectedAccount(null); }}
                  className="btn-primary flex-1 text-sm"
                >
                  Save Changes
                </button>
                {selectedAccount.status !== "suspended" ? (
                  <button
                    onClick={() => { showToast(`Account suspended`, "error"); setSelectedAccount(null); }}
                    className="btn-danger text-sm"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => { showToast(`Account reactivated`); setSelectedAccount(null); }}
                    className="btn-secondary text-sm"
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

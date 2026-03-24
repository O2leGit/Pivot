"use client";

import { useState } from "react";
import { INVOICES, CONTRACTORS, MAINTENANCE_REQUESTS } from "@/data/demoData";

interface Props {
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function InvoicesPage({ showToast }: Props) {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<typeof INVOICES[0] | null>(null);

  const filtered = filter === "all" ? INVOICES : INVOICES.filter((i) => i.status === filter);

  const statusBadge: Record<string, string> = {
    pending: "badge-amber", approved: "badge-blue", paid: "badge-green", disputed: "badge-red",
  };

  const totalPending = INVOICES.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const totalPaid = INVOICES.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const totalFees = INVOICES.reduce((s, i) => s + i.platformFee, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contractor Invoices</h1>
          <p className="page-subtitle">{INVOICES.length} invoices</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="kpi-label">Pending Review</div>
          <div className="kpi-value text-amber-400">${totalPending.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{INVOICES.filter(i => i.status === "pending").length} invoices</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Paid MTD</div>
          <div className="kpi-value">${totalPaid.toLocaleString()}</div>
          <div className="text-xs text-gray-500">{INVOICES.filter(i => i.status === "paid").length} invoices</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Platform Fees</div>
          <div className="kpi-value text-teal-400">${totalFees.toFixed(0)}</div>
          <div className="text-xs text-gray-500">8% on labor</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "approved", "paid", "disputed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === s ? "bg-teal-700/40 border-teal-600/60 text-teal-300" : "border-navy-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoices */}
      <div className="space-y-3">
        {filtered.map((inv) => {
          const contractor = CONTRACTORS.find((c) => c.id === inv.contractorId);
          const request = inv.maintenanceRequestId ? MAINTENANCE_REQUESTS.find((r) => r.id === inv.maintenanceRequestId) : null;
          return (
            <div
              key={inv.id}
              onClick={() => setSelected(inv)}
              className="card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-white">{inv.description}</span>
                    <span className={statusBadge[inv.status]}>{inv.status}</span>
                  </div>
                  {contractor && (
                    <p className="text-xs text-gray-400">{contractor.name} · {contractor.specialty.join(", ")}</p>
                  )}
                  {request && (
                    <p className="text-xs text-gray-500 mt-0.5">RE: {request.title}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted {new Date(inv.submittedAt).toLocaleDateString()}
                    {inv.approvedAt && ` · Approved ${new Date(inv.approvedAt).toLocaleDateString()}`}
                    {inv.paidAt && ` · Paid ${new Date(inv.paidAt).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-base font-bold text-white">${inv.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-0.5">fee: ${inv.platformFee.toFixed(2)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-base font-semibold text-white">{selected.description}</h2>
              <button onClick={() => setSelected(null)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              {/* Line items */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Line Items</p>
                <div className="space-y-2">
                  {selected.lineItems.map((li, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-navy-900/50 rounded-lg text-sm">
                      <span className="text-gray-300">{li.description}</span>
                      <span className="text-white font-medium">${li.amount}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2.5 bg-navy-700/30 rounded-lg text-sm border border-navy-700/50">
                    <span className="text-gray-400">Platform fee (8%)</span>
                    <span className="text-teal-400 font-medium">${selected.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg text-sm font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">${selected.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selected.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => { showToast(`Invoice approved — $${selected.amount}`); setSelected(null); }}
                    className="btn-primary flex-1"
                  >
                    Approve ${selected.amount}
                  </button>
                  <button
                    onClick={() => { showToast("Invoice disputed", "error"); setSelected(null); }}
                    className="btn-danger"
                  >
                    Dispute
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

"use client";

import { useState } from "react";
import type { Dispute } from "@/types";
import { DISPUTES } from "@/data/demoData";

interface Props {
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function DisputesPage({ showToast }: Props) {
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? DISPUTES : DISPUTES.filter((d) => d.status === filter);

  const statusBadge: Record<string, string> = {
    open: "badge-red",
    under_review: "badge-amber",
    resolved: "badge-green",
    escalated: "badge-red",
  };
  const typeBadge: Record<string, string> = {
    maintenance: "badge-blue",
    payment: "badge-teal",
    deposit: "badge-amber",
    lease: "badge-gray",
    other: "badge-gray",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Disputes</h1>
          <p className="page-subtitle">{DISPUTES.filter(d => d.status !== "resolved").length} open · {DISPUTES.length} total</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "open", "under_review", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === s ? "bg-teal-700/40 border-teal-600/60 text-teal-300" : "border-navy-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card text-center py-14">
          <div className="text-4xl mb-3">🛡️</div>
          <p className="text-sm font-semibold text-white mb-1">No disputes in this category</p>
          <p className="text-xs text-gray-500">Your portfolio is running smoothly — no open disputes to resolve.</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((d) => (
          <div
            key={d.id}
            onClick={() => setSelected(d)}
            className="card-hover p-4 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={typeBadge[d.type]}>{d.type}</span>
                  <span className={statusBadge[d.status]}>{d.status.replace("_", " ")}</span>
                </div>
                <p className="text-sm text-gray-200 font-medium">{d.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Opened by {d.openedBy} · {new Date(d.openedAt).toLocaleDateString()}
                  {d.resolvedAt && ` · Resolved ${new Date(d.resolvedAt).toLocaleDateString()}`}
                </p>
              </div>
              {d.amount && (
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-white">${d.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">disputed</p>
                </div>
              )}
            </div>
            {d.resolution && (
              <div className="mt-2 p-2 bg-green-900/20 rounded-lg border border-green-800/30">
                <p className="text-xs text-green-400 font-medium mb-0.5">Resolution</p>
                <p className="text-xs text-gray-300">{d.resolution}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={typeBadge[selected.type]}>{selected.type}</span>
                  <span className={statusBadge[selected.status]}>{selected.status.replace("_", " ")}</span>
                </div>
                <h2 className="text-base font-semibold text-white">Dispute Details</h2>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <p className="text-sm text-gray-300">{selected.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Opened By</p>
                  <p className="text-gray-200">{selected.openedBy} ({selected.openedByRole})</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Against</p>
                  <p className="text-gray-200">{selected.againstName}</p>
                </div>
                {selected.amount && (
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-gray-200 font-semibold">${selected.amount.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Opened</p>
                  <p className="text-gray-200">{new Date(selected.openedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {selected.status !== "resolved" && (
                <div className="space-y-3">
                  <textarea
                    className="input-field w-full h-20 resize-none"
                    placeholder="Enter resolution notes…"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { showToast("Dispute resolved"); setSelected(null); setResolution(""); }}
                      className="btn-primary flex-1 text-sm"
                    >
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => { showToast("Dispute escalated"); setSelected(null); }}
                      className="btn-danger text-sm"
                    >
                      Escalate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

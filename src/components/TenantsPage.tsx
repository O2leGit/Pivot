"use client";

import { useState } from "react";
import type { Tenant } from "@/types";
import { TENANTS, UNITS, PROPERTIES } from "@/data/demoData";

interface Props {
  onOpenChat: (msg?: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function TenantsPage({ onOpenChat, showToast }: Props) {
  const [selected, setSelected] = useState<Tenant | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? TENANTS : TENANTS.filter((t) => t.paymentStatus === filter);

  const statusBadge: Record<string, string> = {
    paid: "badge-green", pending: "badge-amber", overdue: "badge-red", partial: "badge-amber",
  };
  const leaseBadge: Record<string, string> = {
    active: "badge-green", expiring_soon: "badge-amber", expired: "badge-red", pending: "badge-blue",
  };

  const getScoreColor = (score: number) =>
    score >= 85 ? "text-green-400" : score >= 70 ? "text-amber-400" : "text-red-400";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tenants</h1>
          <p className="page-subtitle">{TENANTS.length} tenants across all properties</p>
        </div>
        <button
          onClick={() => onOpenChat("Which tenants have overdue rent?")}
          className="btn-secondary text-sm"
        >
          Ask AI
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[
          { val: "all", label: "All" },
          { val: "paid", label: "Paid" },
          { val: "pending", label: "Pending" },
          { val: "overdue", label: "Overdue" },
        ].map((f) => (
          <button
            key={f.val}
            onClick={() => setFilter(f.val)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === f.val
                ? "bg-teal-700/40 border-teal-600/60 text-teal-300"
                : "border-navy-700 text-gray-400 hover:text-gray-200"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-gray-500">
              {f.val === "all" ? TENANTS.length : TENANTS.filter((t) => t.paymentStatus === f.val).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tenant cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((tenant) => {
          const unit = UNITS.find((u) => u.id === tenant.unitId);
          const property = PROPERTIES.find((p) => p.id === tenant.propertyId);

          return (
            <div
              key={tenant.id}
              onClick={() => setSelected(tenant)}
              className="card-hover p-4 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-700 to-blue-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {tenant.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{tenant.name}</span>
                    <span className={statusBadge[tenant.paymentStatus]}>{tenant.paymentStatus}</span>
                    <span className={leaseBadge[tenant.leaseStatus]}>{tenant.leaseStatus.replace("_", " ")}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {property?.name} · Unit {unit?.unitNumber}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-gray-500">Rent: <span className="text-gray-300">${tenant.rentAmount.toLocaleString()}/mo</span></span>
                    <span className="text-gray-500">Lease ends: <span className="text-gray-300">{new Date(tenant.leaseEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span></span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-lg font-bold ${getScoreColor(tenant.screeningScore)}`}>
                    {tenant.screeningScore}
                  </div>
                  <div className="text-[11px] text-gray-500">score</div>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-700 to-blue-700 flex items-center justify-center text-sm font-bold text-white">
                  {selected.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">{selected.name}</h2>
                  <p className="text-xs text-gray-400">{selected.email} · {selected.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              {/* Screening score */}
              <div className="p-3 bg-navy-900/50 rounded-lg border border-navy-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Tenant Screening Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(selected.screeningScore)}`}>
                    {selected.screeningScore}/100
                  </span>
                </div>
                <div className="w-full bg-navy-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${selected.screeningScore >= 85 ? "bg-green-500" : selected.screeningScore >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${selected.screeningScore}%` }}
                  />
                </div>
                <p className={`text-xs mt-1.5 font-medium ${getScoreColor(selected.screeningScore)}`}>
                  {selected.screeningScore >= 85 ? "Excellent — recommended" :
                   selected.screeningScore >= 70 ? "Good — approved with conditions" :
                   "Fair — review required"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Monthly Rent", value: `$${selected.rentAmount.toLocaleString()}` },
                  { label: "Payment Status", value: selected.paymentStatus },
                  { label: "Balance", value: selected.balance > 0 ? `-$${selected.balance.toLocaleString()}` : "$0.00" },
                  { label: "AutoPay", value: selected.autoPayEnabled ? "Enabled ✓" : "Off" },
                  { label: "Lease Start", value: new Date(selected.leaseStart).toLocaleDateString() },
                  { label: "Lease End", value: new Date(selected.leaseEnd).toLocaleDateString() },
                  { label: "Move-in Date", value: new Date(selected.moveInDate).toLocaleDateString() },
                  { label: "Lease Status", value: selected.leaseStatus.replace("_", " ") },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-gray-200 font-medium">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button onClick={() => { showToast("Message sent to " + selected.name); setSelected(null); }} className="btn-secondary flex-1 text-sm">
                  Send Message
                </button>
                {selected.balance > 0 && (
                  <button onClick={() => { showToast("Late fee notice sent"); setSelected(null); }} className="btn-danger text-sm">
                    Send Notice
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

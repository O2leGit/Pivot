"use client";

import { useState } from "react";
import { AUDIT_LOG } from "@/data/demoData";

const ACTION_COLOR: Record<string, string> = {
  ACCOUNT_UPDATED: "text-blue-400",
  INVOICE_APPROVED: "text-green-400",
  INVOICE_SUBMITTED: "text-teal-400",
  CONTRACTOR_VETTED: "text-green-400",
  MAINTENANCE_SUBMITTED: "text-blue-400",
  IOT_ALERT: "text-red-400",
  DISPUTE_OPENED: "text-amber-400",
  DISPUTE_RESOLVED: "text-green-400",
  CONTRACTOR_ASSIGNED: "text-teal-400",
  PAYMENT_PROCESSED: "text-green-400",
  JOB_COMPLETED: "text-green-400",
};

const ROLE_BADGE: Record<string, string> = {
  admin: "badge-purple", owner: "badge-blue", tenant: "badge-teal",
  contractor: "badge-amber", system: "badge-gray",
};

const CATEGORY_FILTERS = [
  { label: "All",            key: "all",         match: () => true },
  { label: "Fee Changes",    key: "fees",        match: (a: string) => a.includes("FEE") || a.includes("ACCOUNT") },
  { label: "Account Actions",key: "accounts",    match: (a: string) => a.includes("ACCOUNT") || a.includes("INVOICE") || a.includes("PAYMENT") },
  { label: "Disputes",       key: "disputes",    match: (a: string) => a.includes("DISPUTE") },
  { label: "System",         key: "system",      match: (a: string) => a === "IOT_ALERT" || a.includes("CONTRACTOR") },
];

// Fake before/after diffs for each action type
function getMockDiff(entry: typeof AUDIT_LOG[number]): { before: string; after: string } | null {
  if (entry.action === "ACCOUNT_UPDATED") return {
    before: JSON.stringify({ platformFeePercent: 10, plan: "Starter" }, null, 2),
    after:  JSON.stringify({ platformFeePercent: 8,  plan: "Pro"     }, null, 2),
  };
  if (entry.action === "INVOICE_APPROVED") return {
    before: JSON.stringify({ status: "pending", approvedAt: null }, null, 2),
    after:  JSON.stringify({ status: "approved", approvedAt: entry.timestamp }, null, 2),
  };
  if (entry.action === "DISPUTE_RESOLVED") return {
    before: JSON.stringify({ status: "open", resolution: null }, null, 2),
    after:  JSON.stringify({ status: "resolved", resolution: "Refund issued" }, null, 2),
  };
  if (entry.action === "CONTRACTOR_VETTED") return {
    before: JSON.stringify({ vetted: false, status: "pending" }, null, 2),
    after:  JSON.stringify({ vetted: true,  status: "approved" }, null, 2),
  };
  return null;
}

export default function AuditLogPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categoryFn = CATEGORY_FILTERS.find(c => c.key === categoryFilter)?.match || (() => true);

  const filtered = AUDIT_LOG
    .filter((e) => roleFilter === "all" || e.actorRole === roleFilter)
    .filter((e) => categoryFn(e.action))
    .filter((e) =>
      !search || e.actorName.toLowerCase().includes(search.toLowerCase()) ||
      e.action.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Log</h1>
          <p className="page-subtitle">Immutable action history · {AUDIT_LOG.length} entries</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-900/20 border border-amber-700/30 px-3 py-1.5 rounded-lg">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Immutable · Read-only
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORY_FILTERS.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategoryFilter(c.key)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
              categoryFilter === c.key
                ? "bg-teal-700/40 border-teal-600/60 text-teal-300"
                : "border-navy-700 text-gray-400 hover:text-gray-200 hover:border-navy-600"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Role filter + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          className="input-field text-sm flex-1 min-w-[200px]"
          placeholder="Search actions, actors, details…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap">
          {["all", "admin", "owner", "tenant", "contractor", "system"].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                roleFilter === r ? "bg-navy-700 border-navy-500 text-white" : "border-navy-700 text-gray-400 hover:text-gray-200"
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Log entries */}
      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-navy-700/50">
          {filtered.map((entry, i) => {
            const diff = getMockDiff(entry);
            const isExpanded = expandedId === entry.id;

            return (
              <div key={entry.id} className={i === 0 ? "rounded-t-xl" : ""}>
                <div
                  className={`flex items-start gap-3 p-3.5 hover:bg-navy-700/20 transition-colors ${diff ? "cursor-pointer" : ""}`}
                  onClick={() => diff && setExpandedId(isExpanded ? null : entry.id)}
                >
                  {/* Timestamp */}
                  <div className="text-[11px] text-gray-500 w-24 shrink-0 mt-0.5 tabular-nums">
                    <div>{new Date(entry.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                    <div>{new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
                  </div>

                  {/* Actor */}
                  <div className="w-28 shrink-0">
                    <div className="text-xs text-gray-300 font-medium truncate">{entry.actorName}</div>
                    <span className={`badge text-[10px] mt-0.5 ${ROLE_BADGE[entry.actorRole] || "badge-gray"}`}>
                      {entry.actorRole}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-mono font-medium ${ACTION_COLOR[entry.action] || "text-gray-300"}`}>
                      {entry.action}
                    </span>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.details}</p>
                  </div>

                  {/* Resource */}
                  <div className="text-[11px] text-gray-500 text-right shrink-0 w-20">
                    <div className="text-gray-400">{entry.resource}</div>
                    <div className="font-mono">{entry.resourceId}</div>
                  </div>

                  {/* Expand chevron */}
                  {diff && (
                    <div className="shrink-0 text-gray-600 ml-1 mt-0.5">
                      <svg className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Diff panel */}
                {isExpanded && diff && (
                  <div className="px-4 pb-4 bg-navy-900/50 border-t border-navy-700/40">
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div>
                        <div className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-1.5">Before</div>
                        <pre className="text-[10px] text-red-300/80 bg-red-900/10 border border-red-900/30 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed">{diff.before}</pre>
                      </div>
                      <div>
                        <div className="text-[10px] text-green-400 font-semibold uppercase tracking-wider mb-1.5">After</div>
                        <pre className="text-[10px] text-green-300/80 bg-green-900/10 border border-green-900/30 rounded-lg p-3 overflow-x-auto font-mono leading-relaxed">{diff.after}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-gray-500 text-sm">No entries match your filter</div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import type { PortalRole, DemoUser } from "@/types";
import { PAYMENTS, TENANTS, INVOICES, CONTRACTORS } from "@/data/demoData";

interface Props {
  role: PortalRole;
  user: DemoUser;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function PaymentsPage({ role, user, showToast }: Props) {
  const [autoPayEnabled, setAutoPayEnabled] = useState(true);
  const [showPayModal, setShowPayModal] = useState(false);

  const tenant = role === "tenant" ? TENANTS.find((t) => t.id === user.entityId) : null;
  const myPayments = role === "tenant"
    ? PAYMENTS.filter((p) => p.tenantId === user.entityId)
    : PAYMENTS;

  // Contractor sees their invoices
  const myInvoices = role === "contractor"
    ? INVOICES.filter((i) => i.contractorId === user.entityId)
    : [];

  const statusBadge: Record<string, string> = {
    paid: "badge-green",
    pending: "badge-amber",
    overdue: "badge-red",
    partial: "badge-amber",
  };
  const invoiceStatusBadge: Record<string, string> = {
    pending: "badge-amber",
    approved: "badge-blue",
    paid: "badge-green",
    disputed: "badge-red",
  };

  const pendingAmount = myPayments.filter((p) => p.status === "pending" || p.status === "overdue").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">{role === "contractor" ? "My Invoices" : "Payments"}</h1>
          <p className="page-subtitle">
            {role === "tenant" ? `${myPayments.length} transactions` : role === "contractor" ? `${myInvoices.length} invoices` : `${myPayments.length} payments`}
          </p>
        </div>
        {role === "tenant" && pendingAmount > 0 && (
          <button onClick={() => setShowPayModal(true)} className="btn-primary text-sm">
            Pay ${pendingAmount.toLocaleString()} Due
          </button>
        )}
      </div>

      {/* Tenant: AutoPay + Summary */}
      {role === "tenant" && tenant && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card">
            <div className="text-xs text-gray-400 mb-1">Monthly Rent</div>
            <div className="text-2xl font-bold text-white">${tenant.rentAmount.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Unit 101 · Due 1st of month</div>
          </div>
          <div className="card">
            <div className="text-xs text-gray-400 mb-1">Current Balance</div>
            <div className={`text-2xl font-bold ${tenant.balance > 0 ? "text-red-400" : "text-green-400"}`}>
              {tenant.balance > 0 ? `-$${tenant.balance.toLocaleString()}` : "$0.00"}
            </div>
            <div className="text-xs text-gray-500 mt-1">{tenant.balance > 0 ? "Outstanding" : "Paid up"}</div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-gray-400">AutoPay</div>
              <button
                onClick={() => {
                  setAutoPayEnabled(!autoPayEnabled);
                  showToast(autoPayEnabled ? "AutoPay disabled" : "AutoPay enabled");
                }}
                className={`w-10 h-5 rounded-full transition-colors relative ${autoPayEnabled ? "bg-teal-600" : "bg-navy-600"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoPayEnabled ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
            <div className={`text-lg font-bold ${autoPayEnabled ? "text-green-400" : "text-gray-400"}`}>
              {autoPayEnabled ? "Active" : "Disabled"}
            </div>
            <div className="text-xs text-gray-500 mt-1">Via ACH · Free</div>
          </div>
        </div>
      )}

      {/* Contractor: invoices */}
      {role === "contractor" && (
        <div className="space-y-3">
          {myInvoices.map((inv) => {
            return (
              <div key={inv.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{inv.description}</span>
                      <span className={invoiceStatusBadge[inv.status]}>{inv.status}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Submitted {new Date(inv.submittedAt).toLocaleDateString()}
                      {inv.paidAt && ` · Paid ${new Date(inv.paidAt).toLocaleDateString()}`}
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>Labor: {inv.laborHours}h</span>
                      <span>Materials: ${inv.materialsCost}</span>
                      <span>Platform fee: ${inv.platformFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${inv.amount}</div>
                    <div className="text-xs text-gray-500">gross</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-navy-700">
                  <div className="space-y-1">
                    {inv.lineItems.map((li, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{li.description}</span>
                        <span className="text-gray-300">${li.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tenant/Owner: Payment history */}
      {role !== "contractor" && (
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Payment History</h2>
          <div className="space-y-3">
            {myPayments.map((payment) => {
              const ten = TENANTS.find((t) => t.id === payment.tenantId);
              return (
                <div key={payment.id} className="flex items-center gap-3 p-3 bg-navy-900/40 rounded-lg border border-navy-700/40">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    payment.status === "paid" ? "bg-green-900/40 text-green-400" :
                    payment.status === "overdue" ? "bg-red-900/40 text-red-400" :
                    "bg-amber-900/40 text-amber-400"
                  }`}>
                    {payment.status === "paid" ? "✓" : payment.status === "overdue" ? "!" : "○"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 font-medium">{payment.description}</p>
                    <p className="text-xs text-gray-500">
                      {role !== "tenant" && ten && <>{ten.name} · </>}
                      Due {new Date(payment.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      {payment.paidDate && ` · Paid ${new Date(payment.paidDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                      {payment.method && ` · ${payment.method.toUpperCase()}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-white">${payment.amount.toLocaleString()}</div>
                    <span className={statusBadge[payment.status]}>{payment.status}</span>
                  </div>
                  {payment.receiptUrl && payment.status === "paid" && (
                    <button
                      onClick={() => showToast("Receipt downloaded")}
                      className="text-xs text-teal-400 hover:text-teal-300 shrink-0 ml-2"
                    >
                      ↓ Receipt
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pay modal */}
      {showPayModal && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-panel max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-base font-semibold text-white">Make a Payment</h2>
              <button onClick={() => setShowPayModal(false)} className="btn-ghost">✕</button>
            </div>
            <div className="modal-body space-y-4">
              <div className="p-4 bg-navy-900/50 rounded-lg border border-navy-700 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Amount due</p>
                  <p className="text-2xl font-bold text-white">${pendingAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">April 2025 Rent</p>
                  <p className="text-xs text-gray-500">Unit 101</p>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Payment method</label>
                <select className="input-field w-full">
                  <option>ACH Bank Transfer (Free)</option>
                  <option>Credit/Debit Card (+2.9%)</option>
                </select>
              </div>
              <button
                onClick={() => {
                  showToast("Payment of $" + pendingAmount.toLocaleString() + " submitted!");
                  setShowPayModal(false);
                }}
                className="btn-primary w-full"
              >
                Pay ${pendingAmount.toLocaleString()} Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

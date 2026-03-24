"use client";

import { useState } from "react";
import type { DemoUser } from "@/types";
import { LEASES, TENANTS, UNITS, PROPERTIES } from "@/data/demoData";

interface Props {
  user: DemoUser;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function LeasePage({ user, showToast }: Props) {
  const [signed, setSigned] = useState(false);
  const tenant = TENANTS.find((t) => t.id === user.entityId)!;
  const lease = LEASES.find((l) => l.tenantId === user.entityId)!;
  const unit = UNITS.find((u) => u.id === lease?.unitId);
  const property = PROPERTIES.find((p) => p.id === lease?.propertyId);

  const daysUntilExpiry = lease
    ? Math.ceil((new Date(lease.endDate).getTime() - Date.now()) / 86400000)
    : 0;

  const isExpiringSoon = daysUntilExpiry < 90;

  if (!lease) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="page-title">Lease</h1>
        <div className="card text-center py-12 text-gray-400">No active lease on file</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Lease</h1>
          <p className="page-subtitle">{property?.name} · Unit {unit?.unitNumber}</p>
        </div>
        <span className={`badge ${isExpiringSoon ? "badge-amber" : "badge-green"}`}>
          {lease.status.replace("_", " ")}
        </span>
      </div>

      {/* Expiry hero */}
      <div className={`rounded-2xl p-6 ${isExpiringSoon ? "bg-gradient-to-br from-amber-900/30 to-navy-800 border border-amber-700/40" : "bg-gradient-to-br from-teal-900/20 to-navy-800 border border-teal-700/30"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Lease Expires</p>
            <p className="text-3xl font-bold text-white">
              {new Date(lease.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <p className={`text-sm mt-1 ${isExpiringSoon ? "text-amber-400" : "text-teal-400"}`}>
              {daysUntilExpiry > 0 ? `${daysUntilExpiry} days remaining` : "Expired"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Monthly Rent</p>
            <p className="text-2xl font-bold text-white">${lease.monthlyRent.toLocaleString()}</p>
            <p className="text-xs text-gray-500">+ utilities</p>
          </div>
        </div>
        {isExpiringSoon && (
          <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
            <p className="text-sm text-amber-300">
              🔔 Your lease expires soon. A renewal offer may be sent within the next 30 days.
              Contact your landlord to discuss renewal terms.
            </p>
          </div>
        )}
      </div>

      {/* Lease Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white">Lease Details</h2>
          {[
            { label: "Lease Term", value: `${new Date(lease.startDate).toLocaleDateString()} – ${new Date(lease.endDate).toLocaleDateString()}` },
            { label: "Monthly Rent", value: `$${lease.monthlyRent.toLocaleString()}` },
            { label: "Security Deposit", value: `$${lease.securityDeposit.toLocaleString()}` },
            { label: "Pet Policy", value: lease.petPolicy.replace(/_/g, " ") },
            { label: "Unit", value: `${unit?.bedrooms}BR / ${unit?.bathrooms}BA · ${unit?.sqft.toLocaleString()} sqft` },
          ].map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-xs text-gray-500">{item.label}</span>
              <span className="text-sm text-gray-200 font-medium capitalize">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-white">Signatures</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-navy-900/50 rounded-lg">
              <span className="text-sm text-gray-300">Tenant ({tenant.name})</span>
              <span className={`badge ${lease.signedByTenant ? "badge-green" : "badge-amber"}`}>
                {lease.signedByTenant ? "✓ Signed" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-navy-900/50 rounded-lg">
              <span className="text-sm text-gray-300">Owner / Landlord</span>
              <span className={`badge ${lease.signedByOwner ? "badge-green" : "badge-amber"}`}>
                {lease.signedByOwner ? "✓ Signed" : "Pending signature"}
              </span>
            </div>
          </div>
          {!lease.signedByOwner && (
            <button
              onClick={() => { setSigned(true); showToast("Reminder sent to owner"); }}
              className="btn-secondary w-full text-sm"
            >
              Send Signature Reminder
            </button>
          )}
          {signed && (
            <p className="text-xs text-green-400 text-center">Reminder sent!</p>
          )}
          {lease.signedAt && (
            <p className="text-xs text-gray-500 text-center">
              Fully executed {new Date(lease.signedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Lease Terms */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Lease Terms</h2>
        <ul className="space-y-2">
          {lease.terms.map((term, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-teal-400 mt-0.5 shrink-0">•</span>
              {term}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button onClick={() => showToast("Lease document downloaded")} className="btn-secondary text-sm">
          ↓ Download PDF
        </button>
        <button onClick={() => showToast("Message sent to landlord")} className="btn-secondary text-sm">
          Contact Landlord
        </button>
      </div>
    </div>
  );
}

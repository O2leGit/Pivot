"use client";

import { useState } from "react";

interface Props {
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function SettingsPage({ showToast }: Props) {
  const [settings, setSettings] = useState({
    defaultPlatformFee: 8,
    strPlatformFee: 12,
    lateFeeDays: 5,
    lateFeeAmount: 75,
    maintenanceAutoApproveUnder: 250,
    requireTwoContractorBids: false,
    autoNotifyTenantOnAssign: true,
    autoNotifyOwnerOnSubmit: true,
    disputeEscalationDays: 7,
    tenantScreeningMinScore: 65,
    requireRentersInsurance: true,
    strNoiseSensorAlerts: true,
    strLeakDetectionAlerts: true,
    iotSmartLockLogs: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  const handleSave = () => {
    showToast("Platform settings saved");
  };

  const SwitchRow = ({ label, desc, field }: { label: string; desc?: string; field: keyof typeof settings }) => (
    <div className="flex items-center justify-between py-3 border-b border-navy-700/50">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-200">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => toggle(field)}
        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${settings[field] ? "bg-teal-600" : "bg-navy-600"}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${settings[field] ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );

  const NumberRow = ({ label, desc, field, suffix }: { label: string; desc?: string; field: keyof typeof settings; suffix?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-navy-700/50">
      <div className="flex-1 pr-4">
        <p className="text-sm text-gray-200">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <input
          type="number"
          className="input-field w-20 text-right py-1 text-sm"
          value={settings[field] as number}
          onChange={(e) => setSettings((p) => ({ ...p, [field]: Number(e.target.value) }))}
        />
        {suffix && <span className="text-xs text-gray-400">{suffix}</span>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="page-subtitle">Global defaults for all accounts</p>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm">Save Changes</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fee Settings */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-2">Fee Configuration</h2>
          <p className="text-xs text-gray-500 mb-4">Default rates applied to all accounts (can be overridden per-account)</p>
          <NumberRow label="LTR Platform Fee" desc="% of monthly rent" field="defaultPlatformFee" suffix="%" />
          <NumberRow label="STR Platform Fee" desc="% of STR revenue" field="strPlatformFee" suffix="%" />
          <NumberRow label="Late Fee Grace Period" desc="Days before late fee applies" field="lateFeeDays" suffix="days" />
          <NumberRow label="Late Fee Amount" desc="Fixed fee after grace period" field="lateFeeAmount" suffix="$" />
        </div>

        {/* Maintenance */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-2">Maintenance Workflow</h2>
          <p className="text-xs text-gray-500 mb-4">Controls for repair approval thresholds</p>
          <NumberRow label="Auto-Approve Under" desc="Repairs below this amount skip owner approval" field="maintenanceAutoApproveUnder" suffix="$" />
          <SwitchRow label="Require 2 Contractor Bids" desc="For jobs above auto-approve threshold" field="requireTwoContractorBids" />
          <SwitchRow label="Notify Tenant on Assignment" desc="SMS + email when contractor is assigned" field="autoNotifyTenantOnAssign" />
          <SwitchRow label="Notify Owner on Submit" desc="Alert owner when tenant submits request" field="autoNotifyOwnerOnSubmit" />
        </div>

        {/* Tenant Settings */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-2">Tenant & Screening</h2>
          <NumberRow label="Min Screening Score" desc="Applications below this score are auto-declined" field="tenantScreeningMinScore" suffix="/100" />
          <NumberRow label="Dispute Escalation" desc="Days before unresolved dispute auto-escalates" field="disputeEscalationDays" suffix="days" />
          <SwitchRow label="Require Renters Insurance" desc="Mandatory proof before lease signing" field="requireRentersInsurance" />
        </div>

        {/* IoT / Smart Home */}
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-2">IoT & Smart Home Alerts</h2>
          <p className="text-xs text-gray-500 mb-4">Configure automated alerts from connected devices</p>
          <SwitchRow label="Noise Sensor Alerts" desc="Alert when STR noise exceeds threshold" field="strNoiseSensorAlerts" />
          <SwitchRow label="Leak Detection Alerts" desc="Immediate alert on moisture detection" field="strLeakDetectionAlerts" />
          <SwitchRow label="Smart Lock Access Logs" desc="Log all entry events to audit trail" field="iotSmartLockLogs" />
        </div>
      </div>

      {/* Fee tiers table */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Platform Plan Tiers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-navy-700">
                <th className="text-left pb-2">Plan</th>
                <th className="text-right pb-2">Monthly Price</th>
                <th className="text-right pb-2">Properties</th>
                <th className="text-right pb-2">Units</th>
                <th className="text-right pb-2">AI Features</th>
              </tr>
            </thead>
            <tbody>
              {[
                { plan: "Starter", price: "$49", props: "1–2", units: "Up to 5", ai: "Basic triage" },
                { plan: "Pro", price: "$239", props: "Up to 10", units: "Up to 30", ai: "Full suite" },
                { plan: "Enterprise", price: "$799+", props: "Unlimited", units: "Unlimited", ai: "Full suite + custom" },
              ].map((row) => (
                <tr key={row.plan} className="border-b border-navy-700/50">
                  <td className="py-2.5 text-gray-200 font-medium">{row.plan}</td>
                  <td className="py-2.5 text-right text-teal-400 font-semibold">{row.price}</td>
                  <td className="py-2.5 text-right text-gray-300">{row.props}</td>
                  <td className="py-2.5 text-right text-gray-300">{row.units}</td>
                  <td className="py-2.5 text-right text-gray-400">{row.ai}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

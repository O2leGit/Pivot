"use client";

import { useState } from "react";
import type { PortalRole } from "@/types";
import type { Page } from "./Dashboard";
import { PROPERTIES, UNITS, TENANTS } from "@/data/demoData";

interface Props {
  role: PortalRole;
  onNavigate: (page: Page) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export default function PropertiesPage({ showToast }: Props) {
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [modeToggles, setModeToggles] = useState<Record<string, string>>({});

  const selectedProp = PROPERTIES.find((p) => p.id === selectedPropId);
  const propUnits = selectedPropId ? UNITS.filter((u) => u.propertyId === selectedPropId) : [];

  const getEffectiveMode = (propId: string, defaultMode: string) =>
    modeToggles[propId] || defaultMode;

  const handleModeToggle = (propId: string, currentMode: string) => {
    const next = currentMode === "LTR" ? "STR" : currentMode === "STR" ? "mixed" : "LTR";
    setModeToggles((prev) => ({ ...prev, [propId]: next }));
    showToast(`Mode updated to ${next}`);
  };

  const modeBadge: Record<string, string> = {
    LTR: "badge-blue",
    STR: "badge-teal",
    mixed: "badge-amber",
  };

  const unitStatusColor: Record<string, string> = {
    occupied: "text-green-400",
    vacant: "text-amber-400",
    maintenance: "text-red-400",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="page-subtitle">Manage your portfolio</p>
        </div>
        <button className="btn-primary text-sm" onClick={() => showToast("Add property wizard coming soon")}>
          + Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROPERTIES.filter((p) => p.ownerId === "o-1").map((prop) => {
          const effectiveMode = getEffectiveMode(prop.id, prop.mode);
          const units = UNITS.filter((u) => u.propertyId === prop.id);
          const occupied = units.filter((u) => u.status === "occupied").length;
          const revenue = prop.monthlyRevenue + prop.strRevenueMTD;
          const isSelected = selectedPropId === prop.id;

          return (
            <div
              key={prop.id}
              className={`card cursor-pointer transition-all ${isSelected ? "border-teal-600/60 bg-navy-700/50" : "hover:border-navy-600"}`}
              onClick={() => setSelectedPropId(isSelected ? null : prop.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{prop.coverImage}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleModeToggle(prop.id, effectiveMode); }}
                  className={`${modeBadge[effectiveMode]} cursor-pointer hover:opacity-80 transition-opacity`}
                >
                  {effectiveMode}
                </button>
              </div>
              <h3 className="font-semibold text-white mb-0.5">{prop.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{prop.address}, {prop.city}, {prop.state}</p>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-navy-900/50 rounded-lg p-2">
                  <div className="font-semibold text-white">{prop.totalUnits}</div>
                  <div className="text-gray-500">Total</div>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-2">
                  <div className="font-semibold text-green-400">{occupied}</div>
                  <div className="text-gray-500">Occupied</div>
                </div>
                <div className="bg-navy-900/50 rounded-lg p-2">
                  <div className={`font-semibold ${prop.totalUnits - occupied > 0 ? "text-amber-400" : "text-gray-400"}`}>
                    {prop.totalUnits - occupied}
                  </div>
                  <div className="text-gray-500">Vacant</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-navy-700 flex items-center justify-between">
                <span className="text-xs text-gray-400">Monthly revenue</span>
                <span className="text-sm font-semibold text-white">${revenue.toLocaleString()}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {prop.amenities.slice(0, 3).map((a) => (
                  <span key={a} className="text-[10px] text-gray-500 bg-navy-900/60 border border-navy-700 rounded-full px-2 py-0.5">{a}</span>
                ))}
                {prop.amenities.length > 3 && (
                  <span className="text-[10px] text-gray-600">+{prop.amenities.length - 3}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unit Detail Panel */}
      {selectedProp && (
        <div className="card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Units — {selectedProp.name}</h2>
            <button onClick={() => setSelectedPropId(null)} className="btn-ghost text-xs">Close</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {propUnits.map((unit) => {
              const tenant = TENANTS.find((t) => t.unitId === unit.id);
              return (
                <div key={unit.id} className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50">
                  <div className="w-10 h-10 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center font-semibold text-sm text-gray-300 shrink-0">
                    {unit.unitNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">Unit {unit.unitNumber}</span>
                      <span className={`text-xs ${unitStatusColor[unit.status]}`}>
                        ● {unit.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">{unit.bedrooms}BR / {unit.bathrooms}BA · {unit.sqft.toLocaleString()} sqft</div>
                    {tenant && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate">{tenant.name}</div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    {unit.rentAmount > 0 ? (
                      <>
                        <div className="text-sm font-semibold text-white">${unit.rentAmount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">/mo</div>
                      </>
                    ) : unit.strNightlyRate ? (
                      <>
                        <div className="text-sm font-semibold text-teal-400">${unit.strNightlyRate}</div>
                        <div className="text-xs text-gray-500">/night</div>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

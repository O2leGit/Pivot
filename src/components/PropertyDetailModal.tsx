"use client";

import { useState } from "react";
import type { Property } from "@/types";
import { UNITS, TENANTS, IOT_EVENTS } from "@/data/demoData";

interface Props {
  property: Property;
  onClose: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

// Mock STR booking data for Mar/Apr/May 2026
const STR_BOOKINGS: Record<string, { start: number; end: number; guest: string }[]> = {
  Mar: [
    { start: 1,  end: 4,  guest: "Chen, R." },
    { start: 8,  end: 11, guest: "Williams" },
    { start: 15, end: 20, guest: "Patel, S." },
    { start: 24, end: 28, guest: "Okafor" },
  ],
  Apr: [
    { start: 5,  end: 9,  guest: "Martinez" },
    { start: 12, end: 16, guest: "Thompson" },
    { start: 20, end: 27, guest: "Kim, J." },
  ],
  May: [
    { start: 2,  end: 6,  guest: "Davis" },
    { start: 10, end: 14, guest: "Nguyen" },
    { start: 18, end: 22, guest: "Brown" },
    { start: 27, end: 31, guest: "Lopez" },
  ],
};

const DAYS_IN_MONTH = { Mar: 31, Apr: 30, May: 31 };

function StrCalendar() {
  return (
    <div className="space-y-3">
      {(["Mar", "Apr", "May"] as const).map((month) => {
        const days = DAYS_IN_MONTH[month];
        const bookings = STR_BOOKINGS[month];
        // Build day array: 0 = available, 1 = booked
        const dayState = Array(days + 1).fill(0);
        bookings.forEach((b) => {
          for (let d = b.start; d <= b.end; d++) dayState[d] = 1;
        });

        return (
          <div key={month}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-300">{month} 2026</span>
              <div className="flex items-center gap-3 text-[10px] text-gray-500">
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-teal-500/70" />Booked</span>
                <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-navy-700" />Available</span>
              </div>
            </div>
            <div className="flex gap-0.5 flex-wrap">
              {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
                <div
                  key={d}
                  title={`${month} ${d}${dayState[d] ? " — Booked" : " — Available"}`}
                  className={`w-[calc(100%/31-1px)] min-w-[6px] h-5 rounded-sm transition-colors ${
                    dayState[d] ? "bg-teal-500/70" : "bg-navy-700/80"
                  }`}
                />
              ))}
            </div>
            <div className="mt-1 space-y-0.5">
              {bookings.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span className="text-teal-400">{month} {b.start}–{b.end}</span>
                  <span>{b.guest}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const IOT_DEVICE_NAMES: Record<string, string> = {
  smart_lock: "August Smart Lock",
  leak_detector: "Moen Flo Leak Detector",
  noise_sensor: "Minut Noise Sensor",
  thermostat: "Nest Thermostat",
  camera: "Ring Camera",
};

const LOCATION_BY_UNIT: Record<string, string> = {
  "u-1": "Front Door",
  "u-2": "Front Door",
  "u-3": "Front Door",
  "u-4": "HVAC Closet",
  "u-5": "Front Door",
  "u-6": "Front Door",
  "u-7": "Cabin Entry",
  "u-8": "Kitchen",
  "u-9": "Common Area",
};

export default function PropertyDetailModal({ property, onClose, showToast }: Props) {
  const [mode, setMode] = useState(property.mode);
  const [modeChanging, setModeChanging] = useState(false);

  const units = UNITS.filter((u) => u.propertyId === property.id);
  const iotEvents = IOT_EVENTS.filter((e) => e.propertyId === property.id);

  const modeBadgeClass = {
    LTR: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    STR: "bg-teal-900/40 text-teal-300 border-teal-700/40",
    mixed: "bg-amber-900/40 text-amber-300 border-amber-700/40",
  };

  const unitStatusColor: Record<string, string> = {
    occupied: "text-green-400",
    vacant: "text-amber-400",
    maintenance: "text-red-400",
  };

  const handleModeToggle = () => {
    setModeChanging(true);
    setTimeout(() => {
      const next = mode === "LTR" ? "STR" : mode === "STR" ? "mixed" : "LTR";
      setMode(next);
      setModeChanging(false);
      showToast(`${property.name} switched to ${next} mode`);
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-panel w-full max-w-2xl overflow-y-auto"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{property.coverImage}</div>
            <div>
              <h2 className="text-base font-semibold text-white">{property.name}</h2>
              <p className="text-xs text-gray-400">{property.address}, {property.city}, {property.state} {property.zip}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost shrink-0">✕</button>
        </div>

        <div className="modal-body space-y-5">
          {/* Mode + stats row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wide ${modeBadgeClass[mode]}`}>
                {mode}
              </span>
              <span className="text-xs text-gray-500 capitalize">{property.type.replace("_", " ")}</span>
            </div>
            {/* Mode toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Switch Mode:</span>
              <button
                onClick={handleModeToggle}
                disabled={modeChanging}
                className={`relative w-14 h-7 rounded-full border transition-all duration-500 ${
                  modeChanging ? "opacity-60" : ""
                } ${
                  mode === "LTR" ? "bg-blue-900/50 border-blue-700/50" :
                  mode === "STR" ? "bg-teal-900/50 border-teal-700/50" :
                  "bg-amber-900/50 border-amber-700/50"
                }`}
              >
                <span className={`absolute top-0.5 w-6 h-6 rounded-full shadow transition-all duration-500 ${
                  mode === "STR" ? "left-7 bg-teal-400" :
                  mode === "mixed" ? "left-3.5 bg-amber-400" :
                  "left-0.5 bg-blue-400"
                }`} />
              </button>
              <span className="text-xs text-gray-400">{mode === "LTR" ? "→ STR" : mode === "STR" ? "→ Mixed" : "→ LTR"}</span>
            </div>
          </div>

          {/* Seasonal schedule */}
          {(mode === "mixed" || mode === "STR") && (
            <div className="p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <p className="text-xs font-medium text-amber-300 mb-1">Seasonal Schedule</p>
              <div className="flex gap-4 text-xs text-gray-300">
                <span>🌞 STR: <span className="text-teal-400">May 15 → Sep 15</span></span>
                <span>🏠 LTR: <span className="text-blue-400">Sep 15 → May 15</span></span>
              </div>
            </div>
          )}

          {/* STR Calendar OR Unit List */}
          {(mode === "STR" || (mode === "mixed" && property.strRevenueMTD > 0)) ? (
            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">STR Availability Calendar</h3>
              <StrCalendar />
            </div>
          ) : null}

          {/* Unit list */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Units ({units.length})
            </h3>
            <div className="space-y-2">
              {units.map((unit) => {
                const tenant = TENANTS.find((t) => t.unitId === unit.id);
                return (
                  <div key={unit.id} className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50">
                    <div className="w-9 h-9 rounded-lg bg-navy-800 border border-navy-700 flex items-center justify-center text-xs font-semibold text-gray-300 shrink-0">
                      {unit.unitNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-medium">Unit {unit.unitNumber}</span>
                        <span className={`text-xs ${unitStatusColor[unit.status]}`}>● {unit.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{unit.bedrooms}BR/{unit.bathrooms}BA · {unit.sqft.toLocaleString()} sqft</p>
                      {tenant && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {tenant.name} · Lease ends {new Date(tenant.leaseEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </p>
                      )}
                      {!tenant && unit.status === "vacant" && (
                        <p className="text-xs text-amber-400 mt-0.5">Vacant — listing active</p>
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

          {/* IoT Devices */}
          {iotEvents.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">IoT Devices</h3>
              <div className="space-y-2">
                {iotEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center gap-3 p-3 bg-navy-900/50 rounded-lg border border-navy-700/50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      evt.severity === "critical" ? "bg-red-900/40" :
                      evt.severity === "warning" ? "bg-amber-900/40" :
                      "bg-teal-900/40"
                    }`}>
                      <svg className={`w-4 h-4 ${
                        evt.severity === "critical" ? "text-red-400" :
                        evt.severity === "warning" ? "text-amber-400" :
                        "text-teal-400"
                      }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200">
                        {IOT_DEVICE_NAMES[evt.deviceType] ?? evt.deviceType.replace("_", " ")}
                        {evt.unitId && LOCATION_BY_UNIT[evt.unitId] && (
                          <span className="text-gray-500"> — {LOCATION_BY_UNIT[evt.unitId]}</span>
                        )}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">{evt.description}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${
                      evt.resolved
                        ? "bg-green-900/30 text-green-400 border-green-700/30"
                        : evt.severity === "critical"
                        ? "bg-red-900/30 text-red-400 border-red-700/30"
                        : "bg-amber-900/30 text-amber-400 border-amber-700/30"
                    }`}>
                      {evt.resolved ? "Resolved" : evt.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.map((a) => (
                <span key={a} className="text-xs text-gray-400 bg-navy-800 border border-navy-700 rounded-full px-2.5 py-1">{a}</span>
              ))}
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary w-full">Close</button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PROPERTIES, PL_DATA_P1, PL_DATA_P2, PL_DATA_P3 } from "@/data/demoData";

const PL_BY_PROP: Record<string, typeof PL_DATA_P1> = {
  "p-1": PL_DATA_P1,
  "p-2": PL_DATA_P2,
  "p-3": PL_DATA_P3,
};

const COLORS = { teal: "#0D9488", blue: "#3B82F6", amber: "#F59E0B", red: "#EF4444", green: "#10B981" };

export default function PLPage() {
  const [selectedPropId, setSelectedPropId] = useState("all");

  const props = PROPERTIES.filter((p) => p.ownerId === "o-1");

  const chartData = (() => {
    if (selectedPropId === "all") {
      return PL_DATA_P1.map((row, i) => ({
        month: row.month,
        rentIncome: row.rentIncome + PL_DATA_P2[i].rentIncome + PL_DATA_P3[i].rentIncome,
        strIncome: row.strIncome + PL_DATA_P2[i].strIncome + PL_DATA_P3[i].strIncome,
        maintenance: row.maintenanceCost + PL_DATA_P2[i].maintenanceCost + PL_DATA_P3[i].maintenanceCost,
        platformFees: row.platformFees + PL_DATA_P2[i].platformFees + PL_DATA_P3[i].platformFees,
        netIncome: row.netIncome + PL_DATA_P2[i].netIncome + PL_DATA_P3[i].netIncome,
      }));
    }
    const data = PL_BY_PROP[selectedPropId] || PL_DATA_P1;
    return data.map((row) => ({
      month: row.month,
      rentIncome: row.rentIncome,
      strIncome: row.strIncome,
      maintenance: row.maintenanceCost,
      platformFees: row.platformFees,
      netIncome: row.netIncome,
    }));
  })();

  const totals = chartData.reduce((acc, row) => ({
    revenue: acc.revenue + row.rentIncome + row.strIncome,
    expenses: acc.expenses + row.maintenance + row.platformFees,
    net: acc.net + row.netIncome,
  }), { revenue: 0, expenses: 0, net: 0 });

  const latestMonth = chartData[chartData.length - 1];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Profit & Loss</h1>
          <p className="page-subtitle">6-month financial summary · Oct 2025 – Mar 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedPropId}
            onChange={(e) => setSelectedPropId(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Properties</option>
            {props.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <button
            onClick={() => {
              const rows = ["Month,Rent,STR,Maintenance,Platform Fees,Net Income",
                ...chartData.map(r => `${r.month},${r.rentIncome},${r.strIncome},${r.maintenance},${r.platformFees},${r.netIncome}`)
              ].join("\n");
              const blob = new Blob([rows], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "pivot-pl.csv"; a.click();
              URL.revokeObjectURL(url);
            }}
            className="btn-secondary text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            CSV
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="kpi-label">6-Mo Revenue</div>
          <div className="kpi-value">${totals.revenue.toLocaleString()}</div>
          <div className="text-xs text-gray-500">rent + STR</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">6-Mo Expenses</div>
          <div className="kpi-value text-red-400">${totals.expenses.toLocaleString()}</div>
          <div className="text-xs text-gray-500">maint. + fees</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">6-Mo Net Income</div>
          <div className="kpi-value text-green-400">${totals.net.toLocaleString()}</div>
          <div className="kpi-delta-up">↑ margin {Math.round((totals.net / totals.revenue) * 100)}%</div>
        </div>
      </div>

      {/* Main chart — stacked revenue vs expenses */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Revenue Breakdown</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27426c" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#1B2A4A", border: "1px solid #27426c", borderRadius: "8px", fontSize: "12px" }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
            />
            <Legend wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }} />
            <Bar dataKey="rentIncome" name="Rent Income" stackId="rev" fill={COLORS.teal} isAnimationActive={false} />
            <Bar dataKey="strIncome" name="STR Income" stackId="rev" fill={COLORS.blue} radius={[4, 4, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Per-property stacked chart (all properties view only) */}
      {selectedPropId === "all" && (
        <div className="card">
          <h2 className="text-sm font-semibold text-white mb-4">Net Income by Property</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={PL_DATA_P1.map((row, i) => ({
                month: row.month,
                "Harlow Apts": row.netIncome,
                "Pacific Pines": PL_DATA_P2[i].netIncome,
                "Bayview Lofts": PL_DATA_P3[i].netIncome,
              }))}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#27426c" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#1B2A4A", border: "1px solid #27426c", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, ""]}
              />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }} />
              <Bar dataKey="Harlow Apts" stackId="a" fill={COLORS.teal} isAnimationActive={false} />
              <Bar dataKey="Pacific Pines" stackId="a" fill={COLORS.blue} isAnimationActive={false} />
              <Bar dataKey="Bayview Lofts" stackId="a" fill={COLORS.amber} radius={[4, 4, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Net income trend */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Net Income Trend</h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27426c" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#1B2A4A", border: "1px solid #27426c", borderRadius: "8px", fontSize: "12px" }}
              formatter={(v: number) => [`$${v.toLocaleString()}`, "Net Income"]}
            />
            <Line
              type="monotone"
              dataKey="netIncome"
              stroke={COLORS.green}
              strokeWidth={2.5}
              isAnimationActive={false}
              dot={(props: { cx: number; cy: number; payload: { netIncome: number } }) => (
                <circle
                  key={`dot-${props.cx}`}
                  cx={props.cx}
                  cy={props.cy}
                  r={4}
                  fill={props.payload.netIncome >= 0 ? COLORS.green : COLORS.red}
                  stroke="none"
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly detail table */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Monthly Detail</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-navy-700">
                <th className="text-left pb-2">Month</th>
                <th className="text-right pb-2">Rent</th>
                <th className="text-right pb-2">STR</th>
                <th className="text-right pb-2">Maintenance</th>
                <th className="text-right pb-2">Platform Fees</th>
                <th className="text-right pb-2 text-green-400">Net</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, i) => (
                <tr key={i} className="border-b border-navy-700/50 hover:bg-navy-700/20 transition-colors">
                  <td className="py-2.5 text-gray-300 font-medium">{row.month}</td>
                  <td className="py-2.5 text-right text-gray-300">${row.rentIncome.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-blue-400">${row.strIncome.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-red-400">-${row.maintenance.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-amber-400">-${row.platformFees.toLocaleString()}</td>
                  <td className="py-2.5 text-right text-green-400 font-semibold">${row.netIncome.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-navy-600">
                <td className="pt-2.5 text-white font-semibold">Total</td>
                <td className="pt-2.5 text-right text-gray-300 font-medium">${chartData.reduce((s, r) => s + r.rentIncome, 0).toLocaleString()}</td>
                <td className="pt-2.5 text-right text-blue-400 font-medium">${chartData.reduce((s, r) => s + r.strIncome, 0).toLocaleString()}</td>
                <td className="pt-2.5 text-right text-red-400 font-medium">-${chartData.reduce((s, r) => s + r.maintenance, 0).toLocaleString()}</td>
                <td className="pt-2.5 text-right text-amber-400 font-medium">-${chartData.reduce((s, r) => s + r.platformFees, 0).toLocaleString()}</td>
                <td className="pt-2.5 text-right text-green-400 font-bold">${totals.net.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

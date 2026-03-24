"use client";

import { useState } from "react";

// ─── Comparison data ───────────────────────────────────────────────────────────
const COMPETITORS = ["Pivot", "Buildium", "AppFolio", "TenantCloud", "Baselane", "Hemlane"];

type CellValue = "yes" | "partial" | "no" | "exclusive" | string;

interface FeatureRow {
  feature: string;
  category: string;
  cells: Record<string, CellValue>;
  pivotNote?: string;
  pivotExclusive?: boolean;
}

const FEATURE_ROWS: FeatureRow[] = [
  {
    feature: "AI Tenant Screening",
    category: "AI",
    pivotNote: "Score 0–100, from unit 1",
    pivotExclusive: true,
    cells: { Pivot: "exclusive", Buildium: "partial", AppFolio: "partial", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "AI Lease Drafting",
    category: "AI",
    pivotNote: "State-specific, plain-English",
    pivotExclusive: true,
    cells: { Pivot: "exclusive", Buildium: "no", AppFolio: "no", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "AI Maintenance Triage",
    category: "AI",
    pivotNote: "Photo + text analysis",
    cells: { Pivot: "yes", Buildium: "no", AppFolio: "partial", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "AI Chat Assistant",
    category: "AI",
    pivotNote: "Leasing + full operations",
    cells: { Pivot: "yes", Buildium: "no", AppFolio: "partial", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "STR/LTR Mode Switching",
    category: "Rental",
    pivotNote: "Seasonal automation",
    pivotExclusive: true,
    cells: { Pivot: "exclusive", Buildium: "no", AppFolio: "no", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "Open IoT API",
    category: "Technology",
    pivotNote: "Any webhook device",
    pivotExclusive: true,
    cells: { Pivot: "exclusive", Buildium: "no", AppFolio: "no", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "Smart Lock Integration",
    category: "Technology",
    pivotNote: "Auto access codes per job",
    pivotExclusive: true,
    cells: { Pivot: "exclusive", Buildium: "no", AppFolio: "no", TenantCloud: "no", Baselane: "no", Hemlane: "no" },
  },
  {
    feature: "Dynamic Rent Pricing",
    category: "Rental",
    pivotNote: "LTR + STR market data",
    cells: { Pivot: "yes", Buildium: "no", AppFolio: "no", TenantCloud: "no", Baselane: "partial", Hemlane: "no" },
  },
  {
    feature: "Contractor Portal",
    category: "Operations",
    pivotNote: "Mobile-first + Stripe payouts",
    cells: { Pivot: "yes", Buildium: "partial", AppFolio: "yes", TenantCloud: "no", Baselane: "no", Hemlane: "partial" },
  },
  {
    feature: "Owner P&L Dashboard",
    category: "Finance",
    pivotNote: "Per-property, CSV export",
    cells: { Pivot: "yes", Buildium: "yes", AppFolio: "yes", TenantCloud: "partial", Baselane: "yes", Hemlane: "yes" },
  },
  {
    feature: "Mobile-First Tenant UX",
    category: "UX",
    cells: { Pivot: "yes", Buildium: "yes", AppFolio: "yes", TenantCloud: "partial", Baselane: "yes", Hemlane: "yes" },
  },
  {
    feature: "Min. Portfolio Size",
    category: "Pricing",
    cells: { Pivot: "1 unit", Buildium: "1 unit", AppFolio: "50 units", TenantCloud: "1 unit", Baselane: "1 unit", Hemlane: "1 unit" },
  },
  {
    feature: "Starting Price",
    category: "Pricing",
    cells: { Pivot: "$19/mo", Buildium: "$55/mo", AppFolio: "$280/mo", TenantCloud: "$18/mo", Baselane: "Free", Hemlane: "$30/mo" },
  },
];

// ─── Deep dive features ────────────────────────────────────────────────────────
interface DeepDive {
  title: string;
  icon: string;
  exclusive?: boolean;
  what: string;
  how: string[];
  why: string;
  vs: string;
  impact: { owner: string; tenant: string; contractor?: string };
}

const DEEP_DIVES: DeepDive[] = [
  {
    title: "AI Tenant Screening",
    icon: "🤖",
    exclusive: true,
    what: "Pivot's AI analyzes rental history, income verification, credit signals, and prior eviction data to produce a 0–100 score with an advisory tier (Approved / Conditional / Declined). Fair Housing Act compliant — score is advisory only.",
    how: ["Go to Tenants → Screening tab", "Click 'Screen Applicant'", "AI runs analysis and returns score + recommendation within seconds", "Review PDF summary and make your own decision"],
    why: "Landlords using AI screening report 40% fewer late-payment incidents in year one. Available from unit 1 — no minimum portfolio size.",
    vs: "Buildium and AppFolio offer basic screening add-ons starting at $50+ units. TenantCloud, Baselane, and Hemlane have no AI screening.",
    impact: {
      owner: "Saves 2–3 hours per application vs. manual screening. Reduces bad tenant risk by flagging income and rental history concerns upfront. Catching just one bad tenant prevents $3,000–$8,000 in lost rent and eviction costs.",
      tenant: "Faster decisions — minutes vs. days — means applicants hear back same day instead of waiting a week. Transparent scoring reduces anxiety about 'why did I get rejected?'",
    },
  },
  {
    title: "AI Lease Drafting",
    icon: "📄",
    exclusive: true,
    what: "Generate state-specific lease agreements in seconds. Pivot AI incorporates your property details, local rent control rules, and customizable clauses. Includes plain-English explanations of each section for tenants.",
    how: ["Go to Properties → select unit → 'Draft Lease'", "AI pre-fills property details, term, and rent amount", "Customize clauses from the template library", "Send for e-signature with one click"],
    why: "Reduces lease prep time from hours to minutes. State-specific language ensures enforceability. Plain-English summaries increase tenant trust and reduce disputes.",
    vs: "No competitor offers AI lease drafting as a native feature. Most require manual uploads or third-party services like DocuSign with no AI assistance.",
    impact: {
      owner: "Eliminates $500–$1,500 in attorney fees per lease. Generates a state-compliant lease in minutes, not weeks. Fewer disputes because ambiguous clauses are flagged and rewritten automatically.",
      tenant: "Plain-English clause explanations appear alongside legal language, reducing 'I didn't know that was in my lease' confusion. Builds trust from day one.",
    },
  },
  {
    title: "AI Maintenance Triage",
    icon: "🔧",
    what: "Tenants submit maintenance requests with photos and descriptions. Pivot AI analyzes both to classify severity, estimate repair cost, and auto-route to the right contractor specialty — before you even see it.",
    how: ["Tenant submits request with photo in the Tenant portal", "AI classifies: urgency, category (plumbing/electrical/HVAC/general), estimated cost", "Auto-routes to vetted contractor in the correct specialty", "Owner receives notification with AI summary for approval"],
    why: "Emergency responses average 4x faster with AI triage. Prevents low-value interruptions — owners only see requests that need their decision.",
    vs: "AppFolio offers basic maintenance routing at 200+ units. Buildium has manual routing only. No competitor offers photo-based AI triage from unit 1.",
    impact: {
      owner: "Saves 45 minutes per request in back-and-forth diagnosis. Auto-categorizes and estimates cost so owners approve in one click rather than playing phone tag for 2 days.",
      tenant: "Immediate acknowledgment and live status updates — no more 'did anyone see my request?' anxiety. Average resolution time drops from 5 days to 1.5 days.",
      contractor: "Clear scope of work before arriving means no wasted trips. Contractors arrive with the right tools and parts — fewer revisits, more billable jobs per day.",
    },
  },
  {
    title: "AI Leasing Assistant",
    icon: "💬",
    what: "A 24/7 AI chat assistant handles pre-application inquiries, screens unit availability, answers lease FAQs, and even negotiates move-in dates — all without landlord involvement.",
    how: ["Available from the bottom-right AI button in every portal", "Tenants can ask about lease terms, rent, maintenance status", "Owners can ask about portfolio performance, occupancy, cash flow", "Contractors can ask about job details, access codes, payment status"],
    why: "Landlords report 60% reduction in routine tenant inquiries after enabling the AI assistant. 24/7 availability means no missed leads on weekend inquiries.",
    vs: "AppFolio has an AI leasing assistant for inquiries only. Buildium, TenantCloud, Baselane, and Hemlane have no AI chat.",
    impact: {
      owner: "60% reduction in routine tenant inquiries — fewer interruptions during your day. Weekend and evening inquiries get answered instantly, capturing leads that would otherwise bounce to a competitor.",
      tenant: "24/7 answers to 'when is rent due?', 'who do I call for repairs?', and 'can I renew early?' — without waiting for business hours.",
    },
  },
  {
    title: "STR/LTR Mode Switching",
    icon: "🔄",
    exclusive: true,
    what: "Switch any unit between Short-Term Rental (STR) and Long-Term Rental (LTR) mode with a single toggle. Set seasonal schedules — e.g., STR from May 15 to Sep 15, automatically reverts to LTR after.",
    how: ["Go to Properties → click the mode badge (LTR/STR/Mixed)", "Select target mode and confirm transition", "Set seasonal schedule: STR start date, LTR start date", "Pivot automatically adjusts pricing, availability, and tenant notifications"],
    why: "Landlords with seasonal properties report 15–25% higher annual revenue when optimizing STR/LTR timing. No manual transition overhead.",
    vs: "No competitor offers automated STR/LTR switching. Airbnb and VRBO are separate platforms with no LTR integration.",
    impact: {
      owner: "Owners with seasonal properties report 15–25% higher annual revenue by optimizing STR peak seasons vs. LTR off-season stability. Automated switching eliminates the 5–10 hours of manual calendar work per property, per season change.",
      tenant: "LTR tenants receive advance notice of seasonal transitions and get priority renewal offers — no surprise move-outs.",
    },
  },
  {
    title: "Open IoT API",
    icon: "📡",
    exclusive: true,
    what: "Pivot's IoT layer accepts webhooks from any smart home device — smart locks, noise sensors, leak detectors, thermostats, cameras. No proprietary hardware required.",
    how: ["Go to Settings → IoT Integrations → Add Device", "Enter webhook URL for your device", "Map device events to Pivot actions (e.g., lock tamper → alert owner)", "View real-time IoT event log in the Properties dashboard"],
    why: "Property managers with IoT integrations reduce emergency maintenance costs by 30% through early detection. Works with August, Schlage, Minut, Wyze, and any webhook-compatible device.",
    vs: "No property management platform offers an open IoT API. All competitor integrations are proprietary and limited to 1–2 hardware partners.",
    impact: {
      owner: "Leak detection alone prevents an average $10,000–$50,000 in water damage per incident. Smart lock access codes eliminate the need to physically hand off keys — saving 30+ minutes per contractor visit. Noise monitoring prevents party damage before it happens.",
      tenant: "Tenants feel safer with 24/7 automated monitoring. Water leak alerts protect their belongings. Smart lock codes mean they never have to be home for repairs.",
      contractor: "Instant access codes — no waiting for a key handoff. Contractors start billable work immediately upon arrival.",
    },
  },
  {
    title: "Smart Lock Access Codes",
    icon: "🔐",
    exclusive: true,
    what: "When a contractor is assigned a job, Pivot automatically generates a time-limited access code for the smart lock at that unit. Code expires when the job is marked complete.",
    how: ["Owner approves contractor job assignment", "Pivot auto-generates unique access code (e.g., 4821)", "Contractor sees code in their Job Card on mobile", "Code auto-expires after job completion or 24 hours"],
    why: "Eliminates key handoff logistics. Creates an audit trail of property access. Tenants never have to be home for repairs.",
    vs: "No competitor automates access code generation. Property managers spend an average of 2 hours/week on key coordination.",
    impact: {
      owner: "Eliminates 2+ hours/week of key coordination logistics. Full audit trail of property access — time-stamped, contractor-specific codes create legal accountability. No lingering access after job completion.",
      tenant: "Never have to take time off work to let contractors in. Units are accessed only during approved windows. Security is maintained because codes auto-expire.",
      contractor: "Instant, mobile-accessible codes mean contractors aren't wasting billable time waiting for key handoffs. Start working immediately upon arrival.",
    },
  },
  {
    title: "Dynamic Rent Pricing",
    icon: "📈",
    what: "Pivot pulls real-time market data from Rentometer (LTR) and AirDNA (STR) to suggest optimal rent pricing for each unit, updated monthly.",
    how: ["Go to Properties → select unit → 'Pricing Insights'", "View current rent vs. market range", "See AI-suggested price adjustment with confidence level", "Apply suggestion or set custom price with one click"],
    why: "Landlords using dynamic pricing capture 8–12% more annual revenue on average. Prevents leaving money on the table in rising markets.",
    vs: "Baselane offers basic rent benchmarking. No other competitor integrates both LTR and STR pricing data with AI suggestions.",
    impact: {
      owner: "Owners who price at the 75th percentile (vs. guessing) earn an average $200–$400/month more per unit. That's $2,400–$4,800/year per unit in additional revenue — with zero extra work.",
      tenant: "Data-driven pricing means tenants know they're paying fair market rate, not an inflated guess. Reduces rent negotiation friction and improves move-in trust.",
    },
  },
  {
    title: "Contractor Portal",
    icon: "🏗️",
    what: "A full mobile-first portal for contractors: browse available jobs, accept work, get access codes, upload before/after photos, submit invoices, and receive payment via Stripe Connect in 48 hours.",
    how: ["Contractor logs in via mobile browser", "Browse available jobs with tap-to-call tenant contact", "Accept job → see access code + property details", "Upload photos on-site → submit invoice → get paid in 48hrs"],
    why: "Faster contractor turnaround means shorter maintenance resolution times for tenants. Stripe Connect payouts eliminate check delays and accounting overhead.",
    vs: "Buildium and AppFolio have basic contractor work order systems with no mobile portal. Hemlane has limited contractor management. TenantCloud and Baselane have none.",
    impact: {
      owner: "48-hour payouts attract higher-quality contractors who prioritize Pivot jobs. Better contractors mean better work quality, fewer callbacks, and happier tenants. Before/after photos create accountability on both sides.",
      tenant: "Top contractors choose platforms that pay quickly — meaning tenants get better, faster repairs. No more waiting 3 weeks for a licensed plumber.",
      contractor: "48-hour payout vs. industry standard 14–30 days is a game-changer. Predictable cash flow lets contractors take on more jobs with confidence. Mobile-first means less admin, more billable hours.",
    },
  },
  {
    title: "Owner P&L Dashboard",
    icon: "💰",
    what: "Per-property profit & loss reporting with 6-month trends, revenue vs. expense breakdowns, and one-click CSV export for your accountant or tax prep.",
    how: ["Go to P&L in the Owner portal", "Filter by property, date range", "View stacked bar chart: income vs. expenses per month", "Download CSV with full line-item detail"],
    why: "Landlords spend an average of 6 hours/year preparing tax documents. Pivot's P&L export reduces that to minutes.",
    vs: "All major competitors offer basic P&L. Pivot's advantage: per-property granularity, STR income tracking, and seamless CSV export — all from unit 1.",
    impact: {
      owner: "Eliminates 4–6 hours/month of manual spreadsheet tracking. Real-time visibility means owners spot expense creep immediately — not at tax time when it's too late. CSV export saves $200–$500/year in accountant prep fees.",
      tenant: "Financially healthy landlords maintain properties better. P&L visibility helps owners plan maintenance budgets proactively rather than reactively.",
    },
  },
];

// ─── Quick start guides ────────────────────────────────────────────────────────
const QUICK_STARTS = [
  {
    role: "Tenant",
    color: "teal",
    icon: "🏠",
    steps: [
      "Log in with your email → you land on your Rent Dashboard",
      "Pay rent with one click → AutoPay available",
      "Submit a maintenance request → upload photos, AI triages instantly",
      "View your lease → download PDF, see key dates",
      "Message your landlord → threaded conversations, read receipts",
    ],
  },
  {
    role: "Owner",
    color: "blue",
    icon: "📊",
    steps: [
      "Review dashboard KPIs → revenue, occupancy, maintenance alerts",
      "Click any property card → view units, IoT devices, mode toggle",
      "Approve maintenance estimates → one-click approval with cost review",
      "Check P&L → per-property breakdown, download CSV",
      "Screen new tenants → AI score + recommendation in seconds",
    ],
  },
  {
    role: "Contractor",
    color: "amber",
    icon: "🔧",
    steps: [
      "Browse available job requests → sorted by urgency and pay",
      "Accept a job → get address, unit number, and access code",
      "View your weekly schedule → time-block calendar view",
      "Complete work → upload before/after photos on mobile",
      "Submit invoice → get paid via Stripe in 48 hours",
    ],
  },
  {
    role: "Admin",
    color: "purple",
    icon: "⚙️",
    steps: [
      "Monitor MRR growth → AreaChart with trend line",
      "Vet new contractors → review specialty, insurance, background check",
      "Resolve disputes → owner vs. tenant with evidence review",
      "Configure platform fees → percentage splits, late fee rules",
      "Review audit log → every action logged with before/after diff",
    ],
  },
];

// ─── Pricing tiers ─────────────────────────────────────────────────────────────
const PRICING = [
  {
    name: "Starter",
    price: "$19",
    period: "/mo",
    units: "1–5 units",
    highlight: false,
    badge: "14-day free trial",
    features: [
      "AI tenant screening",
      "Maintenance triage",
      "Tenant & owner portals",
      "P&L reporting",
      "1 contractor license",
      "5GB document storage",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    period: "/mo",
    units: "6–20 units",
    highlight: true,
    badge: "Most popular",
    features: [
      "Everything in Starter",
      "STR/LTR mode switching",
      "Dynamic rent pricing",
      "IoT integrations (5 devices)",
      "3 contractor licenses",
      "AI lease drafting",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    units: "21–50 units",
    highlight: false,
    features: [
      "Everything in Growth",
      "Unlimited IoT devices",
      "Unlimited contractor licenses",
      "Custom fee structures",
      "White-label option",
      "API access",
      "Dedicated account manager",
    ],
  },
  {
    name: "Custom",
    price: "Contact",
    period: "",
    units: "50+ units",
    highlight: false,
    features: [
      "Everything in Pro",
      "Custom SLA",
      "On-premise option",
      "Custom integrations",
      "Volume pricing",
      "Enterprise SSO",
      "24/7 phone support",
    ],
  },
];

// ─── Cell renderer ─────────────────────────────────────────────────────────────
function Cell({ value, isPivot }: { value: CellValue; isPivot?: boolean }) {
  if (value === "yes" || value === "exclusive") {
    return (
      <div className="flex items-center justify-center gap-1">
        <span className="text-green-400 text-base">✓</span>
        {value === "exclusive" && isPivot && (
          <span className="text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full px-1.5 py-0.5 leading-none">EXCLUSIVE</span>
        )}
      </div>
    );
  }
  if (value === "partial") return <span className="text-amber-400 text-base">~</span>;
  if (value === "no") return <span className="text-gray-600 text-base">—</span>;
  // text values like "$19/mo", "1 unit"
  return <span className={`text-xs font-medium ${isPivot ? "text-teal-300" : "text-gray-400"}`}>{value}</span>;
}

export default function FeaturesPage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"compare" | "deep-dive" | "guide" | "pricing">("compare");

  const sections = [
    { id: "compare", label: "How We Compare" },
    { id: "deep-dive", label: "Feature Deep Dives" },
    { id: "guide", label: "Quick Start Guide" },
    { id: "pricing", label: "Pricing" },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Features & Comparison Guide</h1>
        <p className="text-sm text-gray-400 mt-0.5">Everything you need to know about Pivot — and how it stacks up.</p>
      </div>

      {/* ROI Summary Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950/60 via-navy-800 to-blue-950/40 border border-teal-700/40 p-5">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-teal-400" />
          <div className="absolute right-20 -bottom-8 w-32 h-32 rounded-full bg-blue-400" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">💡</span>
            <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Platform ROI</span>
          </div>
          <p className="text-base font-semibold text-white leading-snug mb-4">
            Pivot saves the average landlord <span className="text-teal-300">15–20 hours per month</span> and <span className="text-teal-300">$3,000–$5,000 per year</span> in operational costs — while delivering a tenant experience that drives <span className="text-green-300">90%+ retention</span> and attracting top-tier contractors with <span className="text-amber-300">48-hour payouts</span>.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: "15–20 hrs", label: "saved/month", color: "teal" },
              { value: "$3–5K", label: "saved/year", color: "green" },
              { value: "90%+", label: "tenant retention", color: "blue" },
              { value: "48 hrs", label: "contractor payout", color: "amber" },
            ].map((stat) => {
              const colors: Record<string, string> = {
                teal: "text-teal-300",
                green: "text-green-300",
                blue: "text-blue-300",
                amber: "text-amber-300",
              };
              return (
                <div key={stat.label} className="bg-navy-900/60 border border-navy-700/60 rounded-xl p-3 text-center">
                  <div className={`text-xl font-black ${colors[stat.color]}`}>{stat.value}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 bg-navy-900 border border-navy-700 rounded-xl p-1 overflow-x-auto no-scrollbar">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 min-w-max px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeSection === s.id
                ? "bg-teal-600 text-white shadow"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Section A: Comparison ── */}
      {activeSection === "compare" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-white">Pivot vs. the Competition</h2>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-300 bg-teal-900/30 border border-teal-700/40 rounded-full px-2.5 py-1">
              <span className="text-green-400">✓</span> = Full support &nbsp;
              <span className="text-amber-400">~</span> = Partial/add-on &nbsp;
              <span className="text-gray-600">—</span> = Not available
            </div>
          </div>

          {/* Scrollable comparison table */}
          <div className="card overflow-x-auto">
            <table className="w-full text-xs min-w-[640px]">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left py-3 px-3 text-gray-400 font-medium w-48">Feature</th>
                  {COMPETITORS.map((c) => (
                    <th
                      key={c}
                      className={`py-3 px-2 text-center font-semibold ${
                        c === "Pivot"
                          ? "text-teal-300"
                          : "text-gray-400"
                      }`}
                    >
                      {c === "Pivot" ? (
                        <div className="flex flex-col items-center gap-0.5">
                          <span className="text-teal-300">{c}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                        </div>
                      ) : c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-navy-700/50 ${i % 2 === 0 ? "" : "bg-navy-900/20"}`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-medium text-gray-200">{row.feature}</div>
                      {row.pivotNote && row.pivotExclusive && (
                        <div className="text-[10px] text-teal-400 mt-0.5">{row.pivotNote}</div>
                      )}
                    </td>
                    {COMPETITORS.map((c) => (
                      <td key={c} className={`py-2.5 px-2 text-center ${c === "Pivot" ? "bg-teal-950/20" : ""}`}>
                        <Cell value={row.cells[c]} isPivot={c === "Pivot"} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Exclusive features callout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🔄", title: "STR/LTR Switching", desc: "The only platform with automated seasonal mode transitions — no manual work." },
              { icon: "📡", title: "Open IoT API", desc: "Connect any smart device via webhook. No proprietary hardware lock-in." },
              { icon: "🤖", title: "AI from Unit 1", desc: "Full AI features available at every portfolio size — not locked behind enterprise tiers." },
            ].map((item) => (
              <div key={item.title} className="card border-teal-700/40 bg-teal-950/20">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{item.title}</span>
                  <span className="text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full px-1.5 py-0.5">PIVOT EXCLUSIVE</span>
                </div>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section B: Deep Dives ── */}
      {activeSection === "deep-dive" && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">Click any feature to expand the full walkthrough.</p>
          {DEEP_DIVES.map((f) => {
            const isOpen = expandedFeature === f.title;
            return (
              <div
                key={f.title}
                className={`card transition-all ${isOpen ? "border-teal-700/60" : "border-navy-700 hover:border-navy-600"}`}
              >
                <button
                  onClick={() => setExpandedFeature(isOpen ? null : f.title)}
                  className="w-full text-left flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{f.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{f.title}</span>
                        {f.exclusive && (
                          <span className="text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full px-1.5 py-0.5">PIVOT EXCLUSIVE</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="mt-4 space-y-4 border-t border-navy-700 pt-4">
                    <div>
                      <p className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider mb-1">What it does</p>
                      <p className="text-sm text-gray-300">{f.what}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-2">How to use it</p>
                      <ol className="space-y-1.5">
                        {f.how.map((step, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                            <span className="w-5 h-5 rounded-full bg-navy-700 border border-navy-600 text-[10px] font-bold text-gray-400 flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                    {/* Business Impact */}
                    <div>
                      <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-2">Business Impact</p>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2.5 p-3 bg-blue-950/30 border border-blue-700/30 rounded-lg">
                          <span className="text-base shrink-0">🏠</span>
                          <div>
                            <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-0.5">For Owners</p>
                            <p className="text-sm text-gray-300">{f.impact.owner}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 p-3 bg-teal-950/30 border border-teal-700/30 rounded-lg">
                          <span className="text-base shrink-0">🙋</span>
                          <div>
                            <p className="text-[10px] font-bold text-teal-300 uppercase tracking-wider mb-0.5">For Tenants</p>
                            <p className="text-sm text-gray-300">{f.impact.tenant}</p>
                          </div>
                        </div>
                        {f.impact.contractor && (
                          <div className="flex items-start gap-2.5 p-3 bg-amber-950/30 border border-amber-700/30 rounded-lg">
                            <span className="text-base shrink-0">🔧</span>
                            <div>
                              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">For Contractors</p>
                              <p className="text-sm text-gray-300">{f.impact.contractor}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-green-950/30 border border-green-700/30 rounded-lg">
                        <p className="text-[11px] font-semibold text-green-400 uppercase tracking-wider mb-1">Why it matters</p>
                        <p className="text-sm text-gray-300">{f.why}</p>
                      </div>
                      <div className="p-3 bg-navy-900/50 border border-navy-700/50 rounded-lg">
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">vs. Competition</p>
                        <p className="text-sm text-gray-400">{f.vs}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Section C: Quick Start ── */}
      {activeSection === "guide" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">Step-by-step walkthroughs for each portal user.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {QUICK_STARTS.map((qs) => {
              const colorMap: Record<string, { header: string; num: string; border: string }> = {
                teal:   { header: "bg-teal-900/40 border-teal-700/50",   num: "bg-teal-600 text-white",   border: "border-teal-700/40" },
                blue:   { header: "bg-blue-900/40 border-blue-700/50",   num: "bg-blue-600 text-white",   border: "border-blue-700/40" },
                amber:  { header: "bg-amber-900/40 border-amber-700/50", num: "bg-amber-500 text-white",  border: "border-amber-700/40" },
                purple: { header: "bg-purple-900/40 border-purple-700/50",num:"bg-purple-600 text-white", border: "border-purple-700/40" },
              };
              const c = colorMap[qs.color];
              return (
                <div key={qs.role} className={`card ${c.border}`}>
                  <div className={`flex items-center gap-3 p-3 rounded-lg mb-4 ${c.header}`}>
                    <span className="text-2xl">{qs.icon}</span>
                    <div>
                      <div className="text-sm font-bold text-white">{qs.role} Portal</div>
                      <div className="text-xs text-gray-400">Quick Start</div>
                    </div>
                  </div>
                  <ol className="space-y-3">
                    {qs.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${c.num}`}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300 pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Section D: Pricing ── */}
      {activeSection === "pricing" && (
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-xs text-gray-400">Simple, transparent pricing. No per-unit fees. No setup costs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING.map((tier) => (
              <div
                key={tier.name}
                className={`card relative flex flex-col ${
                  tier.highlight
                    ? "border-teal-600/60 bg-gradient-to-b from-teal-950/30 to-navy-800"
                    : "border-navy-700"
                }`}
              >
                {tier.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold rounded-full px-3 py-1 ${
                    tier.highlight ? "bg-teal-500 text-white" : "bg-navy-700 border border-navy-600 text-gray-300"
                  }`}>
                    {tier.badge}
                  </div>
                )}
                <div className="mb-4">
                  <div className="text-base font-bold text-white">{tier.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{tier.units}</div>
                  <div className="mt-3 flex items-baseline gap-0.5">
                    <span className={`text-3xl font-black ${tier.highlight ? "text-teal-300" : "text-white"}`}>
                      {tier.price}
                    </span>
                    {tier.period && <span className="text-sm text-gray-400">{tier.period}</span>}
                  </div>
                </div>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                      <svg className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-5 w-full py-2.5 text-sm font-semibold rounded-lg transition-all ${
                    tier.highlight
                      ? "bg-teal-600 hover:bg-teal-500 text-white"
                      : tier.name === "Custom"
                      ? "border border-navy-600 text-gray-300 hover:border-navy-500 hover:text-white"
                      : "border border-teal-700/50 text-teal-300 hover:bg-teal-900/30"
                  }`}
                >
                  {tier.name === "Custom" ? "Contact Sales" : "Get Started Free"}
                </button>
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-500">
            All plans include 14-day free trial · No credit card required · Cancel anytime
          </div>
        </div>
      )}
    </div>
  );
}

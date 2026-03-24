"use client";

import { useState, useEffect, useRef } from "react";
import type { PortalRole, DemoUser } from "@/types";
import type { Page } from "./Dashboard";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatPanelProps {
  role: PortalRole;
  user: DemoUser;
  currentPage: Page;
  initialMessage?: string;
  onInitialMessageSent: () => void;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const SUGGESTED_PROMPTS: Record<PortalRole, string[]> = {
  tenant: [
    "When is my next rent payment due?",
    "How do I submit a maintenance request?",
    "What does my lease say about pets?",
    "How do I set up AutoPay?",
  ],
  owner: [
    "What's my portfolio occupancy rate?",
    "Which maintenance requests need my approval?",
    "How is Pacific Pines performing as an STR?",
    "Show me overdue rent payments",
  ],
  contractor: [
    "What jobs are available near me?",
    "How do I submit an invoice?",
    "What's my payment status for completed jobs?",
    "How do I mark a job as complete?",
  ],
  admin: [
    "What's our MRR this month?",
    "Are there any open disputes?",
    "Which contractor applications are pending?",
    "Show me accounts with overdue fees",
  ],
};

const AI_RESPONSES: Record<string, string> = {
  "when is my next rent payment due": "Your next rent payment of **$2,850** is due **April 1, 2026**. You have AutoPay enabled, so it will process automatically on March 29th via ACH. I'll send you a reminder 3 days before.",
  "how do i submit a maintenance request": "To submit a maintenance request:\n1. Go to **Maintenance** in the left sidebar\n2. Click **Submit New Request**\n3. Describe the issue, choose urgency, and optionally upload photos\n4. Submit — our AI will triage it and your landlord will assign a contractor\n\nMost requests are acknowledged within 2 hours!",
  "what does my lease say about pets": "Your current lease (Unit 101, expiring Aug 31, 2026) has a **no pets** policy. If you'd like to discuss a pet addendum, you can message Marcus Rivera directly through the Messages tab. Lease renewals sometimes allow for negotiated pet policies.",
  "how do i set up autopay": "Great news — AutoPay is **already enabled** on your account! Your rent is set to auto-debit $2,850 via ACH on the last business day before the 1st of each month. You can toggle this off in the **Payments** section if needed.",
  "what's my portfolio occupancy rate": "Your current portfolio occupancy is **82%** (9 of 11 units occupied):\n\n- **The Harlow Apartments:** 5/6 units — 83%\n- **Pacific Pines Cabin:** STR mode — currently booked\n- **Bayview Lofts:** 3/4 units — 75%\n\nUnit 302 (Harlow, 1BR) has been vacant for 18 days. Want me to draft a listing?",
  "which maintenance requests need my approval": "You have **1 request pending your approval:**\n\n🔧 **Dishwasher replacement** — Unit 102 (Derek Moss)\n- Estimated cost: **$320**\n- Contractor: Rob McAllister\n- AI triage: Drain pump failure, no structural risk\n\nGo to **Maintenance → Approvals** to approve or reject, or I can trigger the approval from here.",
  "how is pacific pines performing as an str": "**Pacific Pines Cabin — STR Performance (last 6 months):**\n\n- Avg monthly revenue: **$5,423**\n- This month (March): **$6,840** — your best month!\n- Average nightly rate: **$285**\n- Occupancy: ~78% across the period\n\nFor context, comparable Guerneville STRs average $240/night. You're pricing well. Consider a slight rate increase to $295–$310 for summer peak season.",
  "what's our mrr this month": "**Platform MRR (March 2026): $1,375**\n\nMonth-over-month growth: **+12.4%** 📈\n\nBreakdown:\n- Marcus Rivera (Pro): $239/mo\n- James Okafor (Enterprise): $799/mo  \n- Diana Walsh (Starter): $49/mo\n- Sandra Liu (Pro, trial): $239/mo\n\nFeature upsell opportunity: Victor Reyes (suspended) had 2 units — worth a win-back call.",
  "are there any open disputes": "There are **2 open disputes** requiring attention:\n\n1. **Maintenance delay claim** (Derek Moss, $150) — opened Mar 20. Derek claims 3-week dishwasher delay cost him laundromat fees. Still open.\n\n2. **Security deposit dispute** (former tenant Alex Kim, $4,400) — under review since Mar 10. 21-day return window legally required.\n\nI recommend prioritizing the deposit dispute — it has the highest legal exposure. Want me to pull the move-out checklist?",
  "which contractor applications are pending": "There is **1 contractor application** pending review:\n\n- **New applicant** — specialty: electrical, license verified\n- Submitted background check ✓\n- References provided: 2 of 3\n- Awaiting: final reference + insurance certificate\n\nGo to **Contractor Vetting** to review and approve.",
  default: "I'm Pivot AI, your property management assistant. I can help with rent payments, maintenance requests, lease questions, portfolio analytics, and more. What would you like to know?",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (key === "default") continue;
    if (lower.includes(key.split(" ").slice(0, 4).join(" "))) return val;
  }
  // Generic responses based on keywords
  if (lower.includes("maintenance") || lower.includes("repair") || lower.includes("fix")) {
    return "Maintenance requests can be submitted through the **Maintenance** section. Our AI automatically triages urgency, estimates costs, and matches the best available contractor from our vetted pool. Typical response time is under 24 hours for non-emergency requests.";
  }
  if (lower.includes("rent") || lower.includes("payment") || lower.includes("pay")) {
    return "Rent payments are processed on the 1st of each month. AutoPay is available via ACH (free) or credit card (+2.9% processing fee). Late fees apply after a 5-day grace period. You can view your full payment history and download receipts in the **Payments** section.";
  }
  if (lower.includes("lease") || lower.includes("renew") || lower.includes("contract")) {
    return "Lease details including start/end dates, monthly rent, and all terms are available in the **Lease** section. E-signatures are handled through the platform — no need for in-person signing. Renewal offers are typically sent 60–90 days before expiration.";
  }
  if (lower.includes("contractor") || lower.includes("plumber") || lower.includes("electric")) {
    return "All contractors on Pivot are fully vetted — we verify licenses, insurance, and conduct background checks. Contractors are matched to jobs based on specialty, availability, and past ratings. Average contractor rating on our platform is 4.8/5.";
  }
  if (lower.includes("str") || lower.includes("airbnb") || lower.includes("short term") || lower.includes("vacation")) {
    return "Pivot supports **mixed-mode properties** that can switch between Long-Term Rental (LTR) and Short-Term Rental (STR) modes. The STR dashboard tracks nightly rates, occupancy, and revenue. Our AI Dynamic Pricing engine analyzes market data to suggest optimal nightly rates.";
  }
  return AI_RESPONSES.default;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n(\d+)\. /g, '</p><p class="mt-1 ml-2">$1. ')
    .replace(/\n- /g, '</p><p class="mt-1 ml-2">• ')
    .replace(/\n/g, '<br/>');
}

export default function ChatPanel({ role, currentPage, initialMessage, onInitialMessageSent, onClose }: ChatPanelProps) {
  const WELCOME = `I'm your AI property assistant. I can help with **maintenance triage**, **rent pricing**, **tenant screening**, and **portfolio analysis**. What would you like to know?`;
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: WELCOME, timestamp: new Date().toISOString() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (initialMessage) {
      handleSend(initialMessage);
      onInitialMessageSent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMessage]);

  const handleSend = (text?: string) => {
    const content = (text || input).trim();
    if (!content) return;
    setInput("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(content);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedPrompts = SUGGESTED_PROMPTS[role];

  const pageContext: Record<string, string> = {
    dashboard: "the portfolio dashboard",
    maintenance: "the maintenance requests",
    payments: "payments",
    properties: "property management",
    lease: "lease details",
    messages: "messages",
    tenants: "tenant management",
    invoices: "contractor invoices",
    pl: "profit & loss",
    jobs: "job requests",
    schedule: "your job schedule",
    accounts: "account management",
    disputes: "open disputes",
  };

  return (
    <div className="fixed right-0 top-0 bottom-0 w-[380px] bg-navy-900 border-l border-navy-700 flex flex-col z-40 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Pivot AI</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] text-gray-400">
                {pageContext[currentPage] ? `Viewing ${pageContext[currentPage]}` : "Property assistant"}
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors p-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="bg-navy-800 rounded-xl p-4 border border-navy-700">
              <p className="text-sm text-gray-300 leading-relaxed">
                Hi! I&apos;m your Pivot AI assistant. I can help with rent, maintenance, lease questions, and portfolio analytics.
              </p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Suggested questions</p>
              <div className="space-y-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left text-xs text-gray-300 bg-navy-800/50 border border-navy-700 hover:border-teal-700/50 hover:bg-navy-800 px-3 py-2 rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mr-2 mt-0.5" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-teal-700/60 text-white border border-teal-700/30"
                : "bg-navy-800 text-gray-200 border border-navy-700"
            }`}>
              {msg.role === "assistant" ? (
                <p dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mr-2 mt-0.5" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 flex gap-1.5 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-navy-700">
        <div className="flex gap-2 items-end bg-navy-800 border border-navy-700 rounded-xl px-3 py-2 focus-within:border-teal-700/60 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your property…"
            className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none outline-none min-h-[20px] max-h-32"
            rows={1}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mb-0.5 transition-all disabled:opacity-40"
            style={{ background: input.trim() ? "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" : "#27426c" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-600 text-center mt-1.5">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

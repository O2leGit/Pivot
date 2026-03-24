"use client";

import { useState } from "react";
import type { PortalRole, DemoUser, MessageThread, Message } from "@/types";
import { MESSAGE_THREADS } from "@/data/demoData";

interface Props {
  user: DemoUser;
  role: PortalRole;
}

export default function MessagesPage({ user, role }: Props) {
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [reply, setReply] = useState("");

  const threads = MESSAGE_THREADS.filter((t) =>
    t.participantIds.some((id) => id === user.entityId || role === "owner")
  );

  const handleSend = () => {
    if (!reply.trim()) return;
    setReply("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)] min-h-[400px]">
        {/* Thread list */}
        <div className="md:col-span-1 space-y-2 overflow-y-auto pr-1">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => setSelectedThread(thread)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedThread?.id === thread.id
                  ? "bg-navy-700 border-teal-600/60"
                  : "bg-navy-800 border-navy-700 hover:border-navy-600"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className={`text-sm font-medium truncate ${thread.unreadCount > 0 ? "text-white" : "text-gray-300"}`}>
                  {thread.subject}
                </p>
                {thread.unreadCount > 0 && (
                  <span className="badge-teal shrink-0 ml-2">{thread.unreadCount}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{thread.lastMessage}</p>
              <p className="text-[11px] text-gray-600 mt-1">
                {new Date(thread.lastMessageAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          ))}
          {threads.length === 0 && (
            <div className="card text-center py-8 text-gray-400 text-sm">No messages yet</div>
          )}
        </div>

        {/* Message thread */}
        <div className="md:col-span-2 flex flex-col bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
          {selectedThread ? (
            <>
              {/* Thread header */}
              <div className="p-4 border-b border-navy-700">
                <h2 className="text-sm font-semibold text-white">{selectedThread.subject}</h2>
                <p className="text-xs text-gray-400">
                  {selectedThread.participantNames.join(", ")}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map((msg: Message) => {
                  const isMe = msg.fromId === user.entityId || (role === "owner" && msg.fromRole === "owner");
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      {!isMe && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-700 to-indigo-700 flex items-center justify-center text-xs font-bold text-white shrink-0 mr-2 mt-0.5">
                          {msg.fromName.split(" ").map(n => n[0]).join("")}
                        </div>
                      )}
                      <div className={`max-w-[75%]`}>
                        {!isMe && (
                          <p className="text-[11px] text-gray-500 mb-1 ml-1">{msg.fromName}</p>
                        )}
                        <div className={`px-3.5 py-2.5 rounded-xl text-sm ${
                          isMe
                            ? "bg-teal-700/60 text-white"
                            : "bg-navy-700 text-gray-200 border border-navy-600"
                        }`}>
                          {msg.body}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1 px-1">
                          {new Date(msg.sentAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply input */}
              <div className="p-3 border-t border-navy-700">
                <div className="flex gap-2 items-end bg-navy-900 border border-navy-700 rounded-xl px-3 py-2 focus-within:border-teal-700/60 transition-colors">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message…"
                    className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 resize-none outline-none min-h-[20px] max-h-24"
                    rows={1}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!reply.trim()}
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
                    style={{ background: reply.trim() ? "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" : "#27426c" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

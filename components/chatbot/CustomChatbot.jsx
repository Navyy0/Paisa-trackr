// No changes to imports
"use client";

import { useState } from "react";

export default function CustomChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "❌ Something went wrong" },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Network error" }]);
    } finally {
      setLoading(false);
    }
  };

  const sendImage = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setMessages((prev) => [...prev, { role: "user", content: "🧾 Scanning receipt..." }]);
    setFile(null);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content || "❌ Failed to scan receipt" },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "❌ Upload failed" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg z-50"
      >
        {open ? "Close 💬" : "Chat 💬"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-4 w-[360px] bg-white text-black rounded-xl shadow-xl p-4 text-sm z-50 border border-gray-200">
          {/* Tabs */}
          <div className="flex justify-between mb-2 border-b">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 text-center ${
                activeTab === "chat"
                  ? "font-bold border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab("guide")}
              className={`flex-1 py-2 text-center ${
                activeTab === "guide"
                  ? "font-bold border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500"
              }`}
            >
              📘 Guide
            </button>
          </div>

          {/* Chat UI */}
          {activeTab === "chat" && (
            <>
              <div className="max-h-[250px] overflow-y-auto mb-3 space-y-2 px-1">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`text-left ${msg.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block px-3 py-1 rounded-lg ${
                        msg.role === "user" ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && <div className="text-center text-gray-400">Thinking...</div>}
              </div>

              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask something..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Send
                </button>
              </div>

              <div className="flex gap-2 items-center">
                <label className="flex-1 cursor-pointer text-xs text-gray-600">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <span className="block border border-dashed border-gray-400 rounded px-2 py-1 text-center hover:border-blue-400">
                    📎 Choose Receipt
                  </span>
                </label>
                <button
                  onClick={sendImage}
                  disabled={!file}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    file ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Scan
                </button>
              </div>
            </>
          )}

          {/* Guide UI */}
          {activeTab === "guide" && (
            <div className="space-y-3 leading-relaxed max-h-[280px] overflow-y-auto pr-1 text-xs">
              <div>
                💸 <strong>Add expense</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  Add expense of ₹500 for groceries called &quot;monthly vegetables&quot; weekly
                </code>
              </div>
              <div>
                🧾 <strong>Scan receipt</strong>:<br />
                Upload a receipt using <strong>Choose</strong> &amp; click <strong>Scan</strong>
              </div>
              <div>
                💰 <strong>Check balance</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  What&apos;s my balance?
                </code>
              </div>
              <div>
                📋 <strong>Last 5 transactions</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  Show my last 5 transactions
                </code>
              </div>
              <div>
                📊 <strong>Budget status</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  What&apos;s my current budget status?
                </code>
              </div>
              <div>
                📅 <strong>Monthly summary</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  Give me monthly summary
                </code>
              </div>
              <div>
                📊 <strong>Category-wise spending</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  Show category wise spending
                </code>
              </div>
              <div>
                💡 <strong>Budget tip</strong>:<br />
                <code className="block bg-gray-100 rounded px-2 py-1 mt-1">
                  Give me a smart budget tip
                </code>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

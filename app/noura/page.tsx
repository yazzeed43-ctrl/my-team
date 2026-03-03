"use client";
import { useState } from "react";

const SYSTEM = `أنت نورة، مختصة في محتوى تيك توك والسوشيال ميديا.
تخصصاتك: كتابة السكريبتات، متابعة الترندات، تحليل الإحصائيات، استراتيجية المحتوى.
لغتك: عربي عصري وخفيف، أنثى، متحمسة وعملية.
تعطين أفكار محتوى قابلة للتنفيذ فوراً.
ابحثي في الإنترنت عن أحدث ترندات تيك توك.
لا تستخدمي markdown، استخدمي نصاً عادياً فقط.`;

export default function Noura() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#f0eaff", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ background: "#0f0d14", borderBottom: "1px solid #1e1a2e", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", boxShadow: "0 0 16px rgba(167,139,250,0.3)" }}>ن</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#a78bfa" }}>نورة</div>
          <div style={{ fontSize: 11, color: "#8880aa" }}>مختصة تيك توك · ترندات ومحتوى</div>
        </div>
        <a href="/fahd" style={{ marginRight: "auto", padding: "6px 14px", background: "transparent", border: "1px solid #1e1a2e", borderRadius: 20, color: "#8880aa", fontSize: 12, textDecoration: "none" }}>← فهد</a>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ background: "#13101a", border: "1px solid #1e1a2e", borderRight: "3px solid #a78bfa", borderRadius: 16, padding: "14px 18px", maxWidth: "75%", fontSize: 14, lineHeight: 1.8 }}>
            هلا! أنا نورة 📱<br /><br />
            أقدر أساعدك في:<br />
            • سكريبتات فيديوهات تيك توك<br />
            • أحدث الترندات<br />
            • تحليل إحصائيات حسابك<br />
            • استراتيجية المحتوى<br /><br />
            وش تبي نسوي اليوم؟
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              background: m.role === "user" ? "#13101a" : "linear-gradient(135deg, #2a1f5e, #1a1040)",
              border: `1px solid ${m.role === "user" ? "#1e1a2e" : "#3d2d80"}`,
              borderRadius: 16, padding: "11px 15px", maxWidth: "75%",
              fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ background: "#13101a", border: "1px solid #1e1a2e", borderRadius: 16, padding: "11px 15px", width: 60, color: "#8880aa" }}>...</div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#0f0d14", borderTop: "1px solid #1e1a2e", padding: "14px 22px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اسأليني عن المحتوى والترندات..."
            style={{ flex: 1, background: "#13101a", border: "1px solid #1e1a2e", borderRadius: 12, padding: "11px 15px", color: "#f0eaff", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }}
          />
          <button onClick={send} style={{ width: 44, height: 44, background: "linear-gradient(135deg, #a78bfa, #5b21b6)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>↑</button>
        </div>
      </div>
    </div>
  );
}
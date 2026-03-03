"use client";
import { useState } from "react";

const TEAM = [
  { name: "رهف", color: "#e879a0", emoji: "🏘️", desc: "تحليل العقارات", path: "/rahaf" },
  { name: "نورة", color: "#a78bfa", emoji: "📱", desc: "تيك توك والمحتوى", path: "/noura" },
  { name: "سعد", color: "#34d399", emoji: "📈", desc: "الأسهم والتداول", path: "/saad" },
  { name: "محمد", color: "#60a5fa", emoji: "💼", desc: "الفرص التجارية", path: "/mohammed" },
];

const SYSTEM = `أنت فهد، المدير التنفيذي لفريق من المستشارين المتخصصين.
فريقك: رهف (عقارات)، نورة (تيك توك)، سعد (أسهم)، محمد (فرص تجارية).
دورك: ترحب بالمستخدم، تجيب على الأسئلة العامة، وتوجهه للشخص المناسب.
لغتك: عربي واضح ومباشر، رجل واثق وخبير.
لا تستخدم markdown، استخدم نصاً عادياً فقط.`;

export default function Fahd() {
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
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#e8e8f0", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ background: "#111118", borderBottom: "1px solid #1e1e2e", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #7a5a1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#000", boxShadow: "0 0 16px rgba(201,168,76,0.3)" }}>ف</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#c9a84c" }}>فهد</div>
          <div style={{ fontSize: 11, color: "#888899" }}>المدير التنفيذي · متصل الآن</div>
        </div>
        <div style={{ marginRight: "auto", display: "flex", gap: 8 }}>
          {TEAM.map(m => (
            <a key={m.name} href={m.path} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, border: `1px solid ${m.color}`, color: m.color, textDecoration: "none" }}>{m.name}</a>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 16, padding: "14px 18px", maxWidth: "75%", fontSize: 14, lineHeight: 1.8 }}>
            أهلاً! أنا فهد، مديرك التنفيذي 👋<br /><br />
            عندي فريق متكامل يخدمك:<br />
            🏘️ رهف — تحليل العقارات في مكة<br />
            📱 نورة — محتوى تيك توك والسكريبتات<br />
            📈 سعد — الأسهم والأسواق المالية<br />
            💼 محمد — الفرص التجارية<br /><br />
            كيف أقدر أساعدك؟
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              background: m.role === "user" ? "#16161f" : "linear-gradient(135deg, #2a3f7e, #1a2a5e)",
              border: `1px solid ${m.role === "user" ? "#1e1e2e" : "#2d4080"}`,
              borderRadius: 16, padding: "11px 15px", maxWidth: "75%",
              fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 16, padding: "11px 15px", width: 60, color: "#888899" }}>...</div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#111118", borderTop: "1px solid #1e1e2e", padding: "14px 22px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اكتب سؤالك لفهد..."
            style={{ flex: 1, background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 12, padding: "11px 15px", color: "#e8e8f0", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }}
          />
          <button onClick={send} style={{ width: 44, height: 44, background: "#c9a84c", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>↑</button>
        </div>
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";

const SYSTEM = `أنت رهف، محللة متخصصة في سوق العقارات السعودي وخاصة مكة المكرمة.
تخصصاتك: أسعار الإيجار، أسعار البيع والشراء، مقارنة الأحياء.
لغتك: عربي واضح ومباشر، أنثى، تتكلمين بثقة وخبرة.
تعطين أرقام وتحليلات محددة وتوصيات عملية.
ابحثي في الإنترنت للحصول على أحدث البيانات.
لا تستخدمي markdown، استخدمي نصاً عادياً فقط.`;

export default function Rahaf() {
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
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#f0e8f0", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ background: "#110f14", borderBottom: "1px solid #231e2c", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #e879a0, #7a2040)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", boxShadow: "0 0 16px rgba(232,121,160,0.3)" }}>ر</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#e879a0" }}>رهف</div>
          <div style={{ fontSize: 11, color: "#998899" }}>محللة سوق العقارات · مكة المكرمة</div>
        </div>
        <a href="/fahd" style={{ marginRight: "auto", padding: "6px 14px", background: "transparent", border: "1px solid #231e2c", borderRadius: 20, color: "#998899", fontSize: 12, textDecoration: "none" }}>← فهد</a>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ background: "#17141c", border: "1px solid #231e2c", borderRight: "3px solid #e879a0", borderRadius: 16, padding: "14px 18px", maxWidth: "75%", fontSize: 14, lineHeight: 1.8 }}>
            أهلاً! أنا رهف 🏘️<br /><br />
            أقدر أساعدك في:<br />
            • أسعار الإيجار في مكة<br />
            • أسعار البيع والشراء<br />
            • مقارنة الأحياء<br /><br />
            اسأليني عن أي منطقة أو عقار!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              background: m.role === "user" ? "#17141c" : "linear-gradient(135deg, #2a3f7e, #1a2a5e)",
              border: `1px solid ${m.role === "user" ? "#231e2c" : "#2d4080"}`,
              borderRadius: 16, padding: "11px 15px", maxWidth: "75%",
              fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ background: "#17141c", border: "1px solid #231e2c", borderRadius: 16, padding: "11px 15px", width: 60, color: "#998899" }}>...</div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#110f14", borderTop: "1px solid #231e2c", padding: "14px 22px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اسأليني عن العقارات في مكة..."
            style={{ flex: 1, background: "#17141c", border: "1px solid #231e2c", borderRadius: 12, padding: "11px 15px", color: "#f0e8f0", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }}
          />
          <button onClick={send} style={{ width: 44, height: 44, background: "linear-gradient(135deg, #e879a0, #c0385c)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>↑</button>
        </div>
      </div>
    </div>
  );
}
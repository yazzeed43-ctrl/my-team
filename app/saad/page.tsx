"use client";
import { useState } from "react";

const SYSTEM = `أنت سعد، محلل متخصص في الأسواق المالية السعودية والعالمية.
تخصصاتك: سوق الأسهم السعودي (تداول)، العملات، الذهب، الفرص الاستثمارية.
لغتك: عربي واضح ومباشر، رجل خبير وواثق.
تعطي تحليلات مبنية على بيانات حقيقية وتوصيات عملية.
ابحث في الإنترنت عن أحدث بيانات السوق.
لا تستخدم markdown، استخدم نصاً عادياً فقط.`;

export default function Saad() {
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
      body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM, member: "saad" }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0f0a", minHeight: "100vh", color: "#eafaf0", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ background: "#0d120d", borderBottom: "1px solid #1a2e1a", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #34d399, #065f46)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", boxShadow: "0 0 16px rgba(52,211,153,0.3)" }}>س</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#34d399" }}>سعد</div>
          <div style={{ fontSize: 11, color: "#88aa88" }}>محلل الأسواق المالية · تداول والعملات</div>
        </div>
        <a href="/fahd" style={{ marginRight: "auto", padding: "6px 14px", background: "transparent", border: "1px solid #1a2e1a", borderRadius: 20, color: "#88aa88", fontSize: 12, textDecoration: "none" }}>← فهد</a>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ background: "#0f160f", border: "1px solid #1a2e1a", borderRight: "3px solid #34d399", borderRadius: 16, padding: "14px 18px", maxWidth: "75%", fontSize: 14, lineHeight: 1.8 }}>
            أهلاً! أنا سعد 📈<br /><br />
            أقدر أساعدك في:<br />
            • تحليل سوق تداول السعودي<br />
            • أسعار العملات والذهب<br />
            • فرص استثمارية<br />
            • متابعة الأسواق العالمية<br /><br />
            وش تبي تعرف عن السوق اليوم؟
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              background: m.role === "user" ? "#0f160f" : "linear-gradient(135deg, #1a3a2a, #0a2010)",
              border: `1px solid ${m.role === "user" ? "#1a2e1a" : "#1a4a2a"}`,
              borderRadius: 16, padding: "11px 15px", maxWidth: "75%",
              fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ background: "#0f160f", border: "1px solid #1a2e1a", borderRadius: 16, padding: "11px 15px", width: 60, color: "#88aa88" }}>...</div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#0d120d", borderTop: "1px solid #1a2e1a", padding: "14px 22px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اسألني عن الأسهم والأسواق..."
            style={{ flex: 1, background: "#0f160f", border: "1px solid #1a2e1a", borderRadius: 12, padding: "11px 15px", color: "#eafaf0", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }}
          />
          <button onClick={send} style={{ width: 44, height: 44, background: "linear-gradient(135deg, #34d399, #065f46)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

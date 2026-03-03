"use client";
import { useState } from "react";

const SYSTEM = `أنت محمد، خبير متخصص في الفرص التجارية ومشاريع رأس المال الصغير.
تخصصاتك: فرص تجارية في الأسواق السعودية، مشاريع برأس مال صغير، تحليل الجدوى، الأسواق التجارية.
لغتك: عربي واضح ومباشر، رجل عملي وخبير.
تعطي فرص حقيقية وقابلة للتنفيذ مع أرقام واضحة.
ابحث في الإنترنت عن أحدث الفرص التجارية في السوق السعودي.
لا تستخدم markdown، استخدم نصاً عادياً فقط.`;

export default function Mohammed() {
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
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0c0f", minHeight: "100vh", color: "#eaf0ff", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />

      <div style={{ background: "#0d0f14", borderBottom: "1px solid #1a1e2e", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #60a5fa, #1e40af)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#fff", boxShadow: "0 0 16px rgba(96,165,250,0.3)" }}>م</div>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#60a5fa" }}>محمد</div>
          <div style={{ fontSize: 11, color: "#8890aa" }}>خبير الفرص التجارية · رأس المال الصغير</div>
        </div>
        <a href="/fahd" style={{ marginRight: "auto", padding: "6px 14px", background: "transparent", border: "1px solid #1a1e2e", borderRadius: 20, color: "#8890aa", fontSize: 12, textDecoration: "none" }}>← فهد</a>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, minHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ background: "#0f1116", border: "1px solid #1a1e2e", borderRight: "3px solid #60a5fa", borderRadius: 16, padding: "14px 18px", maxWidth: "75%", fontSize: 14, lineHeight: 1.8 }}>
            أهلاً! أنا محمد 💼<br /><br />
            أقدر أساعدك في:<br />
            • فرص تجارية برأس مال صغير<br />
            • تحليل جدوى المشاريع<br />
            • الأسواق التجارية السعودية<br />
            • أفكار مشاريع قابلة للتنفيذ<br /><br />
            كم رأس المال المتاح عندك؟
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{
              background: m.role === "user" ? "#0f1116" : "linear-gradient(135deg, #1a2a4a, #0a1530)",
              border: `1px solid ${m.role === "user" ? "#1a1e2e" : "#1a3060"}`,
              borderRadius: 16, padding: "11px 15px", maxWidth: "75%",
              fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div style={{ background: "#0f1116", border: "1px solid #1a1e2e", borderRadius: 16, padding: "11px 15px", width: 60, color: "#8890aa" }}>...</div>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#0d0f14", borderTop: "1px solid #1a1e2e", padding: "14px 22px" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            placeholder="اسألني عن الفرص التجارية..."
            style={{ flex: 1, background: "#0f1116", border: "1px solid #1a1e2e", borderRadius: 12, padding: "11px 15px", color: "#eaf0ff", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }}
          />
          <button onClick={send} style={{ width: 44, height: 44, background: "linear-gradient(135deg, #60a5fa, #1e40af)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>↑</button>
        </div>
      </div>
    </div>
  );
}
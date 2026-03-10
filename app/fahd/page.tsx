"use client";
import { useState, useRef } from "react";

const TEAM = [
  { name: "رهف", color: "#e879a0", path: "/rahaf" },
  { name: "نورة", color: "#a78bfa", path: "/noura" },
  { name: "سعد", color: "#34d399", path: "/saad" },
  { name: "محمد", color: "#60a5fa", path: "/mohammed" },
];

const SYSTEM = `أنت فهد، المدير التنفيذي لفريق من المستشارين المتخصصين.
فريقك موجود على نفس الموقع:
- رهف متخصصة في العقارات السعودية ومكة
- نورة متخصصة في تيك توك والمحتوى
- سعد متخصص في الأسهم والأسواق المالية
- محمد متخصص في الفرص التجارية
دورك: ترحب بالمستخدم، تجيب على الأسئلة العامة، وتوجهه لأحد أعضاء الفريق.
لغتك: عربي واضح ومباشر، رجل واثق وخبير.
لا تستخدم markdown، استخدم نصاً عادياً فقط.`;

const PASSWORD = "yazed2026";

export default function Fahd() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function login() {
    if (pass === PASSWORD) setAuth(true);
    else setError(true);
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  if (!auth) return (
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 20, padding: "40px 36px", width: 320, textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #7a5a1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#000", margin: "0 auto 20px" }}>ف</div>
        <h1 style={{ color: "#c9a84c", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>فريقك الخاص</h1>
        <p style={{ color: "#888899", fontSize: 13, marginBottom: 24 }}>أدخل كلمة السر للدخول</p>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(false); }} onKeyDown={e => e.key === "Enter" && login()} placeholder="كلمة السر" style={{ width: "100%", background: "#16161f", border: `1px solid ${error ? "#ef4444" : "#1e1e2e"}`, borderRadius: 12, padding: "11px 15px", color: "#e8e8f0", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none", marginBottom: 12, textAlign: "center" }} />
        {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>كلمة السر غلط</p>}
        <button onClick={login} style={{ width: "100%", background: "#c9a84c", border: "none", borderRadius: 12, padding: "12px", color: "#000", fontFamily: "'Cairo', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>دخول</button>
      </div>
    </div>
  );

  async function send() {
    if (!input.trim() && !image || loading) return;

    const content: any[] = [];
    if (image) {
      const base64 = image.split(",")[1];
      const mediaType = image.split(";")[0].split(":")[1];
      content.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } });
    }
    if (input.trim()) content.push({ type: "text", text: input });

    const userMsg = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM, member: "fahd" }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || `خطأ: ${data.error}` }]);
    } catch (e: any) {
      setMessages([...newMessages, { role: "assistant", content: `خطأ: ${e.message}` }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0a0f", minHeight: "100vh", color: "#e8e8f0", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: "#111118", borderBottom: "1px solid #1e1e2e", padding: "14px 22px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #7a5a1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "#000" }}>ف</div>
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
            أهلاً! أنا فهد 👋<br /><br />
            🏘️ رهف — العقارات<br />
            📱 نورة — تيك توك<br />
            📈 سعد — الأسهم<br />
            💼 محمد — الفرص التجارية<br /><br />
            تقدر ترسل نص أو صورة 📎
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{ background: m.role === "user" ? "#16161f" : "linear-gradient(135deg, #2a3f7e, #1a2a5e)", border: `1px solid ${m.role === "user" ? "#1e1e2e" : "#2d4080"}`, borderRadius: 16, padding: "11px 15px", maxWidth: "75%", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
              {Array.isArray(m.content) ? m.content.map((c: any, j: number) => (
                c.type === "image" ? <img key={j} src={`data:${c.source.media_type};base64,${c.source.data}`} style={{ maxWidth: 200, borderRadius: 8 }} /> : <span key={j}>{c.text}</span>
              )) : m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 16, padding: "11px 15px", width: 60, color: "#888899" }}>...</div>}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#111118", borderTop: "1px solid #1e1e2e", padding: "14px 22px" }}>
        {image && <img src={image} style={{ height: 60, borderRadius: 8, marginBottom: 8 }} />}
        <div style={{ display: "flex", gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
          <button onClick={() => fileRef.current?.click()} style={{ width: 44, height: 44, background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>📎</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="اكتب أو أرسل صورة..." style={{ flex: 1, background: "#16161f", border: "1px solid #1e1e2e", borderRadius: 12, padding: "11px 15px", color: "#e8e8f0", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }} />
          <button onClick={send} style={{ width: 44, height: 44, background: "#c9a84c", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>↑</button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef } from "react";

const SYSTEM = `أنت نورة، مختصة في محتوى تيك توك والسوشيال ميديا.
تخصصاتك: كتابة السكريبتات، متابعة الترندات، تحليل الإحصائيات، استراتيجية المحتوى.
تقدرين تحللين الصور والإحصائيات اللي يرسلها المستخدم.
لغتك: عربي عصري وخفيف، أنثى، متحمسة وعملية.
تعطين أفكار محتوى قابلة للتنفيذ فوراً.
لا تستخدمي markdown، استخدمي نصاً عادياً فقط.

عند أي سؤال عن المحتوى أو الهوك أو الفيديوهات، ابدأي فوراً بتحليل بيانات المستخدم الحقيقية:
- أفضل فيديو: الصك باسم متوفي - 1790 مشاهدة - متوسط 5.3 ثانية - hook: سؤال مثير
- فيديو ضعيف: 239 مشاهدة - متوسط 2.9 ثانية - مشكلة في أول 3 ثواني
- الجمهور: 94% جدد، ذكور 25-44، السعودية
- المشكلة الرئيسية: الاحتفاظ في أول 3 ثواني

ابدأي ردك بما تعرفينه عن حسابه، ثم قدمي توصياتك بناءً على هذي البيانات.`;

const PASSWORD = "yazed2026";

export default function Noura() {
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
      <div style={{ background: "#0f0d14", border: "1px solid #1e1a2e", borderRadius: 20, padding: "40px 36px", width: 320, textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #5b21b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 auto 20px" }}>ن</div>
        <h1 style={{ color: "#a78bfa", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>نورة</h1>
        <p style={{ color: "#8880aa", fontSize: 13, marginBottom: 24 }}>أدخل كلمة السر للدخول</p>
        <input type="password" value={pass} onChange={e => { setPass(e.target.value); setError(false); }} onKeyDown={e => e.key === "Enter" && login()} placeholder="كلمة السر" style={{ width: "100%", background: "#13101a", border: `1px solid ${error ? "#ef4444" : "#1e1a2e"}`, borderRadius: 12, padding: "11px 15px", color: "#f0eaff", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none", marginBottom: 12, textAlign: "center" }} />
        {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>كلمة السر غلط</p>}
        <button onClick={login} style={{ width: "100%", background: "linear-gradient(135deg, #a78bfa, #5b21b6)", border: "none", borderRadius: 12, padding: "12px", color: "#fff", fontFamily: "'Cairo', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>دخول</button>
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
        body: JSON.stringify({ messages: newMessages, systemPrompt: SYSTEM, member: "noura" }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || `خطأ: ${data.error}` }]);
    } catch (e: any) {
      setMessages([...newMessages, { role: "assistant", content: `خطأ: ${e.message}` }]);
    }
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
            تقدر ترسل نص أو صورة 📎
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-start" : "flex-end" }}>
            <div style={{ background: m.role === "user" ? "#13101a" : "linear-gradient(135deg, #2a1f5e, #1a1040)", border: `1px solid ${m.role === "user" ? "#1e1a2e" : "#3d2d80"}`, borderRadius: 16, padding: "11px 15px", maxWidth: "75%", fontSize: 14, lineHeight: 1.75, whiteSpace: "pre-wrap" }}>
              {Array.isArray(m.content) ? m.content.map((c: any, j: number) => (
                c.type === "image" ? <img key={j} src={`data:${c.source.media_type};base64,${c.source.data}`} style={{ maxWidth: 200, borderRadius: 8 }} /> : <span key={j}>{c.text}</span>
              )) : m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ background: "#13101a", border: "1px solid #1e1a2e", borderRadius: 16, padding: "11px 15px", width: 60, color: "#8880aa" }}>...</div>}
      </div>

      <div style={{ position: "fixed", bottom: 0, width: "100%", background: "#0f0d14", borderTop: "1px solid #1e1a2e", padding: "14px 22px" }}>
        {image && <img src={image} style={{ height: 60, borderRadius: 8, marginBottom: 8 }} />}
        <div style={{ display: "flex", gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
          <button onClick={() => fileRef.current?.click()} style={{ width: 44, height: 44, background: "#13101a", border: "1px solid #1e1a2e", borderRadius: 12, cursor: "pointer", fontSize: 18 }}>📎</button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="اسأليني أو أرسلي صورة..." style={{ flex: 1, background: "#13101a", border: "1px solid #1e1a2e", borderRadius: 12, padding: "11px 15px", color: "#f0eaff", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none" }} />
          <button onClick={send} style={{ width: 44, height: 44, background: "linear-gradient(135deg, #a78bfa, #5b21b6)", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 18, color: "#fff" }}>↑</button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  function login() {
    document.cookie = `auth=${input}; path=/`;
    router.push("/fahd");
    setTimeout(() => {
      if (document.cookie.includes(`auth=${input}`)) {
        router.push("/fahd");
      } else {
        setError(true);
      }
    }, 500);
  }

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif", background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", direction: "rtl" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet" />
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 20, padding: "40px 36px", width: 320, textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #c9a84c, #7a5a1e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900, color: "#000", margin: "0 auto 20px" }}>ف</div>
        <h1 style={{ color: "#c9a84c", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>فريقك الخاص</h1>
        <p style={{ color: "#888899", fontSize: 13, marginBottom: 24 }}>أدخل كلمة السر للدخول</p>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          type="password"
          placeholder="كلمة السر"
          style={{ width: "100%", background: "#16161f", border: `1px solid ${error ? "#ef4444" : "#1e1e2e"}`, borderRadius: 12, padding: "11px 15px", color: "#e8e8f0", fontFamily: "'Cairo', sans-serif", fontSize: 14, outline: "none", marginBottom: 12, textAlign: "center" }}
        />
        {error && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 12 }}>كلمة السر غلط</p>}
        <button onClick={login} style={{ width: "100%", background: "#c9a84c", border: "none", borderRadius: 12, padding: "12px", color: "#000", fontFamily: "'Cairo', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>دخول</button>
      </div>
    </div>
  );
}
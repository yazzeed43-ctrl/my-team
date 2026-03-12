import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const supabase = createClient(
  "https://bgpybhkkuqrqokkfiksj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJncHliaGtrdXFycW9ra2Zpa3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2OTA4OTksImV4cCI6MjA4NzI2Njg5OX0.YOq9XIAf1y0IxRNRabtTUhnV_7eadrk7qqVvt5XhHso"
);

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, member } = await req.json();

    // قراءة المعرفة
    let contextStr = "";
    if (member) {
      const { data } = await supabase
        .from("shared_context")
        .select("key,value")
        .eq("member", member);
      if (data && data.length > 0) {
        contextStr = "\n\n--- معلومات محفوظة ---\n";
        contextStr += data.map((r) => `${r.key}: ${r.value}`).join("\n");
      }
    }

    // قراءة ذاكرة نورة
    let memoryStr = "";
    if (member === "noura") {
      const { data: memories } = await supabase
        .from("noura_memory")
        .select("summary, session_date")
        .order("session_date", { ascending: false })
        .limit(3);
      if (memories && memories.length > 0) {
        memoryStr = "\n\n--- ذاكرة المحادثات السابقة ---\n";
        memoryStr += memories.map((m) => `• ${m.summary}`).join("\n\n");
      }
    }

    const finalSystem = systemPrompt + contextStr + memoryStr;

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      system: finalSystem,
      messages,
    });

    let text = "";
    for (const block of response.content) {
      if (block.type === "text") {
        text += block.text;
      }
    }

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

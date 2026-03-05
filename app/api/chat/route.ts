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

    const lastUserMessage = messages[messages.length - 1];

    // حفظ رسالة المستخدم
    if (lastUserMessage?.role === "user") {
      await supabase.from("conversations").insert({
        member: member,
        role: "user",
        message: JSON.stringify(lastUserMessage.content),
      });
    }

    // قراءة المعرفة
    let contextStr = "";

    if (member) {
      const { data } = await supabase
        .from("knowledge")
        .select("key,value")
        .eq("member", member);

      if (data && data.length > 0) {
        contextStr = "\n\n--- معلومات محفوظة ---\n";
        contextStr += data.map((r) => `${r.key}: ${r.value}`).join("\n");
      }
    }

    // قراءة المهام
    let tasksStr = "";

    if (member) {
      const { data: tasks } = await supabase
        .from("tasks")
        .select("task,status")
        .eq("member", member)
        .eq("status", "pending");

      if (tasks && tasks.length > 0) {
        tasksStr = "\n\n--- المهام الحالية ---\n";
        tasksStr += tasks.map((t) => `- ${t.task}`).join("\n");
      }
    }

    const finalSystem = systemPrompt + contextStr + tasksStr;

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

    // حفظ رد الموظف
    await supabase.from("conversations").insert({
      member: member,
      role: "assistant",
      message: text,
    });

    // إذا فهد أنشأ مهمة
    const taskMatch = text.match(/TASK:\s*member=(\w+)\s*\|\s*task=(.+)/i);

    if (taskMatch) {

      const memberName = taskMatch[1];
      const taskText = taskMatch[2];

      await supabase.from("tasks").insert({
        member: memberName,
        task: taskText,
        status: "pending",
      });

    }

    return NextResponse.json({ reply: text });

  } catch (error: any) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );

  }

}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPT =
  "You are a friendly assistant for Asif Ikbal's freelance business. Help visitors understand the services (software, websites, SaaS, n8n, automation), answer questions, and encourage them to click 'Add an Order'. Keep replies short and friendly. Reply in the same language the user writes in (English or Bangla).";

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(30),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env['LOVABLE_API_KEY'];
    if (!key) return { reply: "Sorry, the assistant isn't available right now.", error: true };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: SYSTEM_PROMPT,
        input: data.messages.map((m) => ({ role: m.role, content: m.content })),
        reasoning: { effort: "low" },
        store: false,
        stream: true,
      }),
    });

    if (res.status === 429) return { reply: "I'm getting a lot of questions right now — please try again in a moment! 🙏", error: true };
    if (res.status === 402) return { reply: "The assistant is taking a break. Please click 'Add an Order' to reach Asif directly!", error: true };
    if (!res.ok || !res.body) {
      console.error("AI gateway error", res.status, await res.text().catch(() => ""));
      return { reply: "Oops, something went wrong. Please try again.", error: true };
    }

    // Consume the SSE stream and collect the text deltas.
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as { type?: string; delta?: string };
          if (evt.type === "response.output_text.delta" && evt.delta) text += evt.delta;
        } catch {
          /* ignore partial lines */
        }
      }
    }
    return { reply: text.replace(/\*\*(.+?)\*\*/g, "$1").trim() || "Sorry, I didn't catch that — could you rephrase?", error: false };
  });

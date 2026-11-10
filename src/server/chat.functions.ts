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
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { reply: "Sorry, the assistant isn't available right now.", error: true };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });
    if (res.status === 429) return { reply: "I'm getting a lot of questions right now — please try again in a moment! 🙏", error: true };
    if (res.status === 402) return { reply: "The assistant is taking a break. Please click 'Add an Order' to reach Asif directly!", error: true };
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      return { reply: "Oops, something went wrong. Please try again.", error: true };
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { reply: json.choices?.[0]?.message?.content?.trim() || "…", error: false };
  });

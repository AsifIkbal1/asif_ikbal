import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(30),
});

const N8N_WEBHOOK_URL =
  process.env["N8N_CHAT_WEBHOOK_URL"] || "https://snbd.app.n8n.cloud/webhook/website-chat";

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const lastUserMessage = [...data.messages].reverse().find((m) => m.role === "user")?.content || "";

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: lastUserMessage,
          messages: data.messages,
        }),
      });

      if (!res.ok) {
        console.error("n8n webhook error status:", res.status);
        return {
          reply:
            "দুঃখিত, এই মুহূর্তে চ্যাটবট রেসপন্স করতে পারছে না। আপনি সরাসরি WhatsApp-এ যোগাযোগ করতে পারেন অথবা কিছুক্ষণ পর চেষ্টা করুন।",
          error: true,
        };
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        // Support common n8n response shapes: { reply: "..." }, { output: "..." }, { message: "..." }, { text: "..." }
        const reply =
          json.output ?? json.reply ?? json.message ?? json.text ?? json.response ?? (typeof json === "string" ? json : JSON.stringify(json));
        return { reply: String(reply), error: false };
      } else {
        const text = await res.text();
        return { reply: text || "ধন্যবাদ আপনার বার্তার জন্য!", error: false };
      }
    } catch (err) {
      console.error("n8n webhook fetch error:", err);
      return {
        reply: "সার্ভারে সংযোগ করা সম্ভব হয়নি। দয়া করে WhatsApp-এ যোগাযোগ করুন।",
        error: true,
      };
    }
  });

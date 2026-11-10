import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findAnswerInMasterBrain } from "./master-brain";

const schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(30),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const lastUserMessage = [...data.messages].reverse().find((m) => m.role === "user")?.content || "";

    // Answer directly from the embedded Master AI Brain
    const reply = findAnswerInMasterBrain(lastUserMessage);
    return { reply, error: false };
  });

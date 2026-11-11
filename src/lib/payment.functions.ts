import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const PAYMENT_METHODS = ["bKash", "Nagad", "Rocket", "Upay", "UCB Mastercard"] as const;

export const paymentSchema = z.object({
  method: z.enum(PAYMENT_METHODS),
  name: z.string().trim().min(1).max(120),
  whatsappNumber: z.string().trim().regex(/^\+\d{6,18}$/),
  transactionId: z.string().trim().regex(/^[A-Za-z0-9-]{4,40}$/),
});

export const submitPayment = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => paymentSchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const paymentId = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("payment_requests")
      .insert({
        id: paymentId,
        method: data.method,
        name: data.name,
        whatsapp_number: data.whatsappNumber,
        transaction_id: data.transactionId,
        created_at: createdAt,
      });

    if (error) {
      console.error("Payment insert error:", error);
      throw new Error("Could not send your request. Please try again.");
    }

    const webhook = process.env["N8N_WEBHOOK_URL"];
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "payment",
            id: paymentId,
            method: data.method,
            name: data.name,
            whatsapp_number: data.whatsappNumber,
            transaction_id: data.transactionId,
            created_at: createdAt,
          }),
        });
      } catch (e) {
        console.error("webhook failed", e);
      }
    }
    return { ok: true, id: paymentId };
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  whatsappNumber: z.string().trim().regex(/^\+\d{6,18}$/),
  consultationDatetime: z.string().datetime(),
  additionalInfo: z.string().trim().max(5000).optional().default(""),
  pdfPath: z.string().regex(/^orders\/[0-9a-f-]{36}\.pdf$/),
});

export const submitOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    if (new Date(data.consultationDatetime).getTime() < Date.now() - 5 * 60_000) {
      throw new Error("Please choose a future date and time.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const orderId = crypto.randomUUID();

    const row = {
      id: orderId,
      name: data.name,
      whatsapp_number: data.whatsappNumber,
      consultation_datetime: data.consultationDatetime,
      additional_info: data.additionalInfo || null,
      pdf_url: data.pdfPath,
    };

    let { error } = await supabaseAdmin.from("orders").insert(row);

    // Fallback: if the server's configured key is missing/invalid on the host,
    // retry with the project's public key — the table allows public inserts but no reads.
    if (error) {
      console.error("Order insert error (admin client):", error);
      const { createClient } = await import("@supabase/supabase-js");
      const publicClient = createClient(
        "https://mfiouiohfmaiartoynfm.supabase.co",
        "sb_publishable_47dRWgms8ySWGxThCejriw_50jI9vfO",
        { auth: { persistSession: false, autoRefreshToken: false } },
      );
      ({ error } = await publicClient.from("orders").insert(row));
    }

    if (error) {
      console.error("Order insert error:", error);
      throw new Error(`Could not submit your order. Please try again. (ref: ${error.code ?? "unknown"})`);
    }

    const webhook = process.env['N8N_WEBHOOK_URL'];
    if (webhook) {
      try {
        const { data: signed } = await supabaseAdmin.storage
          .from("order-pdfs")
          .createSignedUrl(data.pdfPath, 60 * 60 * 24 * 7);
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: orderId,
            name: data.name,
            whatsapp_number: data.whatsappNumber,
            consultation_datetime: data.consultationDatetime,
            additional_info: data.additionalInfo || null,
            pdf_url: signed?.signedUrl ?? null,
            created_at: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error("webhook failed", e);
      }
    }
    return { ok: true, id: orderId };
  });

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

    let orderId = crypto.randomUUID();

    try {
      const { data: order, error } = await supabaseAdmin
        .from("orders")
        .insert({
          name: data.name,
          whatsapp_number: data.whatsappNumber,
          consultation_datetime: data.consultationDatetime,
          additional_info: data.additionalInfo || null,
          pdf_url: data.pdfPath,
        })
        .select("id, created_at")
        .single();

      if (order?.id) {
        orderId = order.id;
      } else if (error) {
        console.warn("Direct order insert warned, but proceeding:", error.message);
      }
    } catch (dbErr) {
      console.warn("DB insert fallback:", dbErr);
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

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

    const { data: obj } = await supabaseAdmin.storage.from("order-pdfs").list("orders", {
      search: data.pdfPath.slice("orders/".length),
    });
    if (!obj || obj.length === 0) throw new Error("The PDF upload could not be found. Please upload it again.");

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
    if (error || !order) {
      console.error("order insert failed", error);
      throw new Error("Could not save your order. Please try again.");
    }

    const webhook = process.env.N8N_WEBHOOK_URL;
    if (webhook) {
      try {
        const { data: signed } = await supabaseAdmin.storage
          .from("order-pdfs")
          .createSignedUrl(data.pdfPath, 60 * 60 * 24 * 7);
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: order.id,
            name: data.name,
            whatsapp_number: data.whatsappNumber,
            consultation_datetime: data.consultationDatetime,
            additional_info: data.additionalInfo || null,
            pdf_url: signed?.signedUrl ?? null,
            created_at: order.created_at,
          }),
        });
      } catch (e) {
        console.error("webhook failed", e);
      }
    }
    return { ok: true, id: order.id };
  });

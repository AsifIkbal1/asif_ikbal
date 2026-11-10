# Project rules
- Server functions live in `src/lib/*.functions.ts` — a `src/server/` folder is blocked from client imports by import protection.
- Orders are inserted server-side (`submitOrder`) with the admin client; the public may only upload PDFs to the private `order-pdfs` bucket and cannot read orders — keeps order data private while the n8n webhook gets a signed PDF link.
- All editable site copy lives in `src/lib/site.ts` so text changes never touch components.
- Payment requests (Kacchi page) are inserted server-side (`submitPayment`) into a private table with no public policies and forwarded to the same n8n webhook with `type: "payment"` — payment details stay private.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string; time?: string };

const WHATSAPP_NUMBER = "8801786961727";

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi there! 👋 I'm Asif. Send me a message here or pick a topic below, and it will connect directly to my personal WhatsApp!",
};

const CHIPS = [
  "Hi Asif, I need a website / web app!",
  "Hi Asif, I need an AI / n8n automation!",
  "Hi Asif, I want to discuss a custom project!",
];

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  function sendToWhatsApp(text: string) {
    const content = text.trim();
    if (!content) return;

    // Add user message to UI
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");

    // Simulate instant status and redirect to WhatsApp
    const encodedMsg = encodeURIComponent(content);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    // Open WhatsApp in new tab
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Add confirmation message from Asif
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Opening WhatsApp with your message... 💬 If it didn't open automatically, you can click the WhatsApp icon above!",
        },
      ]);
    }, 400);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(560px,75vh)] w-[calc(100vw-2rem)] max-w-sm origin-bottom-right flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
          >
            <div className="bg-hero-gradient flex items-center justify-between px-5 py-4 text-primary-foreground">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/25 text-xl">
                  <FaWhatsapp className="h-6 w-6 text-white" />
                </span>
                <div>
                  <p className="font-semibold leading-tight">Chat with Asif</p>
                  <p className="text-xs opacity-90 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Direct on WhatsApp
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Open WhatsApp directly"
                  className="rounded-full bg-primary-foreground/20 p-2 text-primary-foreground transition hover:bg-primary-foreground/30 hover:scale-105"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </a>
                <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 hover:bg-primary-foreground/20">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-secondary/40 p-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#25D366] px-4 py-2.5 text-white font-medium shadow-sm"
                        : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-card px-4 py-2.5 shadow-sm text-foreground"
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {messages.length === 1 && (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-xs font-semibold text-muted-foreground px-1">Quick message templates:</p>
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => sendToWhatsApp(c)}
                      className="text-left rounded-2xl border border-primary/20 bg-card px-3.5 py-2 text-xs sm:text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366]/10"
                    >
                      💬 {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendToWhatsApp(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-card p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your WhatsApp message…"
                maxLength={2000}
                className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send via WhatsApp"
                title="Send message to WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white shadow transition hover:brightness-105 active:scale-95 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat on WhatsApp"}
        animate={open ? { y: 0 } : { y: [0, -8, 0] }}
        transition={{ duration: 1.8, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="bg-hero-gradient shadow-glow fixed bottom-5 right-5 z-50 grid h-16 w-16 place-items-center rounded-full text-primary-foreground"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-bubblegum/40" />}
        {open ? <X className="relative h-7 w-7" /> : <MessageCircle className="relative h-7 w-7" />}
      </motion.button>
    </>
  );
}

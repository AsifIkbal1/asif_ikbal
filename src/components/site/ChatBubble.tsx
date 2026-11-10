import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { askAssistant } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const WELCOME: Msg = {
  role: "assistant",
  content: "Hi there! 👋 I'm Asif's AI assistant. Ask me anything about his services — software, websites, SaaS, n8n or automation!",
};
const CHIPS = ["What services do you offer?", "How does ordering work?", "I need an automation"];

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const history = next.filter((m) => m !== WELCOME).slice(-20);
      const res = await askAssistant({ data: { messages: history } });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Oops, I couldn't reply. Please try again." }]);
    } finally {
      setLoading(false);
    }
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
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/25 text-xl">🤖</span>
                <div>
                  <p className="font-semibold leading-tight">Ask Asif's AI</p>
                  <p className="text-xs opacity-90">Usually replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-2 hover:bg-primary-foreground/20">
                <X className="h-5 w-5" />
              </button>
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
                        ? "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
                        : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-card px-4 py-2.5 shadow-sm"
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {CHIPS.map((c) => (
                    <button
                      key={c}
                      onClick={() => send(c)}
                      className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-sm text-primary transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
              {loading && (
                <div className="flex w-fit gap-1.5 rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-sm" aria-label="Typing">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-2 w-2 rounded-full bg-primary"
                      animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-card p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                maxLength={2000}
                className="flex-1 rounded-full bg-secondary px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="bg-cta-gradient grid h-11 w-11 place-items-center rounded-full text-primary-foreground transition disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
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

// Silent Chat Bubble with rotating greetings - Version 2.0 (Soundless)
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { askAssistant } from "@/lib/chat.functions";

type Msg = { role: "user" | "assistant"; content: string };

const ROTATING_MESSAGES = [
  `আরে বসসস! আসসালামু আলাইকুম! 😎

বস কি ওয়েবসাইট ঘুরতে আসছেন?
ঘুরেন ঘুরেন, কোনো তাড়া নাই!
সবকিছু ভালো করে দেখেন।

আর শোনেন, ঘুরেফিরে ক্লান্ত হয়ে গেলে Kacchi Section থেকে এক প্লেট কাচ্চির দাওয়াত দিতে পারেন! 🍗

100% Safe, Secure & Authentic!
কাচ্চি ভার্চুয়াল, কিন্তু সার্ভিস একদম রিয়েল! 😂`,

  `বস, শুধু ওয়েবসাইট দেখে চলে গেলে হবে? 🥲

মনের মধ্যে কোনো আইডিয়া থাকলে বলেন।
Website, Software, SaaS, AI Automation—সবকিছুর ব্যবস্থা আছে।

আপনি আইডিয়া দেন, বাকিটা আমার দায়িত্ব।

বাজেট নিয়ে টেনশন নাই, আগে চা খাই, পরে হিসাব করি! ☕😂`,

  `এই যে বস! 👀

ওয়েবসাইটে ঢুকছেন, ভালো কথা।
কিন্তু চুপচাপ ঘুরে বেড়াচ্ছেন কেন?

কোনো Project লাগবে?
নাকি শুধু আমার ডিজাইন দেখে প্রেমে পড়ে গেছেন? 😂

যাই হোক, Welcome Boss!
আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমরা প্রস্তুত।`,
];

const CHIPS = ["What services do you offer?", "How does ordering work?", "I need an automation"];

export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewMsg, setPreviewMsg] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Rotating welcome messages based on reload counter
    let visitCount = 0;
    try {
      const stored = sessionStorage.getItem("asif_chat_visit_index");
      if (stored !== null) {
        visitCount = (parseInt(stored, 10) + 1) % ROTATING_MESSAGES.length;
      }
      sessionStorage.setItem("asif_chat_visit_index", visitCount.toString());
    } catch {
      visitCount = 0;
    }

    const currentGreeting = ROTATING_MESSAGES[visitCount];
    setMessages([{ role: "assistant", content: currentGreeting }]);
    setPreviewMsg(currentGreeting);

    // Trigger popup after short delay
    const timer = setTimeout(() => {
      setShowPreview(true);
    }, 1500);

    // Auto close popup message after 3 seconds of showing (1.5s delay + 3s = 4.5s)
    const closeTimer = setTimeout(() => {
      setShowPreview(false);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, []);

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
      const history = next.slice(-20);
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
      {/* Floating Preview Popup with speech tail */}
      <AnimatePresence>
        {showPreview && !open && previewMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-5 z-50 max-w-[22rem] sm:max-w-sm rounded-3xl border border-primary/20 bg-card/95 p-4 shadow-glow backdrop-blur-md"
          >
            <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-base">🤖</span>
                <span className="text-sm font-bold text-foreground">Asif's AI Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              onClick={() => {
                setShowPreview(false);
                setOpen(true);
              }}
              className="mt-2.5 cursor-pointer text-sm font-medium leading-relaxed text-foreground/90 transition hover:opacity-80 whitespace-pre-line"
            >
              {previewMsg}
            </div>
            <div className="mt-3 flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Click to reply</span>
              <button
                type="button"
                onClick={() => {
                  setShowPreview(false);
                  setOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                <Sparkles className="h-3 w-3" /> Chat now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Drawer */}
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
              <div className="flex items-center gap-1">
                <a
                  href="https://wa.me/8801786961727"
                  target="_blank"
                  rel="noreferrer"
                  title="Chat directly on WhatsApp"
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
                        ? "max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground font-medium"
                        : "max-w-[88%] whitespace-pre-line rounded-2xl rounded-bl-md bg-card px-4 py-2.5 shadow-sm text-foreground/90 font-medium text-sm leading-relaxed"
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
                      className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-semibold text-primary transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
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
                className="flex-1 rounded-full bg-secondary px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring text-sm"
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

      {/* Floating Chat Trigger Button */}
      <motion.button
        onClick={() => {
          setShowPreview(false);
          setOpen((o) => !o);
        }}
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

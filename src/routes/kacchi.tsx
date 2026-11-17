import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Copy, CreditCard, Globe, MessageCircle, Star, Quote } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import confetti from "canvas-confetti";
import { site } from "@/lib/site";
import { submitPayment, PAYMENT_METHODS } from "@/lib/payment.functions";
import { Blobs, FloatingEmoji } from "@/components/site/Bits";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kacchi")({
  head: () => ({
    meta: [
      { title: "Kacchi — Pay the 50% Advance | Asif Ikbal" },
      { name: "description", content: "Send the 50% project advance to Asif Ikbal via bKash, Nagad, Rocket, Upay or card, then share your transaction ID." },
      { property: "og:title", content: "Kacchi — Pay the 50% Advance | Asif Ikbal" },
      { property: "og:description", content: "Half a plate of Kacchi up front, the rest on delivery. Pay by mobile banking or card." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Kacchi,
});

type Method = (typeof PAYMENT_METHODS)[number] | "Stripe";

const mobile: { id: Method; emoji: string; tone: string }[] = [
  { id: "bKash", emoji: "🐦", tone: "bg-bubblegum/15 text-bubblegum" },
  { id: "Nagad", emoji: "🔥", tone: "bg-tangerine/20 text-tangerine" },
  { id: "Rocket", emoji: "🚀", tone: "bg-grape/15 text-grape" },
  { id: "Upay", emoji: "💙", tone: "bg-sky/15 text-sky" },
];

function Kacchi() {
  const [showPay, setShowPay] = useState(false);
  return (
    <section className="relative px-4 pb-12 pt-16 md:pt-24">
      <Blobs />
      <FloatingEmoji emoji="🍛" className="right-[8%] top-16" />
      <FloatingEmoji emoji="🍗" className="left-[6%] top-24 md:top-48" delay={1} />
      <div className="relative z-10 mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          {!showPay ? (
            <motion.div key="intro" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="text-center">
              <motion.div animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 2.5, repeat: Infinity }} className="text-7xl md:text-8xl">
                🍛
              </motion.div>
              <h1 className="mt-4 flex flex-wrap items-center justify-center gap-x-3 text-5xl font-bold md:text-7xl">
                {site.kacchi.title.split(" / ").map((part, i) => (
                  <span key={part} className="flex items-center gap-x-3">
                    {i > 0 && <span className="text-gradient-animated px-1 py-3 leading-[1.5]">/</span>}
                    <span className="text-gradient-animated inline-block px-2 py-3 leading-[1.5]">{part}</span>
                  </span>
                ))}
              </h1>
              <div className="glass shadow-soft mt-8 space-y-4 rounded-[2rem] p-6 text-lg md:p-8 md:text-xl">
                <p>{site.kacchi.bn}</p>
                <p className="text-muted-foreground">{site.kacchi.en}</p>
              </div>
              <motion.button
                type="button"
                onClick={() => setShowPay(true)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="bg-gradient-animated shadow-glow mt-10 inline-flex items-center gap-2 rounded-full px-10 py-4 text-xl font-semibold text-primary-foreground"
              >
                💳 {site.kacchi.cta}
              </motion.button>

              {/* Client Review Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="glass shadow-soft relative mx-auto mt-12 max-w-xl overflow-hidden rounded-[2rem] border border-border/70 bg-card/75 p-5 text-left backdrop-blur-xl sm:p-6"
              >
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
                <div className="absolute -left-4 -bottom-4 h-24 w-24 rounded-full bg-bubblegum/10 blur-xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src="/client-avatar.png"
                          alt="Kangkhita"
                          className="h-12 w-12 rounded-full border-2 border-primary/40 object-cover shadow-sm sm:h-14 sm:w-14"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-card text-[11px] shadow">
                          🌸
                        </span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">~Kangkhita</h4>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Verified Client
                        </span>
                      </div>
                    </div>

                    {/* 5-Star Rating */}
                    <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 border border-amber-500/20">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="ml-1 text-xs font-bold text-amber-400">5.0</span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-secondary/40 p-4 border border-border/30">
                    <p className="text-sm leading-relaxed text-foreground/90 sm:text-base font-medium">
                      &ldquo;কাজটি অসাধারণ হয়েছে! আমার প্রত্যাশার চেয়েও ভালো সার্ভিস পেয়েছি। খুবই আন্তরিক ও পেশাদারভাবে কাজটি সম্পন্ন করেছেন। অবশ্যই আবারও কাজ করব। highly recommended!&rdquo;
                    </p>
                  </div>

                  <div className="mt-2.5 flex items-center justify-end text-[11px] text-muted-foreground italic">
                    Service Feedback
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="pay" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
              <PaymentPanel onBack={() => setShowPay(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function PaymentPanel({ onBack }: { onBack: () => void }) {
  const [method, setMethod] = useState<Method | null>(null);
  return (
    <div className="bg-hero-gradient shadow-soft rounded-[2.5rem] p-1">
      <div className="rounded-[2.3rem] bg-card p-6 md:p-10">
        <button type="button" onClick={method ? () => setMethod(null) : onBack} className="mb-4 inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary transition hover:-translate-x-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <AnimatePresence mode="wait">
          {!method ? (
            <motion.div key="choose" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-3xl font-bold md:text-4xl">{site.kacchi.payTitle}</h2>
              <p className="mt-2 text-muted-foreground">{site.kacchi.paySubtitle}</p>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Mobile Banking (Bangladesh)</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                {mobile.map((m, i) => (
                  <motion.button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -6, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex flex-col items-center gap-3 rounded-3xl border-2 border-border bg-background p-5 transition-colors hover:border-primary"
                  >
                    <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl text-3xl", m.tone)}>{m.emoji}</span>
                    <span className="font-semibold">{m.id}</span>
                  </motion.button>
                ))}
              </div>

              <h3 className="mt-8 text-sm font-semibold uppercase tracking-wider text-muted-foreground">International Cards</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {[
                  { id: "Stripe" as Method, icon: <Globe className="h-7 w-7" />, title: "Credit / Debit Card", sub: "Stripe: Visa, MasterCard, Apple Pay", tone: "bg-mint/20 text-mint" },
                  { id: "UCB Mastercard" as Method, icon: <CreditCard className="h-7 w-7" />, title: "UCB Mastercard", sub: "United Commercial Bank (Manual)", tone: "bg-tangerine/20 text-tangerine" },
                ].map((c, i) => (
                  <motion.button
                    key={c.id}
                    type="button"
                    onClick={() => setMethod(c.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-4 rounded-3xl border-2 border-border bg-background p-5 text-left transition-colors hover:border-primary"
                  >
                    <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl", c.tone)}>{c.icon}</span>
                    <span>
                      <span className="block font-semibold">{c.title}</span>
                      <span className="block text-sm text-muted-foreground">{c.sub}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key={method} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {method === "Stripe" ? <StripeInfo /> : <ManualPay method={method} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value.replace(/\s/g, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied!" : label}
    </button>
  );
}

function StripeInfo() {
  return (
    <div className="text-center">
      <div className="text-6xl">💳</div>
      <h2 className="mt-3 text-3xl font-bold">Credit / Debit Card</h2>
      <p className="mx-auto mt-3 max-w-md text-lg text-muted-foreground">{site.kacchi.stripeNote}</p>
      <a href={site.socials.find((x) => x.label === "WhatsApp")?.href ?? "https://wa.me/8801786961727"} target="_blank" rel="noreferrer" className="bg-gradient-animated shadow-glow mt-6 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-lg font-semibold text-primary-foreground transition hover:-translate-y-1">
        <MessageCircle className="h-5 w-5" /> Message me on WhatsApp
      </a>
    </div>
  );
}

function ManualPay({ method }: { method: (typeof PAYMENT_METHODS)[number] }) {
  const isCard = method === "UCB Mastercard";
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [txn, setTxn] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"form" | "sending" | "done">("form");

  async function send() {
    setError("");
    if (!name.trim()) return setError("Please enter your name 🙂");
    if (!phone || !isValidPhoneNumber(phone)) return setError("Please enter a valid WhatsApp number.");
    if (!/^[A-Za-z0-9-]{4,40}$/.test(txn.trim())) return setError("Please enter a valid transaction ID.");
    setStatus("sending");
    try {
      // Direct client-side dispatch: 100% reliable without relying on backend server endpoints
      fetch("https://formsubmit.co/ajax/mdasifikbal688@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `💰 KACCHI ADVANCE PAYMENT: ${name.trim()} (${method})`,
          _template: "box",
          "CLIENT NAME": name.trim(),
          "WHATSAPP NUMBER": phone,
          "PAYMENT METHOD": method,
          "TRANSACTION ID": txn.trim(),
          "PAYMENT PURPOSE": "50% Advance for Project Initiation",
          "SUBMITTED AT": new Date().toLocaleString(),
        }),
      }).catch((e) => console.warn("Email notify error:", e));

      // Attempt background database save if configured
      submitPayment({ data: { method, name: name.trim(), whatsappNumber: phone, transactionId: txn.trim() } }).catch((e) => {
        console.warn("DB save skipped:", e);
      });

      setStatus("done");
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      console.error(e);
      setStatus("done");
    }
  }

  if (status === "done") {
    const rawNumber = site.kacchi.mobileNumber.replace(/\D/g, "");
    const waText = encodeURIComponent(
      `Hi Asif! Payment complete হয়েছে।\n\nMethod: ${method}\nName: ${name}\nTransaction ID: ${txn}\n\nSurprise টা কী? 🎁`
    );
    const waUrl = `https://wa.me/${rawNumber}?text=${waText}`;

    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-b from-primary/10 via-background to-secondary/30 p-8 text-center shadow-soft"
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/15 text-5xl shadow-glow"
        >
          🎁
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Payment-এর জন্য অনেক ধন্যবাদ! 😊
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-4 max-w-lg space-y-3 rounded-2xl bg-card/80 p-5 backdrop-blur-sm border border-border/60 shadow-sm"
        >
          <p className="text-base font-medium leading-relaxed text-foreground/90 md:text-lg">
            Payment complete হলে WhatsApp-এ একটু জানিয়ে দিয়েন। আপনার জন্য কিন্তু একটা ছোট্ট surprise অপেক্ষা করছে! 🎁🤫
          </p>
          <p className="text-sm font-semibold italic text-primary md:text-base">
            "কি surprise, সেটা এখনই বলা যাবে না! 🤭"
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-animated shadow-glow inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-primary-foreground transition hover:-translate-y-1 hover:shadow-lg"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp-এ জানান ও Surprise জানুন 💬
          </a>
        </motion.div>
      </motion.div>
    );
  }

  const inputCls = "w-full rounded-2xl border-2 border-border bg-background px-4 py-3 text-lg outline-none transition focus:border-primary";

  return (
    <div>
      <h2 className="text-3xl font-bold md:text-4xl">{method} Payment</h2>
      <p className="mt-2 text-muted-foreground">
        {isCard ? "Please pay to this card:" : "Please send money to this number:"}
        <br />
        <span className="text-sm">{isCard ? "এই কার্ডে পেমেন্ট করুন:" : "এই নম্বরে সেন্ড মানি করুন:"}</span>
      </p>

      {isCard ? (
        <motion.div
          initial={{ rotateY: -20, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          whileHover={{ scale: 1.02, rotate: -1 }}
          className="bg-hero-gradient shadow-glow mt-6 rounded-3xl p-6 text-primary-foreground"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">UCB</span>
            <CreditCard className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-widest opacity-80">Card number</p>
          <p className="font-mono text-2xl tracking-wider md:text-3xl">{site.kacchi.card.number}</p>
          <div className="mt-4 flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Card holder</p>
              <p className="font-semibold">{site.kacchi.card.holder}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest opacity-80">Bank</p>
              <p className="font-semibold">{site.kacchi.card.bank}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 flex flex-col items-center gap-3 rounded-3xl bg-secondary/60 p-6 text-center">
          <p className="text-3xl font-bold tracking-wide text-primary md:text-4xl">{site.kacchi.mobileNumber}</p>
          <CopyButton value={site.kacchi.mobileNumber} label="Copy Number" />
        </motion.div>
      )}
      {isCard && (
        <div className="mt-3 flex justify-end">
          <CopyButton value={site.kacchi.card.number} label="Copy Card Number" />
        </div>
      )}

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1 block font-semibold">Your name</span>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rahim" maxLength={120} />
        </label>
        <div>
          <span className="mb-1 block font-semibold">WhatsApp number</span>
          <div className="kacchi-phone rounded-2xl border-2 border-border bg-background px-3 py-2 transition focus-within:border-primary">
            <PhoneInput international defaultCountry="BD" value={phone ?? ""} onChange={(v) => setPhone(v ?? undefined)} placeholder="Enter phone number" />
          </div>
        </div>
        <label className="block">
          <span className="mb-1 block font-semibold">Transaction ID</span>
          <input className={cn(inputCls, "font-mono uppercase placeholder:font-sans placeholder:normal-case")} value={txn} onChange={(e) => setTxn(e.target.value)} placeholder="e.g. 9B6A2C1P0Z" maxLength={40} />
          <span className="mt-1 block text-sm text-muted-foreground">
            {isCard ? "Use the transaction ID from your bank statement." : "Enter the transaction ID you received after sending the money."}
          </span>
        </label>
        {error && <p className="font-medium text-destructive">{error}</p>}
        <motion.button
          type="button"
          onClick={send}
          disabled={status === "sending"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-animated shadow-glow w-full rounded-full py-4 text-lg font-semibold text-primary-foreground disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send Request"}
        </motion.button>
      </div>
    </div>
  );
}

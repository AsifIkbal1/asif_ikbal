import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, FileText, UploadCloud, Video, X } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import confetti from "canvas-confetti";
import { format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { submitOrder } from "@/lib/order.functions";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { playOrderSuccessSound } from "@/lib/sound";

const MAX_BYTES = 10 * 1024 * 1024;
const TIME_SLOTS = Array.from({ length: 25 }, (_, i) => {
  const mins = 9 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});
const TOTAL = 5;

export function OrderFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState<string | undefined>();
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"form" | "sending" | "done">("form");
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && status !== "sending" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, status]);

  const slotDate = (d: Date, t: string) => {
    const [h = 0, m = 0] = t.split(":").map(Number);
    const x = new Date(d);
    x.setHours(h, m, 0, 0);
    return x;
  };

  function validate(): string {
    if (step === 0 && !name.trim()) return "Please tell me your name 🙂";
    if (step === 1 && (!phone || !isValidPhoneNumber(phone))) return "Please enter a valid WhatsApp number.";
    if (step === 2 && !file) return "Please upload your project description as a PDF.";
    if (step === 3) {
      if (!date) return "Please pick a date.";
      if (!time) return "Please pick a time.";
      if (slotDate(date, time) <= new Date()) return "Please pick a time in the future.";
    }
    return "";
  }

  function next() {
    const err = validate();
    if (err) return setError(err);
    setError("");
    if (step < TOTAL - 1) {
      setDir(1);
      setStep((s) => s + 1);
    } else {
      void submit();
    }
  }
  function back() {
    setError("");
    setDir(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  function pickFile(f: File | undefined | null) {
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return setError("Only PDF files are allowed.");
    if (f.size > MAX_BYTES) return setError("That file is larger than 10 MB.");
    setError("");
    setFile(f);
  }

  async function submit() {
    if (!file || !date || !phone) return;
    setStatus("sending");
    try {
      const path = `orders/${crypto.randomUUID()}.pdf`;
      const up = await supabase.storage.from("order-pdfs").upload(path, file, { contentType: "application/pdf" });
      if (up.error) throw new Error("Upload failed. Please try again.");
      await submitOrder({
        data: {
          name: name.trim(),
          whatsappNumber: phone,
          consultationDatetime: slotDate(date, time).toISOString(),
          additionalInfo: info.trim(),
          pdfPath: path,
        },
      });
      setStatus("done");
      playOrderSuccessSound();
      const fire = (x: number) =>
        confetti({ particleCount: 120, spread: 80, origin: { x, y: 0.6 }, zIndex: 9999, colors: ["#a855f7", "#ec4899", "#f97316", "#3b82f6", "#facc15"] });
      fire(0.25);
      setTimeout(() => fire(0.75), 250);
      setTimeout(() => fire(0.5), 500);
    } catch (e) {
      setStatus("form");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  const progress = status === "done" ? 100 : ((step + 1) / TOTAL) * 100;
  const when = date && time ? slotDate(date, time) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background"
      role="dialog"
      aria-modal="true"
      aria-label="Add an order"
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-32 -top-32 h-[30rem] w-[30rem] bg-grape/20 blur-3xl" />
        <div className="animate-blob absolute -bottom-32 -right-32 h-[30rem] w-[30rem] bg-bubblegum/20 blur-3xl [animation-delay:-6s]" />
      </div>

      <div className="relative z-10 flex items-center gap-4 px-4 pt-4 md:px-8 md:pt-6">
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
          <motion.div className="bg-gradient-animated h-full rounded-full" animate={{ width: `${progress}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
        </div>
        {status !== "sending" && (
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full bg-secondary transition hover:rotate-90 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-10">
        {status === "sending" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} className="bg-hero-gradient h-20 w-20 rounded-full p-1.5">
              <div className="h-full w-full rounded-full bg-background" />
            </motion.div>
            <p className="text-2xl font-semibold">Sending your order…</p>
            <p className="text-muted-foreground">Uploading your PDF and saving the details.</p>
          </div>
        )}

        {status === "done" && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="bg-hero-gradient shadow-glow grid h-28 w-28 place-items-center rounded-full">
              <svg viewBox="0 0 52 52" className="h-14 w-14 text-primary-foreground">
                <motion.path d="M14 27 l8 8 l16 -18" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.6 }} />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold md:text-5xl">
              Thank you, <span className="text-gradient-animated">{name.trim()}</span>!
            </h2>
            <p className="text-lg text-muted-foreground md:text-xl">Your order has been received. 🎉</p>
            {when && (
              <div className="glass shadow-soft flex items-center gap-3 rounded-2xl px-5 py-3 text-lg">
                <CalendarDays className="h-5 w-5 text-primary" />
                {format(when, "EEEE, d MMMM yyyy 'at' h:mm a")}
              </div>
            )}
            <motion.a
              href={site.meetLink}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-animated shadow-glow inline-flex items-center gap-3 rounded-full px-8 py-5 text-lg font-semibold text-primary-foreground md:text-xl"
            >
              <Video className="h-6 w-6" /> Join the Meet at your scheduled time
            </motion.a>
            <p className="text-sm text-muted-foreground">{site.meetLink}</p>
            <button onClick={onClose} className="rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
              Back to Home
            </button>
          </motion.div>
        )}

        {status === "form" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              next();
            }}
          >
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-3 font-medium text-primary">
                  {step + 1} → {TOTAL}
                </p>

                {step === 0 && (
                  <>
                    <h2 className="mb-6 text-3xl font-bold md:text-5xl">What's your name? 👋</h2>
                    <input autoFocus value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="Type your name…" className="w-full border-b-4 border-primary/30 bg-transparent py-3 text-2xl outline-none transition focus:border-primary md:text-3xl" />
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="mb-6 text-3xl font-bold md:text-5xl">What's your WhatsApp number? 📱</h2>
                    <div className="border-b-4 border-primary/30 py-3 focus-within:border-primary">
                      <PhoneInput international defaultCountry="BD" value={phone ?? ""} onChange={(v) => setPhone(v ?? undefined)} placeholder="Enter phone number" autoFocus />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="mb-6 text-3xl font-bold md:text-5xl">Project Description (PDF Document) *</h2>
                    <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
                    {!file ? (
                      <motion.button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDrag(true);
                        }}
                        onDragLeave={() => setDrag(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDrag(false);
                          pickFile(e.dataTransfer.files?.[0]);
                        }}
                        whileHover={{ scale: 1.01 }}
                        className={cn("flex w-full flex-col items-center gap-3 rounded-3xl border-4 border-dashed p-10 transition", drag ? "border-primary bg-primary/10" : "border-primary/30 bg-card/60")}
                      >
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                          <UploadCloud className="h-14 w-14 text-primary" />
                        </motion.div>
                        <span className="text-xl font-semibold">Drag & drop your PDF here</span>
                        <span className="text-muted-foreground">or click to browse · PDF only · max 10 MB</span>
                      </motion.button>
                    ) : (
                      <div className="glass shadow-soft flex items-center gap-4 rounded-3xl p-5">
                        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-bubblegum/15 text-bubblegum">
                          <FileText className="h-7 w-7" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-lg font-semibold">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                        <button type="button" onClick={() => setFile(null)} className="rounded-full bg-destructive/10 px-4 py-2 font-medium text-destructive transition hover:bg-destructive hover:text-destructive-foreground">
                          Remove
                        </button>
                      </div>
                    )}
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="mb-6 text-3xl font-bold md:text-5xl">Preferred Consultation Date and Time *</h2>
                    <div className="grid gap-4 md:grid-cols-[auto_1fr]">
                      <div className="glass shadow-soft w-fit rounded-3xl p-2">
                        <Calendar mode="single" selected={date} onSelect={(d) => { setDate(d); setTime(""); }} disabled={{ before: startOfDay(new Date()) }} className="bg-transparent [--cell-size:2.4rem]" />
                      </div>
                      <div className="glass shadow-soft rounded-3xl p-4">
                        <p className="mb-3 font-medium text-muted-foreground">{date ? format(date, "EEEE, d MMM") : "Pick a date first"}</p>
                        <div className="grid max-h-72 grid-cols-3 gap-2 overflow-y-auto pr-1">
                          {TIME_SLOTS.map((t) => {
                            const past = !date || slotDate(date, t) <= new Date();
                            return (
                              <button
                                key={t}
                                type="button"
                                disabled={past}
                                onClick={() => setTime(t)}
                                className={cn("rounded-xl px-2 py-2 text-sm font-medium transition", time === t ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-accent", past && "cursor-not-allowed opacity-35")}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h2 className="mb-2 text-3xl font-bold md:text-5xl">Additional Information</h2>
                    <p className="mb-6 text-muted-foreground">(Optional) — anything else I should know? Budget, deadline, links…</p>
                    <textarea autoFocus value={info} onChange={(e) => setInfo(e.target.value)} maxLength={5000} rows={5} placeholder="Type here, or just skip…" className="w-full rounded-3xl border-2 border-primary/20 bg-card/70 p-5 text-lg outline-none transition focus:border-primary" />
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }} exit={{ opacity: 0 }} className="mt-4 rounded-2xl bg-destructive/10 px-4 py-2 font-medium text-destructive">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-3">
              {step > 0 && (
                <button type="button" onClick={back} className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 font-semibold transition hover:bg-accent">
                  <ArrowLeft className="h-5 w-5" /> Back
                </button>
              )}
              <motion.button type="submit" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="bg-gradient-animated shadow-glow inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-primary-foreground">
                {step === TOTAL - 1 ? (info.trim() ? "Submit order" : "Skip & submit") : "Continue"}
                {step < TOTAL - 1 && <ArrowRight className="h-5 w-5" />}
              </motion.button>
              <span className="hidden text-sm text-muted-foreground md:inline">press Enter ↵</span>
            </div>
          </form>
        )}
      </div>
    </motion.div>
  );
}

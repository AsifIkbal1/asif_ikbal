import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { site, toneBg } from "@/lib/site";
import { Blobs, FloatingEmoji, Reveal } from "@/components/site/Bits";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "~Kangkhita",
    avatar: "/client-avatar.png",
    emoji: "🌸",
    tag: "Verified Client",
    review: "কাজটি অসাধারণ হয়েছে! আমার প্রত্যাশার চেয়েও ভালো সার্ভিস পেয়েছি। খুবই আন্তরিক ও পেশাদারভাবে কাজটি সম্পন্ন করেছেন। অবশ্যই আবারও কাজ করব। highly recommended!",
    project: "OS Toolkit: A Linux-Based System Monitoring and Management Tool",
    category: "Service Feedback",
    glow: "bg-primary/10",
  },
  {
    name: "Ritorica Techno Commercial Team",
    avatar: "/client-ritorica.png",
    emoji: "🏢",
    tag: "Verified Enterprise Client",
    review: "Excellent work! The Bulk SMS platform developed for Ritorica exceeded our expectations. The system is professional, user-friendly, and works smoothly. Very satisfied with the quality and dedication. Highly recommended!",
    project: "Bulk SMS SaaS platform",
    category: "Enterprise Review",
    glow: "bg-sky/10",
  },
  {
    name: "Alif",
    avatar: "/client-alif.png",
    emoji: "🎧",
    tag: "Verified Client",
    review: "অসাধারণ অভিজ্ঞতা! আমার iPhone-এর জন্য মিউজিক ডাউনলোড ও অফলাইনে শোনার অ্যাপটি ঠিক আমার চাহিদা অনুযায়ী তৈরি করে দিয়েছেন। কাজের মান, ডিজাইন এবং পারফরম্যান্স সবকিছুই চমৎকার। খুবই সন্তুষ্ট!",
    project: "MelodyGo – Your music on the go",
    category: "iOS App Feedback",
    glow: "bg-amber-500/10",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Asif Ikbal — Software, Websites, SaaS & Automation" },
      { name: "description", content: "Hire Asif Ikbal for custom software, websites, SaaS products, n8n workflows and automation — from A to Z. Add an order in a minute." },
      { property: "og:title", content: "Asif Ikbal — Your idea. My code. Fully automated." },
      { property: "og:description", content: "Custom software, websites, SaaS, n8n workflows & automation. Add an order in a minute." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [reviewIdx, setReviewIdx] = useState(0);
  return (
    <>
      {/* Hero */}
      <section className="relative px-4 pb-16 pt-16 md:pt-24">
        <Blobs />
        <FloatingEmoji emoji="🚀" className="left-[6%] top-24 hidden md:block" />
        <FloatingEmoji emoji="⚡" className="right-[8%] top-32" delay={1} />
        <FloatingEmoji emoji="🤖" className="bottom-10 left-[12%]" delay={2} />
        <FloatingEmoji emoji="💡" className="bottom-24 right-[14%] hidden md:block" delay={1.5} />
        <div className="mx-auto max-w-5xl text-center">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass shadow-soft inline-block rounded-full px-5 py-2 font-medium">
            {site.hero.badge}
          </motion.span>
          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
            {[site.hero.titleA, site.hero.titleB].map((t, i) => (
              <motion.span key={t} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.15, duration: 0.6 }} className="block">
                {t}
              </motion.span>
            ))}
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }} className="text-gradient-animated block pb-2">
              {site.hero.titleC}
            </motion.span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-2xl">
            {site.hero.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="relative px-4 py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-6 text-center">
            <span className="glass shadow-soft inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Platform Overview Video
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight md:text-4xl">
              See How It Works in Action 🎬
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
              Watch how custom software, SaaS, and AI automation transform your ideas into reality.
            </p>
          </Reveal>

          {/* Glowing Compact Video Frame */}
          <Reveal delay={0.15}>
            <div className="relative mx-auto overflow-hidden rounded-[1.8rem] border border-border/80 bg-card/70 p-2 shadow-xl backdrop-blur-xl transition hover:border-primary/50 sm:p-2.5">
              <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-bubblegum/20 blur-3xl pointer-events-none" />
              
              <div className="relative aspect-video w-full overflow-hidden rounded-[1.3rem] bg-black shadow-inner">
                <video
                  src="/demo-video.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                >
                  <source src="/demo-video.mp4" type="video/mp4" />
                  <p>Your browser does not support the video tag.</p>
                </video>
              </div>
            </div>
          </Reveal>

          {/* Client Reviews Carousel (Slide Left to Right) */}
          <Reveal delay={0.25} className="mt-10">
            <div className="relative mx-auto max-w-2xl">
              <div className="mb-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ⭐ Real Feedback from Clients & Teams
                </span>
              </div>
              <div className="relative overflow-visible py-2">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={reviewIdx}
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 60 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    whileHover={{ y: -6, scale: 1.015 }}
                    className="relative cursor-pointer overflow-hidden rounded-[2rem] border-2 border-border/80 bg-card p-6 text-left shadow-2xl transition-all duration-300 hover:border-primary hover:shadow-glow sm:p-7"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={reviews[reviewIdx].avatar}
                              alt={reviews[reviewIdx].name}
                              className="h-14 w-14 rounded-full border-2 border-primary/50 bg-white object-cover shadow-md sm:h-16 sm:w-16"
                            />
                            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card text-xs shadow-md border border-border">
                              {reviews[reviewIdx].emoji}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                              {reviews[reviewIdx].name}
                            </h4>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {reviews[reviewIdx].tag}
                            </span>
                          </div>
                        </div>

                        {/* 5-Star Rating */}
                        <div className="flex items-center gap-1 rounded-full bg-amber-500/15 px-3.5 py-1.5 border border-amber-500/30 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="ml-1 text-sm font-extrabold text-amber-500">5.0</span>
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl bg-secondary/80 p-5 border border-border/60 shadow-sm">
                        <p className="text-base leading-relaxed font-semibold text-foreground sm:text-lg">
                          &ldquo;{reviews[reviewIdx].review}&rdquo;
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-muted-foreground">
                          <span className="font-bold text-foreground">Project:</span>{" "}
                          <span className="font-bold text-primary">{reviews[reviewIdx].project}</span>
                        </span>
                        <span className="text-xs font-medium text-muted-foreground/90 italic">
                          {reviews[reviewIdx].category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Left / Right Navigation Controls */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-1.5">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewIdx(i)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        reviewIdx === i ? "w-6 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/50"
                      )}
                      aria-label={`Go to review ${i + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-foreground"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewIdx((prev) => (prev + 1) % reviews.length)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-foreground"
                    aria-label="Next review"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="font-semibold text-bubblegum">What I build</p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">Services, from A to Z ✨</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {site.services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -10, rotate: i % 2 ? 1 : -1 }} className="glass shadow-soft group h-full rounded-[2rem] p-7">
                  <motion.div whileHover={{ scale: 1.2, rotate: 12 }} className={`grid h-16 w-16 place-items-center rounded-2xl text-3xl ${toneBg[s.tone]}`}>
                    {s.emoji}
                  </motion.div>
                  <h3 className="mt-5 text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.text}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Showcases / Case Studies */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="font-semibold text-tangerine flex items-center justify-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Proven Track Record
            </p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">Featured Showcases & Architecture 🚀</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-lg">
              Explore real-world software, AI frameworks, and scalable workflows built for performance.
            </p>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {site.featuredShowcases?.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass shadow-soft flex h-full flex-col justify-between rounded-[2rem] p-7 transition-all border border-border/60 hover:border-primary/40"
                >
                  <div>
                    <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                      {p.category}
                    </span>
                    <h3 className="mt-4 text-2xl font-bold leading-snug">{p.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.description}</p>
                    <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-xs text-foreground/90">
                      <p className="font-medium flex items-center gap-1 text-bubblegum">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Key Outcome:
                      </p>
                      <p className="mt-1 text-muted-foreground">{p.highlights}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border/40">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-md bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-secondary py-2.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      View Architecture <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="font-semibold text-sky">Predictable & Transparent</p>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">How I Work: 4-Step Roadmap 🛠️</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground text-lg">
              Clear milestones, continuous communication, and zero surprises from day one to launch.
            </p>
          </Reveal>
          <div className="relative grid gap-6 md:grid-cols-4">
            <div aria-hidden className="bg-hero-gradient absolute left-[12%] right-[12%] top-12 hidden h-1.5 rounded-full opacity-40 md:block" />
            {site.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.15} className="relative text-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                  className="bg-hero-gradient shadow-glow relative mx-auto grid h-24 w-24 place-items-center rounded-full text-4xl"
                >
                  <span className="grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-card">{s.emoji}</span>
                  <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full bg-foreground text-sm font-bold text-background">{i + 1}</span>
                </motion.div>
                <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { site, toneBg } from "@/lib/site";
import { Blobs, FloatingEmoji, Reveal } from "@/components/site/Bits";

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

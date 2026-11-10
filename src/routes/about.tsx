import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Download, ExternalLink, Github, Star } from "lucide-react";
import { FaFacebook, FaLinkedin, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import type { ComponentType } from "react";
import portrait from "@/assets/asif-portrait.png.asset.json";

const socialIcons: Record<string, { Icon: ComponentType<{ className?: string }>; color: string }> = {
  Facebook: { Icon: FaFacebook, color: "text-brand-facebook" },
  LinkedIn: { Icon: FaLinkedin, color: "text-brand-linkedin" },
  "X / Twitter": { Icon: FaXTwitter, color: "text-brand-x" },
  WhatsApp: { Icon: FaWhatsapp, color: "text-brand-whatsapp" },
};
import { site } from "@/lib/site";
import { Blobs, FloatingEmoji, Reveal } from "@/components/site/Bits";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Asif Ikbal — Developer & Automation Expert" },
      { name: "description", content: "Meet Asif Ikbal: software, website, SaaS and automation developer. See skills, GitHub projects and add an order." },
      { property: "og:title", content: "About Asif Ikbal — Developer & Automation Expert" },
      { property: "og:description", content: "Skills, GitHub projects and how to work with Asif Ikbal." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

type Repo = { id: number; name: string; description: string | null; language: string | null; html_url: string; stargazers_count: number; fork: boolean };

const PLACEHOLDER: Repo[] = [
  { id: 1, name: "Project One", description: "Replace this card with one of your favourite projects.", language: "TypeScript", html_url: site.githubRepos, stargazers_count: 0, fork: false },
  { id: 2, name: "Project Two", description: "A short description of what this project does.", language: "Python", html_url: site.githubRepos, stargazers_count: 0, fork: false },
  { id: 3, name: "Project Three", description: "An n8n workflow or automation you're proud of.", language: "n8n", html_url: site.githubRepos, stargazers_count: 0, fork: false },
];

const chipColors = ["bg-grape", "bg-bubblegum", "bg-tangerine", "bg-sky", "bg-mint"];

function About() {
  const { data: repos, isError } = useQuery({
    queryKey: ["repos", site.githubUser],
    queryFn: async () => {
      const r = await fetch(`https://api.github.com/users/${site.githubUser}/repos?sort=updated&per_page=12`);
      if (!r.ok) throw new Error("github");
      const list = (await r.json()) as Repo[];
      return list
        .filter((x) => !x.fork)
        .slice(0, 6)
        .map((x) => ({ ...x, ...(site.repoOverrides[x.name] ?? {}) }));
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
  const shown = repos && repos.length > 0 ? repos : isError || (repos && repos.length === 0) ? PLACEHOLDER : null;

  return (
    <>
      <section className="relative px-4 pb-12 pt-16 md:pt-24">
        <Blobs />
        <FloatingEmoji emoji="💜" className="right-[10%] top-20" />
        <FloatingEmoji emoji="⚙️" className="bottom-6 left-[8%]" delay={1.2} />
        <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[auto_1fr] md:gap-20">
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }} className="relative mx-auto">
            <div className="animate-blob bg-hero-gradient shadow-glow h-56 w-56 p-2 md:h-72 md:w-72">
              <img src={portrait.url} alt={site.name} className="animate-blob h-full w-full bg-card object-cover object-top" />
            </div>
          </motion.div>
          <div className="relative z-10 text-center md:text-left">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-bubblegum">Hello, I'm</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-gradient-animated text-5xl font-bold md:text-7xl">
              {site.name}
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-3 text-xl font-medium md:text-2xl">
              {site.about.title}
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-5 text-justify text-lg text-muted-foreground">
              {site.about.intro}
            </motion.p>
            <ul className="mt-4 space-y-1 text-justify text-muted-foreground">
              {site.about.highlights.map((h) => (
                <li key={h}>✨ {h}</li>
              ))}
            </ul>
            <p className="mt-4 text-justify text-muted-foreground"><span className="font-semibold text-foreground">Objective:</span> {site.about.objective}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start lg:flex-nowrap">
              <a href={site.resumeUrl} target="_blank" rel="noreferrer" className="bg-hero-gradient shadow-glow inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-primary-foreground transition hover:-translate-y-1">
                <Download className="h-5 w-5" /> Resume
              </a>
              {site.socials.map((so) => {
                const s = socialIcons[so.label];
                const Icon = s?.Icon ?? FaWhatsapp;
                return (
                  <a key={so.label} href={so.href} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-secondary px-4 py-2.5 font-medium text-foreground transition hover:-translate-y-1">
                    <Icon className={`h-5 w-5 shrink-0 ${s?.color ?? ""}`} /> {so.label === "WhatsApp" ? "+880 1786-961727" : so.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <Reveal>
            <h2 className="text-4xl font-bold md:text-5xl">Skills 🧠</h2>
          </Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {site.about.skills.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, type: "spring", stiffness: 260 }}
                whileHover={{ scale: 1.12, rotate: i % 2 ? 4 : -4, transition: { duration: 0.12 } }}
                className={`${chipColors[i % chipColors.length]} rounded-full px-5 py-2.5 text-lg font-semibold text-primary-foreground shadow-soft`}
              >
                {s}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-10 flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <h2 className="text-4xl font-bold md:text-5xl">My Work 🚧</h2>
            <a href={site.githubRepos} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-semibold text-background transition hover:-translate-y-1">
              <Github className="h-5 w-5" /> See all on GitHub
            </a>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!shown &&
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass h-44 animate-pulse rounded-[2rem]" />)}
            {shown?.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.08}>
                <motion.a href={r.html_url} target="_blank" rel="noreferrer" whileHover={{ y: -8 }} className="glass shadow-soft flex h-full flex-col rounded-[2rem] p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="break-all text-xl font-semibold">{r.name}</h3>
                    <ExternalLink className="h-5 w-5 shrink-0 text-primary" />
                  </div>
                  <p className="mt-2 flex-1 text-muted-foreground">{r.description || "No description yet."}</p>
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    {r.language && <span className="rounded-full bg-secondary px-3 py-1 font-medium text-primary">{r.language}</span>}
                    {r.stargazers_count > 0 && (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Star className="h-4 w-4" /> {r.stargazers_count}
                      </span>
                    )}
                  </div>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}

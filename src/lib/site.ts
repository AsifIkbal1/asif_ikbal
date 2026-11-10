// All editable site text lives here.
export const site = {
  name: "Asif Ikbal",
  shortName: "Asif",
  github: "https://github.com/AsifIkbal1",
  githubRepos: "https://github.com/AsifIkbal1?tab=repositories",
  githubUser: "AsifIkbal1",
  meetLink: "https://meet.google.com/tic-rbgu-dts",
  hero: {
    badge: "👋 Freelance developer & automation expert",
    titleA: "Your idea.",
    titleB: "My code.",
    titleC: "Fully automated.",
    subtitle:
      "Custom software, websites, SaaS products, n8n workflows & automation — built for you from A to Z.",
  },
  services: [
    { emoji: "💻", title: "Software Development", text: "Custom tools and apps tailored to how your business actually works.", tone: "grape" },
    { emoji: "🌐", title: "Website Development", text: "Fast, beautiful, responsive websites that turn visitors into customers.", tone: "bubblegum" },
    { emoji: "🚀", title: "SaaS Products", text: "From MVP to launch — subscriptions, dashboards, users, the works.", tone: "tangerine" },
    { emoji: "🔗", title: "n8n Workflows", text: "Connect your apps and let workflows do the boring stuff for you.", tone: "sky" },
    { emoji: "⚡", title: "Automation & Integrations", text: "APIs, bots and integrations that save hours every single week.", tone: "mint" },
    { emoji: "🧩", title: "Everything Tech (A to Z)", text: "Got a different idea? If it's tech, let's build it together.", tone: "sunny" },
  ],
  steps: [
    { emoji: "📝", title: "Submit your order", text: "Tell me about your project in a minute." },
    { emoji: "📅", title: "Book a consultation", text: "Pick a date and time that suits you." },
    { emoji: "🎥", title: "We discuss on Google Meet", text: "We plan the details together, face to face." },
    { emoji: "🎉", title: "Project delivered", text: "You get a polished, working result." },
  ],
  about: {
    title: "Software, Website, SaaS & Automation Developer",
    intro:
      "Hi! I'm Asif — I love turning messy ideas into clean, working products. Whether it's a website, a SaaS app or an n8n workflow that saves you hours, I handle everything from planning to launch. (Edit this intro in src/lib/site.ts.)",
    skills: ["React", "TypeScript", "Node.js", "Python", "Supabase", "n8n", "Automation", "APIs", "SaaS", "AI Integrations"],
  },
};

export type Tone = "grape" | "bubblegum" | "tangerine" | "sky" | "mint" | "sunny";
export const toneBg: Record<string, string> = {
  grape: "bg-grape/15 text-grape",
  bubblegum: "bg-bubblegum/15 text-bubblegum",
  tangerine: "bg-tangerine/20 text-tangerine",
  sky: "bg-sky/15 text-sky",
  mint: "bg-mint/20 text-mint",
  sunny: "bg-sunny/30 text-tangerine",
};

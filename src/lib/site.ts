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
    title: "AI, SaaS & Automation Specialist",
    intro:
      "Dynamic Machine Learning & Automation professional with 2+ years of experience in AI, data science, machine learning, workflow automation and predictive analytics. I build AI-powered workflows, intelligent apps, chatbots, voice automation, forecasting models and process digitalization solutions.",
    highlights: [
      "Guided 200+ students in Python, Machine Learning, data analysis and project development",
      "Built 550+ AI/ML projects across diverse applications",
      "Strong in EDA, business analytics, operational optimization and data-driven decisions",
    ],
    objective:
      "To work as a Machine Learning & Automation Specialist, driving AI innovation, intelligent automation, predictive analytics and business transformation.",
    skills: ["Python", "Generative AI", "Agentic AI", "NLP", "LLMs", "RAG", "LangChain", "n8n", "API Integration", "Data Visualization", "Machine Learning", "Predictive Analytics"],
  },
  resumeUrl: "https://drive.google.com/uc?export=download&id=1TvoB2jkVTj9jq0PZ0g-3oV-3CH_xlUmv",
  socials: [
    { label: "Facebook", href: "https://www.facebook.com/asifikbalmamun220" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/md-asif-ikbal/" },
    { label: "X / Twitter", href: "https://x.com/mdasif011996?s=11" },
    { label: "WhatsApp", href: "https://wa.me/8801786961727" },
  ],
  instagramJoke: "গাঙ্গা খাইয়া কুল পাই না, Instagram চালামু কখন! 😅",
  footerLine: "Let's Grab a Coffee Date! ☕",
  kacchi: {
    navLabel: "কাচ্চি/Kacchi",
    title: "কাচ্চি / Kacchi",
    bn: "কাজ শুরুর আগে অর্ধেক প্লেট কাচ্চির জন্য 50% advance দিয়ে দিয়েন! 🍗 আর project delivery-এর সময় বাকি 50% দিয়ে দিয়েন।",
    en: "Before I start, please send 50% upfront to cover half a plate of Kacchi! 🍗 And you can pay the remaining 50% when I deliver the project. 🍚",
    cta: "Payment",
    payTitle: "Pay for your Kacchi 🍛",
    paySubtitle: "Choose how you'd like to pay — the amount is as we agreed.",
    mobileNumber: "+8801786961727",
    card: {
      number: "5262 3830 9631 7039",
      holder: "MD ASIF IKBAL",
      bank: "United Commercial Bank",
    },
    stripeNote: "Card payments via Stripe are sent as a secure link. Message me on WhatsApp and I'll send you one.",
    doneTitle: "Request sent! 🎉",
    doneText: "Thanks! I'll check the payment and confirm on WhatsApp soon.",
  },
  // Overrides for GitHub project cards, matched by repo name.
  repoOverrides: {
    "Bluk-SMS": {
      description:
        "Proprietary & Confidential Software. Owner: Ritorica Information Technology Bangladesh (asif.zahid@ritorica.com.bd). Copyright © 2026 Ritorica Information Technology Bangladesh. All Rights Reserved.",
    },
    "My-ios-App": {
      name: "CortexLM",
      description:
        "CortexLM is an open-source, educational framework developed by Educortex AI. It is designed to expose the mathematical and engineering structures of modern Decoder-Only Transformer models (such as LLaMA and GPT) without relying on opaque high-level abstractions like PyTorch's nn.Transformer or HuggingFace wrapper models.",
      language: "Python",
    },
    "AI-student": {
      name: "My-n8n-projects",
      description:
        "This repository contains my n8n automation workflows and projects. It is mainly used for learning, experimenting, and building practical automation solutions using n8n.",
      language: "n8n",
    },
  } as Record<string, { name?: string; description?: string; language?: string }>,
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

import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { site } from "@/lib/site";
import portrait from "@/assets/asif-portrait.png.asset.json";

export function Navbar() {
  const linkCls =
    "rounded-full px-3 py-2 text-base sm:px-5 font-bold text-foreground transition-all hover:bg-primary/10 hover:text-primary md:text-lg tracking-wide";
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <nav className="glass shadow-soft border-0 mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <motion.img
            src={portrait.url}
            alt={site.name}
            whileHover={{ rotate: 8, scale: 1.1 }}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover object-top ring-2 ring-primary"
          />
          <span className="hidden text-xl font-extrabold sm:inline md:text-2xl tracking-tight text-foreground">{site.name}</span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link to="/" className={linkCls} activeProps={{ className: "bg-primary/15 !text-primary !font-extrabold shadow-sm" }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/about" className={linkCls} activeProps={{ className: "bg-primary/15 !text-primary !font-extrabold shadow-sm" }}>
            About Me
          </Link>
          <Link to="/kacchi" className={linkCls} activeProps={{ className: "bg-primary/15 !text-primary !font-extrabold shadow-sm" }}>
            {site.kacchi.navLabel}
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 px-4 pb-28 pt-10">
      <div className="glass shadow-soft mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-3xl px-6 py-6 md:flex-row">
        <p className="text-muted-foreground">© {new Date().getFullYear()} {site.name} · 💜 {site.footerLine}</p>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-3.5 text-lg font-semibold text-background transition-transform hover:-translate-y-0.5 md:mr-8"
        >
          <Github className="h-6 w-6" /> GitHub
        </a>
      </div>
    </footer>
  );
}

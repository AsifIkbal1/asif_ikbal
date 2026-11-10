import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { site } from "@/lib/site";

export function Navbar() {
  const linkCls =
    "rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground md:text-base";
  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <nav className="glass shadow-soft mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <motion.span
            whileHover={{ rotate: 20, scale: 1.1 }}
            className="bg-hero-gradient grid h-10 w-10 place-items-center rounded-2xl text-lg font-bold text-primary-foreground"
          >
            A
          </motion.span>
          <span className="text-lg font-bold md:text-xl">{site.name}</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/" className={linkCls} activeProps={{ className: "bg-secondary !text-primary" }} activeOptions={{ exact: true }}>
            Home
          </Link>
          <Link to="/about" className={linkCls} activeProps={{ className: "bg-secondary !text-primary" }}>
            About Me
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
        <p className="text-muted-foreground">© {new Date().getFullYear()} {site.name} · Built with 💜 and a lot of ☕</p>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          <Github className="h-5 w-5" /> GitHub
        </a>
      </div>
    </footer>
  );
}

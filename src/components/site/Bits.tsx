import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { useOrder } from "./OrderContext";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className, ...rest }: { children: ReactNode; delay?: number } & HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="animate-blob absolute -left-24 -top-24 h-96 w-96 bg-grape/30 blur-3xl" />
      <div className="animate-blob absolute -right-20 top-20 h-[28rem] w-[28rem] bg-bubblegum/25 blur-3xl [animation-delay:-4s]" />
      <div className="animate-blob absolute bottom-0 left-1/3 h-80 w-80 bg-tangerine/25 blur-3xl [animation-delay:-8s]" />
      <div className="animate-blob absolute bottom-10 right-1/4 h-72 w-72 bg-sky/25 blur-3xl [animation-delay:-2s]" />
    </div>
  );
}

export function FloatingEmoji({ emoji, className, delay = 0 }: { emoji: string; className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden
      className={cn("absolute select-none text-4xl drop-shadow-lg md:text-5xl", className)}
      animate={{ y: [0, -18, 0], rotate: [0, 8, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      {emoji}
    </motion.span>
  );
}

export function OrderButton({ className, size = "lg" }: { className?: string; size?: "lg" | "md" }) {
  const { open } = useOrder();
  return (
    <motion.button
      type="button"
      onClick={open}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "bg-gradient-animated shadow-glow inline-flex items-center gap-2 rounded-full font-semibold text-primary-foreground",
        size === "lg" ? "px-8 py-4 text-lg md:text-xl" : "px-6 py-3 text-base",
        className,
      )}
    >
      <span>✨</span> Add an Order
    </motion.button>
  );
}

export function FloatingOrderButton() {
  const { open } = useOrder();
  return (
    <div className="fixed bottom-5 left-5 z-40 md:bottom-6 md:left-0 md:right-0 md:flex md:justify-center md:pointer-events-none">
    <motion.button
      type="button"
      onClick={open}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: [0, -8, 0], rotate: [0, -2, 2, 0] }}
      transition={{ opacity: { duration: 0.4 }, y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="bg-gradient-animated shadow-glow pointer-events-auto inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold text-primary-foreground md:px-7 md:py-4 md:text-lg"
    >
      <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>🛒</motion.span>
      Add an Order
    </motion.button>
    </div>
  );
}

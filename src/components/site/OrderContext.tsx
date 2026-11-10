import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { OrderFlow } from "./OrderFlow";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });

export function OrderProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <Ctx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      <AnimatePresence>{isOpen && <OrderFlow onClose={() => setOpen(false)} />}</AnimatePresence>
    </Ctx.Provider>
  );
}

export const useOrder = () => useContext(Ctx);

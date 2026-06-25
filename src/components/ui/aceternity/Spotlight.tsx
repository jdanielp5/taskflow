"use client";

import { motion } from "framer-motion";

export function Spotlight() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute -left-40 -top-32 h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1 }}
    />
  );
}

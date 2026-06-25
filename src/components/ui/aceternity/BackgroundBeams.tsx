"use client";

import { motion } from "framer-motion";

export function BackgroundBeams() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {[0, 1, 2, 3].map((beam) => (
        <motion.span
          key={beam}
          className="absolute top-0 h-px w-72 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          style={{ left: `${beam * 26 - 5}%`, rotate: `${28 + beam * 8}deg` }}
          animate={{ y: [0, 720], opacity: [0, 0.9, 0] }}
          transition={{ duration: 5 + beam, repeat: Infinity, delay: beam * 0.7, ease: "linear" }}
        />
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  className?: string;
  variant?: "fade" | "blur" | "scale" | "flip";
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  duration = 0.8,
  className = "",
  variant = "fade", // Rendu cohérent et sobre par défaut
}: FadeInProps) {
  const directions = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 },
    none: { x: 0, y: 0 },
  };

  const variants = {
    fade: {
      initial: { opacity: 0, ...directions[direction] },
      whileInView: { opacity: 1, x: 0, y: 0 },
    },
    blur: {
      initial: { opacity: 0, filter: "blur(12px)", ...directions[direction] },
      whileInView: { opacity: 1, filter: "blur(0px)", x: 0, y: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.9, ...directions[direction] },
      whileInView: { opacity: 1, scale: 1, x: 0, y: 0 },
    },
    flip: {
      initial: { opacity: 0, rotateX: -20, ...directions[direction] },
      whileInView: { opacity: 1, rotateX: 0, x: 0, y: 0 },
    }
  };

  return (
    <motion.div
      initial={variants[variant].initial}
      whileInView={variants[variant].whileInView}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Transition très fluide (Apple-like)
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

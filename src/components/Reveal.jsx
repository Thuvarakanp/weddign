import { motion } from "framer-motion";
import { GOLD, SPRING_EASE } from "../tokens.js";

const viewport = { once: true, amount: 0.22 };

// Scroll-triggered rise-and-fade-in, used for most headings/paragraphs.
export function Rise({ children, delay = 0, y = 36, duration = 1.4, style = {}, as = "div", ...props }) {
  const Tag = motion[as];
  return (
    <Tag
      {...props}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, ease: SPRING_EASE, delay }}
      style={{ willChange: "opacity, transform", ...style }}
    >
      {children}
    </Tag>
  );
}

// Clip-path "ink wash" reveal for standalone script text (e.g. the closing signature).
export function InkReveal({ children, delay = 0 }) {
  return (
    <motion.span
      initial={{ clipPath: "inset(-20% 105% -30% -5%)", opacity: 0 }}
      whileInView={{ clipPath: "inset(-20% -5% -30% -5%)", opacity: 1 }}
      viewport={viewport}
      transition={{
        clipPath: { duration: 2.2, ease: SPRING_EASE, delay },
        opacity: { duration: 0.6, delay },
      }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}

// A thin gold divider that grows in from the center on scroll.
export function GrowRule({ delay = 0, vertical = false, style = {} }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: 1.8, ease: SPRING_EASE, delay }}
      style={{
        background: vertical
          ? `linear-gradient(180deg, transparent, ${GOLD}, transparent)`
          : `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        ...style,
      }}
    />
  );
}

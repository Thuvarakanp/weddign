import { motion } from "framer-motion";
import { INK, SPRING_EASE, script, lede } from "../tokens.js";
import { Rise } from "../components/Reveal.jsx";

function Flourish({ delay = 0 }) {
  return (
    <svg viewBox="0 0 300 30" style={{ width: 200, display: "block", margin: "0 auto 72px" }} aria-hidden="true">
      <motion.path
        d="M10 15 C 60 2, 90 28, 150 15 S 240 2, 290 15"
        fill="none"
        stroke={INK}
        strokeWidth="1.6"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.22 }}
        transition={{ duration: 2.4, ease: SPRING_EASE, delay }}
      />
    </svg>
  );
}

export function Message() {
  return (
    <section style={{ padding: "180px 28px", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Flourish />
      <Rise as="h2" delay={0.15} style={{ ...script, fontSize: "clamp(38px, 7.5vw, 54px)", margin: "0 0 44px" }}>
        Two hearts, one promise
      </Rise>
      <Rise as="p" delay={0.35} style={{ ...lede, margin: "0 auto" }}>
        With the blessings of our families, we begin the journey toward
        forever. Join us for an evening of joy as we exchange rings and
        celebrate this beautiful new chapter together.
      </Rise>
    </section>
  );
}

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { GOLD, INK, SPRING_EASE, eyebrow, script } from "../tokens.js";
import { usePrefersReducedMotion } from "../hooks.js";

// 150ms buffer so the entrance cascade begins just as the Seal starts
// dissolving, rather than the instant `started` flips.
const BASE = 0.15;
const cascade = (delay) => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.6, ease: SPRING_EASE, delay: delay + BASE } },
});

export function Hero({ started }) {
  const reduced = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.5 });
  const springY = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.5 });

  const monogramX = useTransform(springX, (v) => v * 12);
  const monogramY = useTransform(springY, (v) => v * 8);
  const titleX = useTransform(springX, (v) => v * -8);
  const titleY = useTransform(springY, (v) => v * -5);

  const onMove = (e) => {
    if (reduced) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    rawX.set((e.clientX - cx) / cx);
    rawY.set((e.clientY - cy) / cy);
  };

  return (
    <motion.header
      onMouseMove={onMove}
      initial="hidden"
      animate={started ? "visible" : "hidden"}
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "120px 28px 100px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <motion.div style={{ x: monogramX, y: monogramY }}>
        <motion.img
          src="/monogram.png"
          width={340}
          height={228}
          alt="N and S monogram with engagement rings"
          fetchPriority="high"
          variants={{
            hidden: { opacity: 0, scale: 0.92 },
            visible: { opacity: 1, scale: 1, transition: { duration: 2.2, ease: SPRING_EASE, delay: 0.2 + BASE } },
          }}
          style={{ width: "min(340px, 68vw)", height: "auto", marginBottom: 56 }}
        />
      </motion.div>

      <motion.p variants={cascade(0.9)} style={{ ...eyebrow, margin: 0 }}>
        We warmly invite you to celebrate
        <br />
        the engagement of
      </motion.p>

      <motion.div style={{ x: titleX, y: titleY }}>
        <motion.h1
          variants={cascade(1.3)}
          style={{ ...script, fontSize: "clamp(52px, 11vw, 96px)", lineHeight: 1.08, margin: "48px 0 0" }}
        >
          Nirosan{" "}
          <span style={{ color: GOLD, fontSize: "0.6em", verticalAlign: "middle", padding: "0 0.1em" }}>&amp;</span>{" "}
          Sajitha
        </motion.h1>
      </motion.div>

      <motion.div
        variants={cascade(1.8)}
        style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}
      >
        <div style={{ width: 1, height: 48, background: `linear-gradient(180deg, transparent, ${GOLD})` }} />
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 15,
            letterSpacing: "0.38em",
            textIndent: "0.38em",
            textTransform: "uppercase",
            color: INK,
            margin: 0,
          }}
        >
          October 25th, 2026 · 6 PM
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 0.65 : 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 2.6 + BASE }}
        style={{ position: "absolute", bottom: 34, left: "50%", transform: "translateX(-50%)" }}
      >
        <div className="scrollFloat" style={{ ...eyebrow, fontSize: 10.5 }}>
          Scroll
        </div>
      </motion.div>
    </motion.header>
  );
}

import { motion, useScroll } from "framer-motion";
import { GOLD } from "../tokens.js";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: GOLD,
        transformOrigin: "0%",
        scaleX: scrollYProgress,
        zIndex: 60,
      }}
    />
  );
}

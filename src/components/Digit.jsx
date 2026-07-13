import { AnimatePresence, motion } from "framer-motion";
import { GOLD, INK, SPRING_EASE } from "../tokens.js";

const lift = { rest: { y: 0 }, hover: { y: -6 } };
const rule = { rest: { width: 0 }, hover: { width: 44 } };

export function Digit({ value, label }) {
  return (
    <motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={lift}
      transition={{ duration: 0.5, ease: SPRING_EASE }}
      style={{ textAlign: "center", minWidth: "clamp(58px, 14vw, 96px)", cursor: "default" }}
    >
      <div
        style={{
          height: "1em",
          fontSize: "clamp(44px, 9vw, 72px)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: SPRING_EASE }}
            style={{
              display: "block",
              fontFamily: "'Cinzel', serif",
              lineHeight: 1,
              color: INK,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div variants={rule} style={{ height: 1, margin: "16px auto 14px", background: GOLD }} />

      <div
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 11,
          letterSpacing: "0.4em",
          textIndent: "0.4em",
          textTransform: "uppercase",
          color: GOLD,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

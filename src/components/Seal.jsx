import { motion } from "framer-motion";
import { GOLD, INK, SPRING_EASE, eyebrow, script } from "../tokens.js";

// Rendered inside an <AnimatePresence> by the parent, which conditionally
// removes it on open — the `exit` animation then plays automatically while
// the page content underneath begins its own entrance, blending the two.
export function Seal({ onOpen }) {
  return (
    <motion.div
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      role="button"
      tabIndex={0}
      aria-label="Open the invitation"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 1.3, ease: SPRING_EASE, delay: 0.1 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#F5F4FA",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <div
        className="sealPulse"
        style={{
          width: 190,
          height: 190,
          borderRadius: "50%",
          border: `1px solid ${GOLD}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 8,
            borderRadius: "50%",
            border: "1px solid rgba(200,155,75,0.35)",
          }}
        />
        <span style={{ ...script, fontSize: 40, lineHeight: 1, color: INK }}>
          N<span style={{ color: GOLD }}>&amp;</span>S
        </span>
      </div>
      <p style={{ ...eyebrow, marginTop: 52 }}>
        Tap to open
        <br />
        the invitation
      </p>
    </motion.div>
  );
}

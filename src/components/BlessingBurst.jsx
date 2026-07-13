import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { GOLD, SPRING_EASE, eyebrow, goldButton } from "../tokens.js";
import { usePrefersReducedMotion } from "../hooks.js";

export function BlessingBurst() {
  const [bursts, setBursts] = useState([]);
  const [count, setCount] = useState(0);
  const reduced = usePrefersReducedMotion();

  const removeParticle = (burstId, particleId) => {
    setBursts((bs) =>
      bs
        .map((b) => (b.id === burstId ? { ...b, petals: b.petals.filter((p) => p.id !== particleId) } : b))
        .filter((b) => b.petals.length > 0)
    );
  };

  const bless = useCallback(() => {
    setCount((c) => c + 1);
    if (reduced) return;
    const id = Date.now();
    const petals = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      angle: (i / 14) * Math.PI * 2 + Math.random() * 0.4,
      dist: 70 + Math.random() * 90,
      size: 5 + Math.random() * 6,
      heart: Math.random() < 0.35,
      dur: 1.1 + Math.random() * 0.7,
    }));
    setBursts((b) => [...b, { id, petals }]);
  }, [reduced]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {bursts.map((burst) => (
        <div key={burst.id} style={{ position: "absolute", left: "50%", top: "50%", pointerEvents: "none" }}>
          {burst.petals.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: Math.cos(p.angle) * p.dist, y: Math.sin(p.angle) * p.dist - 40, opacity: 0, scale: 0.4 }}
              transition={{ duration: p.dur, ease: SPRING_EASE }}
              onAnimationComplete={() => removeParticle(burst.id, p.id)}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: p.size,
                height: p.size,
                borderRadius: p.heart ? "50% 50% 0 50%" : "50%",
                rotate: p.heart ? 45 : 0,
                background: p.heart ? "#B9536B" : GOLD,
              }}
            />
          ))}
        </div>
      ))}

      <motion.button
        onClick={bless}
        whileHover={{ backgroundColor: GOLD, color: "#fff", y: -3 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.5, ease: SPRING_EASE }}
        style={goldButton}
      >
        Send a blessing ♡
      </motion.button>

      <p
        style={{
          ...eyebrow,
          fontSize: 11,
          marginTop: 26,
          opacity: count > 0 ? 1 : 0,
          transition: "opacity .8s ease",
        }}
      >
        {count === 1 ? "One blessing sent with love" : `${count} blessings sent with love`}
      </p>
    </div>
  );
}

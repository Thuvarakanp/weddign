import { useEffect, useState } from "react";
import { INK } from "../tokens.js";
import { usePrefersReducedMotion } from "../hooks.js";

// Huge faint script watermarks + flourishes that parallax with scroll.
export function Watermarks() {
  const [scrollY, setScrollY] = useState(0);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const mark = (top, left, right, size, char, speed, rot = 0) => (
    <div
      style={{
        position: "absolute",
        top,
        left,
        right,
        fontFamily: "'Playfair Display', serif",
        fontStyle: "italic",
        fontSize: size,
        color: INK,
        opacity: 0.032,
        transform: `translateY(${reduced ? 0 : scrollY * speed}px) rotate(${rot}deg)`,
        userSelect: "none",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
      aria-hidden="true"
    >
      {char}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {mark("6%", "-4%", "auto", "clamp(240px,42vw,520px)", "N", -0.06, -8)}
      {mark("26%", "auto", "-6%", "clamp(240px,42vw,520px)", "S", -0.1, 10)}
      {mark("48%", "-2%", "auto", "clamp(200px,34vw,420px)", "love", -0.05, -14)}
      {mark("68%", "auto", "-4%", "clamp(240px,40vw,500px)", "&", -0.09, 6)}
      {mark("88%", "6%", "auto", "clamp(180px,30vw,380px)", "forever", -0.04, -10)}
    </div>
  );
}

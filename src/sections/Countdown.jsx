import { Digit } from "../components/Digit.jsx";
import { Rise } from "../components/Reveal.jsx";
import { useCountdown } from "../hooks.js";
import { eyebrow } from "../tokens.js";
import { EVENT_START_UTC } from "../config.js";

export function Countdown() {
  const t = useCountdown(EVENT_START_UTC);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <section style={{ padding: "0 28px 180px", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Rise as="p" style={{ ...eyebrow, marginBottom: 72 }}>
        Counting the moments
      </Rise>
      <Rise delay={0.2}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "clamp(20px, 7vw, 72px)",
            flexWrap: "wrap",
          }}
        >
          <Digit value={t.days} label="Days" />
          <Digit value={pad(t.hours)} label="Hours" />
          <Digit value={pad(t.mins)} label="Minutes" />
          <Digit value={pad(t.secs)} label="Seconds" />
        </div>
      </Rise>
    </section>
  );
}

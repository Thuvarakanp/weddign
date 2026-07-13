import { GOLD, INK, script, lede } from "../tokens.js";
import { BlessingBurst } from "../components/BlessingBurst.jsx";
import { GrowRule, InkReveal, Rise } from "../components/Reveal.jsx";

export function Closing() {
  return (
    <section style={{ padding: "180px 28px 200px", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Rise as="h2" style={{ ...script, fontSize: "clamp(34px, 7vw, 48px)", margin: "0 0 44px" }}>
        Your presence is our joy
      </Rise>
      <Rise as="p" delay={0.2} style={{ ...lede }}>
        We would be honoured to have you with us as we celebrate this
        milestone surrounded by the people we love most.
      </Rise>

      <Rise delay={0.4} style={{ marginTop: 72 }}>
        <BlessingBurst />
      </Rise>

      <div style={{ marginTop: 110 }}>
        <InkReveal delay={0.3}>
          <span style={{ ...script, fontSize: "clamp(36px, 7.5vw, 52px)" }}>Nirosan &amp; Sajitha</span>
        </InkReveal>
      </div>

      <Rise delay={0.9} style={{ marginTop: 40 }}>
        <GrowRule delay={0.9} style={{ width: 120, height: 1, margin: "0 auto 28px" }} />
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 13,
            letterSpacing: "0.6em",
            textIndent: "0.6em",
            textTransform: "uppercase",
            color: GOLD,
          }}
        >
          N <span style={{ color: INK, opacity: 0.45 }}>&middot;</span> S
        </span>
      </Rise>
    </section>
  );
}

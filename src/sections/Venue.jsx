import { GOLD, INK, eyebrow, goldButton, lede, script } from "../tokens.js";
import { Rise, GrowRule } from "../components/Reveal.jsx";
import { DIRECTIONS_URL, HALL_NAME, MAP_EMBED_URL, VENUE_ADDRESS, VENUE_NAME } from "../config.js";

export function Venue() {
  return (
    <section
      style={{
        background: "rgba(238,235,245,0.82)",
        padding: "140px 28px",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
      }}
    >
      <GrowRule style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 }} />
      <Rise as="h2" style={{ ...script, fontSize: "clamp(38px, 7.5vw, 54px)", margin: "0 0 44px" }}>
        Join us here
      </Rise>
      <Rise delay={0.15}>
        <p style={{ ...eyebrow, color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 14 }}>{HALL_NAME}</p>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: 21, lineHeight: 1.9, color: INK, margin: "8px 0 0" }}>{VENUE_NAME}</p>
        <p style={{ ...lede, fontSize: 16.5, marginTop: 10 }}>{VENUE_ADDRESS}</p>
      </Rise>
      <Rise delay={0.3} style={{ maxWidth: 720, margin: "56px auto 48px" }}>
        <iframe
          title={`Map showing ${VENUE_NAME} in Markham, Ontario`}
          src={MAP_EMBED_URL}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ width: "100%", height: 360, border: `1px solid ${GOLD}`, borderRadius: 6, display: "block" }}
        />
      </Rise>
      <Rise delay={0.4}>
        <a href={DIRECTIONS_URL} target="_blank" rel="noreferrer" style={{ ...goldButton, fontSize: 13, padding: "16px 30px" }}>
          Open in Google Maps
        </a>
      </Rise>
    </section>
  );
}

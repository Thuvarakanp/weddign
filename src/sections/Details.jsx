import { motion } from "framer-motion";
import { GOLD, INK, SPRING_EASE, eyebrow, goldButton, lede, script } from "../tokens.js";
import { Rise, GrowRule } from "../components/Reveal.jsx";
import { RSVP_FORM_URL, DIRECTIONS_URL, ADD_TO_CALENDAR_URL } from "../config.js";

const actionButton = { ...goldButton, fontSize: 13, padding: "16px 30px" };

function ActionLink({ href, children }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      whileHover={{ backgroundColor: GOLD, color: "#fff", y: -3 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.5, ease: SPRING_EASE }}
      style={actionButton}
    >
      {children}
    </motion.a>
  );
}

export function Details() {
  return (
    <section
      style={{
        background: "rgba(238,235,245,0.82)",
        backdropFilter: "blur(2px)",
        padding: "160px 28px",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
      }}
    >
      <GrowRule style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1 }} />
      <GrowRule delay={0.2} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1 }} />

      <Rise as="h2" style={{ ...script, fontSize: "clamp(38px, 7.5vw, 54px)", margin: "0 0 88px" }}>
        The evening
      </Rise>

      <div
        className="detailGrid"
        style={{ display: "grid", gridTemplateColumns: "1fr", gap: 80, maxWidth: 720, margin: "0 auto" }}
      >
        <Rise delay={0.15}>
          <h3 style={{ ...eyebrow, color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 14, marginBottom: 28 }}>
            When
          </h3>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 21, lineHeight: 1.9, color: INK, margin: 0 }}>
            Sunday
            <br />
            October 25th, 2026
          </p>
          <p style={{ ...lede, fontSize: 16.5, marginTop: 18 }}>The ceremony begins at 6 o&rsquo;clock in the evening</p>
        </Rise>

        <Rise delay={0.3}>
          <h3 style={{ ...eyebrow, color: GOLD, fontFamily: "'Cinzel', serif", fontSize: 14, marginBottom: 28 }}>
            Where
          </h3>
          <p style={{ fontFamily: "'Cinzel', serif", fontSize: 21, lineHeight: 1.9, color: INK, margin: 0 }}>
            J &amp; J Swagat
            <br />
            Convention Center
          </p>
          <p style={{ ...lede, fontSize: 16.5, marginTop: 18 }}>Dinner &amp; celebrations to follow</p>
        </Rise>
      </div>

      <Rise
        delay={0.45}
        style={{ marginTop: 96, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}
        className="actionRow"
      >
        <ActionLink href={RSVP_FORM_URL}>RSVP</ActionLink>
        <ActionLink href={DIRECTIONS_URL}>Get Directions</ActionLink>
        <ActionLink href={ADD_TO_CALENDAR_URL}>Add to Calendar</ActionLink>
      </Rise>
    </section>
  );
}

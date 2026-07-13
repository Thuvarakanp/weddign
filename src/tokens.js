export const SPRING = "cubic-bezier(0.22, 1, 0.36, 1)";
// Same curve as SPRING, expressed as the array form Framer Motion's `ease` expects.
export const SPRING_EASE = [0.22, 1, 0.36, 1];
export const GOLD = "#C89B4B";
export const INK = "#1C1B22";

export const eyebrow = {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  fontSize: 13.5,
  letterSpacing: "0.42em",
  textIndent: "0.45em",
  textTransform: "uppercase",
  color: "#6A6675",
  lineHeight: 2.4,
};

export const script = {
  fontFamily: "'Playfair Display', serif",
  fontStyle: "italic",
  fontWeight: 500,
  letterSpacing: "0.01em",
  color: INK,
};

export const lede = {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  fontSize: 19.5,
  lineHeight: 1.95,
  letterSpacing: "0.03em",
  color: "#55525E",
  maxWidth: 460,
  margin: "0 auto",
};

// Shared gold-outline button treatment (RSVP / Directions / Add to Calendar / Blessing).
export const goldButton = {
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  fontSize: 15,
  letterSpacing: "0.32em",
  textIndent: "0.35em",
  textTransform: "uppercase",
  color: INK,
  background: "transparent",
  border: `1px solid ${GOLD}`,
  borderRadius: 999,
  padding: "20px 44px",
  cursor: "pointer",
  textDecoration: "none",
  display: "inline-block",
};

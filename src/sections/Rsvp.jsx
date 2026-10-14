import { useState } from "react";
import { GOLD, INK, eyebrow, goldButton, lede, script } from "../tokens.js";
import { Rise } from "../components/Reveal.jsx";
import { RSVP_CONTACT, RSVP_DISPLAY_PHONE, RSVP_PHONE } from "../config.js";

const field = {
  width: "100%",
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: 18,
  color: INK,
  background: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(200,155,75,0.6)",
  borderRadius: 6,
  padding: "14px 16px",
  marginTop: 8,
};
const label = { ...eyebrow, display: "block", textAlign: "left", textIndent: 0, fontSize: 12.5, lineHeight: 1.6 };
const EVENT_DATE = "October 25, 2026";

export function Rsvp() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const isIOS =
    typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  const prepare = (e) => {
    e.preventDefault();
    const who = name.trim();
    if (!who) return;
    let m = `Hi ${RSVP_CONTACT}, this is ${who}.\n\n`;
    m +=
      attending === "yes"
        ? `I’m happy to attend your engagement celebration on ${EVENT_DATE}.\nNumber of guests (including me): ${guests}.`
        : `Thank you for the invitation. Unfortunately, I’m unable to attend your engagement celebration on ${EVENT_DATE}.`;
    if (note.trim()) m += `\n\n${note.trim()}`;
    setMessage(m);
    setStatus("Your message is ready. It has not been sent yet.");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setStatus(`Message copied. Send it to ${RSVP_DISPLAY_PHONE} to confirm your RSVP.`);
    } catch {
      setStatus(`Copy was unavailable. Select the message above and send it to ${RSVP_DISPLAY_PHONE}.`);
    }
  };

  // Any edit invalidates the prepared message.
  const reset = () => {
    setMessage("");
    setStatus("");
  };

  return (
    <section id="rsvp" style={{ padding: "140px 28px", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Rise as="h2" style={{ ...script, fontSize: "clamp(38px, 7.5vw, 54px)", margin: "0 0 28px" }}>
        Will you join us?
      </Rise>
      <Rise as="p" delay={0.2} style={{ ...lede, margin: "0 auto 12px" }}>
        We would love to share this evening with you. Let us know if you can make it.
      </Rise>
      <Rise delay={0.25} style={{ marginBottom: 56 }}>
        <p style={{ ...eyebrow }}>RSVP to {RSVP_CONTACT}</p>
        <a href={`tel:${RSVP_PHONE}`} style={{ fontFamily: "'Cinzel', serif", color: GOLD, fontSize: 18, textDecoration: "none", letterSpacing: "0.1em" }}>
          {RSVP_DISPLAY_PHONE}
        </a>
      </Rise>

      <Rise delay={0.35}>
        <form onSubmit={prepare} onChange={reset} style={{ maxWidth: 480, margin: "0 auto", display: "grid", gap: 26 }}>
          <label style={label}>
            Your name *
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} autoComplete="name" placeholder="First and last name" style={field} />
          </label>

          <fieldset style={{ border: "none", display: "grid", gap: 10, textAlign: "left" }}>
            <legend style={label}>Will you be attending? *</legend>
            {[
              ["yes", "Joyfully accepts"],
              ["no", "Regretfully declines"],
            ].map(([v, t]) => (
              <label key={v} style={{ ...lede, fontSize: 18, textAlign: "left", margin: 0, cursor: "pointer" }}>
                <input type="radio" name="attendance" value={v} checked={attending === v} onChange={() => setAttending(v)} style={{ accentColor: GOLD, marginRight: 10 }} />
                {t}
              </label>
            ))}
          </fieldset>

          {attending === "yes" && (
            <label style={label}>
              Number of guests (including yourself) *
              <input type="number" min={1} max={99} step={1} value={guests} onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))} required style={field} />
            </label>
          )}

          <label style={label}>
            A little note (optional)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} maxLength={1000} placeholder="Leave us a message…" style={{ ...field, resize: "vertical" }} />
          </label>

          <button type="submit" style={{ ...goldButton, justifySelf: "center" }}>
            Prepare RSVP message
          </button>
          <p style={{ ...lede, fontSize: 15, margin: 0 }}>
            Your reply is prepared as a text message to {RSVP_CONTACT}. Please send it in your messaging app to confirm. Nothing is sent or stored by this website.
          </p>
        </form>
      </Rise>

      <div role="status" aria-live="polite" style={{ ...lede, fontSize: 16, marginTop: 28 }}>
        {status}
      </div>

      {message && (
        <div style={{ maxWidth: 480, margin: "24px auto 0", padding: 24, border: `1px solid ${GOLD}`, borderRadius: 6, background: "rgba(255,255,255,0.6)" }}>
          <p style={{ ...eyebrow }}>Your message is ready</p>
          <p style={{ ...lede, fontSize: 17, whiteSpace: "pre-wrap", textAlign: "left", margin: "12px 0 24px" }}>{message}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href={`sms:${RSVP_PHONE}${isIOS ? "&" : "?"}body=${encodeURIComponent(message)}`} style={{ ...goldButton, fontSize: 13, padding: "16px 30px" }}>
              Open text message
            </a>
            <button type="button" onClick={copy} style={{ ...goldButton, fontSize: 13, padding: "16px 30px" }}>
              Copy message
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

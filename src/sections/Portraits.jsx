import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GOLD, INK, SPRING_EASE, eyebrow, script, lede } from "../tokens.js";
import { Rise } from "../components/Reveal.jsx";

const PHOTOS = [
  { src: "/photos/beginning.webp", w: 937, h: 1678, caption: "A beautiful beginning", alt: "Nirosan and Sajitha smiling together beside sunlit windows" },
  { src: "/photos/floral.webp", w: 1086, h: 1448, caption: "Our next chapter, together", alt: "Nirosan and Sajitha holding hands beneath an elegant floral arrangement" },
  { src: "/photos/couple.webp", w: 1000, h: 1333, caption: "The start of our forever", alt: "Nirosan and Sajitha standing together in navy and silver engagement attire" },
];

const navBtn = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: `1px solid ${GOLD}`,
  color: "#fff",
  width: 48,
  height: 48,
  borderRadius: 999,
  fontSize: 20,
  cursor: "pointer",
};

function Lightbox({ index, onClose, onStep }) {
  const photo = PHOTOS[index];
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onStep(-1);
      if (e.key === "ArrowRight") onStep(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: SPRING_EASE }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(20,19,26,0.94)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 20px 28px",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "#fff", fontSize: 30, cursor: "pointer", padding: 10 }}
      >
        &times;
      </button>
      <img
        key={photo.src}
        src={photo.src}
        alt={photo.alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "78vh", objectFit: "contain", borderRadius: 4 }}
      />
      <p style={{ ...eyebrow, color: "#E8E4F0", marginTop: 20 }}>
        {photo.caption} &middot; {index + 1} / {PHOTOS.length}
      </p>
      <button type="button" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); onStep(-1); }} style={{ ...navBtn, left: 12 }}>&larr;</button>
      <button type="button" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); onStep(1); }} style={{ ...navBtn, right: 12 }}>&rarr;</button>
    </motion.div>
  );
}

export function Portraits() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + PHOTOS.length) % PHOTOS.length)), []);

  return (
    <section style={{ padding: "140px 28px", textAlign: "center", position: "relative", zIndex: 2 }}>
      <Rise as="h2" style={{ ...script, fontSize: "clamp(38px, 7.5vw, 54px)", margin: "0 0 28px" }}>
        Our next chapter
      </Rise>
      <Rise as="p" delay={0.2} style={{ ...lede, margin: "0 auto 80px" }}>
        A moment to treasure. A lifetime to look forward to.
      </Rise>

      <div style={{ display: "flex", flexDirection: "column", gap: 72, alignItems: "center" }}>
        {PHOTOS.map((p, i) => (
          <Rise key={p.src} delay={0.1}>
            <motion.button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photo: ${p.caption}`}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.6, ease: SPRING_EASE }}
              style={{ background: "none", border: "none", cursor: "zoom-in", padding: 0, display: "block" }}
            >
              <img
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                loading="lazy"
                style={{
                  width: "min(86vw, 400px)",
                  height: "auto",
                  display: "block",
                  borderRadius: "200px 200px 6px 6px",
                  border: `1px solid ${GOLD}`,
                  padding: 8,
                  background: "#fff",
                  boxShadow: "0 24px 60px -30px rgba(60,50,90,0.35)",
                }}
              />
            </motion.button>
            <p style={{ ...eyebrow, marginTop: 22, color: INK }}>{p.caption}</p>
          </Rise>
        ))}
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  );
}

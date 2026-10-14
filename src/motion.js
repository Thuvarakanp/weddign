// Framer Motion layer for the invitation. Enhances the static markup; if this
// module fails to load, the inline fallback in index.html restores the CSS motion.
import { animate, inView, scroll, stagger } from "framer-motion/dom";

const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 320, damping: 22, mass: 0.6 };
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Honours both the OS setting and the page's own "Motion on/off" toggle.
const motionOn = () => !reduced.matches && !root.classList.contains("motion-paused");

root.classList.add("fm-ready");

// ---- Opening gate: click the wax seal to reveal the invitation -------------
const opened = window.invitationOpened || Promise.resolve();
const gate = document.querySelector("#gate");
const seal = document.querySelector("#gate-seal");
if (gate && seal) {
  const lock = () => (root.style.overflow = "hidden");
  lock();
  const body = gate.querySelector(".gate-body");
  animate(body.children, { opacity: [0, 1], y: [24, 0] }, { duration: 1.2, ease: EASE, delay: stagger(0.18, { startDelay: 0.2 }) });
  animate(seal, { scale: [0.7, 1] }, { type: "spring", stiffness: 120, damping: 12, delay: 0.35 });
  let done = false;
  const open = async () => {
    if (done) return;
    done = true;
    seal.disabled = true;
    if (motionOn()) {
      await animate(seal, { scale: [1, 0.88, 1.5], rotate: [0, -8, 24], opacity: [1, 1, 0] }, { duration: 1.3, ease: [0.45, 0, 0.2, 1] }).finished;
      animate(body, { opacity: 0, scale: 0.94 }, { duration: 0.8, ease: [0.4, 0, 0.2, 1] });
      animate(gate.querySelectorAll(".gate-edge"), { opacity: 0 }, { duration: 0.8, ease: [0.4, 0, 0.2, 1] });
      const seam = gate.querySelector(".gate-seam");
      const doorEase = [0.55, 0.05, 0.2, 1];
      const mainEl = document.querySelector("#main");
      animate(seam, { opacity: [0, 1, 0], scaleX: [0.2, 1, 1.6] }, { duration: 1.4, ease: "easeOut", times: [0, 0.45, 1] });
      mainEl && animate(mainEl, { scale: [1.12, 1], opacity: [0.4, 1] }, { duration: 3.2, ease: [0.25, 0.1, 0.1, 1] }).finished.then(() => (mainEl.style.scale = mainEl.style.opacity = ""));
      // Let the hero text start rising while the doors are still clearing.
      setTimeout(() => window.__openInvitation && window.__openInvitation(), 1700);
      await Promise.all([
        animate(gate.querySelector(".gate-l"), { rotateY: [0, -104], filter: ["brightness(1)", "brightness(0.55)"] }, { duration: 2.8, ease: doorEase, delay: 0.25 }).finished,
        animate(gate.querySelector(".gate-r"), { rotateY: [0, 104], filter: ["brightness(1)", "brightness(0.55)"] }, { duration: 2.8, ease: doorEase, delay: 0.25 }).finished,
      ]);
    }
    gate.remove();
    root.style.overflow = "";
    root.classList.remove("gated");
    window.__openInvitation && window.__openInvitation();
    window.scrollTo(0, 0);
  };
  seal.addEventListener("click", open);
  seal.focus({ preventScroll: true });
}

// ---- Hero entrance: staggered rise once the invitation is opened -----------
const entrance = $$(".entrance");
opened.then(() => {
  if (motionOn()) {
    animate(
      entrance,
      { opacity: [0, 1], y: [34, 0], filter: ["blur(6px)", "blur(0px)"] },
      { duration: 1.3, ease: EASE, delay: stagger(0.13, { startDelay: 0.25 }) }
    );
  } else {
    for (const el of entrance) el.style.opacity = 1;
  }
});

// ---- Scroll reveals ---------------------------------------------------------
// One system for the whole page. Each block rises (or slides in from its side),
// headings reveal word by word through a mask, images unveil with a clip, and
// the block's children follow in a stagger.
const SLIDE = {
  ".portrait-wrap": -70, ".venue-copy": -70, ".rsvp-copy": -70, ".portrait-heading": -70,
  ".invitation-copy": 70, ".map-wrap": 70, ".rsvp-form": 70, ".featured": 70,
};
const GROUPS = ".detail-grid article, .countdown > div, .rsvp-form > *";
const CHILDREN = ".invitation-copy, .venue-copy, .rsvp-copy, .portrait-heading, .center, .countdown-wrap, footer";

function splitWords(node, words) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === 3) {
      const frag = document.createDocumentFragment();
      for (const part of child.textContent.split(/(\s+)/)) {
        if (!part.trim()) {
          if (part) frag.append(" ");
          continue;
        }
        const outer = document.createElement("span");
        outer.className = "fx-word";
        const inner = document.createElement("span");
        inner.textContent = part;
        inner.style.transform = "translateY(115%)";
        outer.append(inner);
        words.push(inner);
        frag.append(outer);
      }
      child.replaceWith(frag);
    } else if (child.nodeType === 1 && child.tagName !== "BR") splitWords(child, words);
  }
}

const blocks = [...$$(".reveal"), ...$$("footer")];
for (const el of blocks) {
  el.classList.remove("is-waiting", "is-visible");
  const slideX = Object.entries(SLIDE).find(([sel]) => el.matches(sel))?.[1] ?? 0;

  const words = [];
  for (const h of $$("h2", el)) {
    h.setAttribute("aria-label", h.textContent.replace(/\s+/g, " ").trim());
    splitWords(h, words);
    for (const w of h.querySelectorAll(".fx-word")) w.setAttribute("aria-hidden", "true");
  }
  const media = $$("img[loading], .map-wrap iframe", el);
  const kids = el.matches(CHILDREN) ? $$(":scope > *:not(h2)", el) : [];
  const groups = $$(GROUPS, el);

  const inViewport = el.getBoundingClientRect().top < innerHeight * 0.92 && scrollY === 0;
  const hide = () => {
    el.style.opacity = 0;
    if (slideX) el.style.transform = `translateX(${slideX}px)`;
    for (const k of kids) k.style.opacity = 0;
    for (const g of groups) g.style.opacity = 0;
    for (const i of media) i.style.clipPath = "inset(100% 0 0 0)";
  };
  const clear = () => {
    el.style.opacity = el.style.transform = "";
    for (const k of [...kids, ...groups]) k.style.opacity = k.style.transform = "";
    for (const i of media) i.style.clipPath = "";
    for (const w of words) w.style.transform = "";
  };
  if (!inViewport) hide();

  inView(
    el,
    () => {
      if (!motionOn()) return clear();
      if (!el.style.opacity) el.style.opacity = 0; // blocks already on screen at load
      animate(el, { opacity: 1, x: [slideX || 0, 0], y: slideX ? [0, 0] : [36, 0] }, { duration: 1.3, ease: EASE }).finished.then(clear);
      if (words.length) animate(words, { y: ["115%", "0%"] }, { duration: 1.1, ease: EASE, delay: stagger(0.07, { startDelay: 0.1 }) });
      if (media.length) animate(media, { clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"], scale: [1.15, 1] }, { duration: 1.6, ease: [0.77, 0, 0.18, 1], delay: 0.15 });
      const follow = [...kids, ...groups];
      if (follow.length) animate(follow, { opacity: [0, 1], y: [28, 0] }, { duration: 0.95, ease: EASE, delay: stagger(0.09, { startDelay: 0.3 }) });
    },
    { amount: 0.15 }
  );
}

// ---- Scroll-linked depth on the hero -------------------------------------
const hero = document.querySelector(".hero");
const art = document.querySelector(".hero-art");
const copy = document.querySelector(".hero-copy");
const branch = document.querySelector(".hero-branch");
if (hero && art && copy) {
  scroll(
    (p) => {
      if (!motionOn() || innerWidth < 720) {
        art.style.translate = copy.style.translate = "";
        copy.style.opacity = "";
        return;
      }
      art.style.translate = `0 ${p * 70}px`;
      copy.style.translate = `0 ${p * -40}px`;
      copy.style.opacity = String(1 - p * 1.1);
      if (branch) branch.style.rotate = `${p * 6}deg`;
    },
    { target: hero, offset: ["start start", "end start"] }
  );
}

// ---- Photo frames: slow zoom as they cross the viewport --------------------
for (const img of $$(".portrait-wrap img, .featured img")) {
  scroll(
    (p) => {
      img.style.scale = motionOn() ? String(1.1 - p * 0.1) : "";
    },
    { target: img, offset: ["start end", "end start"] }
  );
}

// ---- Springy hover / press on buttons and links ----------------------------
const interactive = ".button, .nav-rsvp, .motion-toggle, .photo-open, .gallery-launch";
for (const el of $$(interactive)) {
  el.style.transition = "background .3s, color .3s, border-color .3s, box-shadow .3s";
  const to = (target) => motionOn() && animate(el, target, SPRING);
  el.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && to({ y: -3, scale: 1.02 }));
  el.addEventListener("pointerleave", () => to({ y: 0, scale: 1 }));
  el.addEventListener("pointerdown", () => to({ scale: 0.95 }));
  el.addEventListener("pointerup", () => to({ scale: 1 }));
  el.addEventListener("pointercancel", () => to({ scale: 1 }));
}

// ---- Countdown digits: spring in when a value changes ---------------------
for (const digit of $$("#countdown div > span")) {
  new MutationObserver(() => {
    if (motionOn()) animate(digit, { y: [14, 0], opacity: [0.2, 1] }, { type: "spring", stiffness: 240, damping: 20 });
  }).observe(digit, { childList: true, characterData: true, subtree: true });
}

// ---- Gallery dialog: open and image transitions ----------------------------
const dialog = document.querySelector("#gallery-dialog");
const stageImg = document.querySelector("#gallery-image");
if (dialog) {
  new MutationObserver(() => {
    if (dialog.open && motionOn()) animate(dialog, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.5, ease: EASE });
  }).observe(dialog, { attributes: true, attributeFilter: ["open"] });
}
if (stageImg) {
  new MutationObserver(() => {
    if (motionOn()) animate(stageImg, { opacity: [0, 1], scale: [0.94, 1], x: [24, 0] }, { duration: 0.6, ease: EASE });
  }).observe(stageImg, { attributes: true, attributeFilter: ["src"] });
}

// ---- RSVP preview card: pop in when the message is prepared ----------------
const preview = document.querySelector("#message-preview");
if (preview) {
  new MutationObserver(() => {
    if (!preview.hidden && motionOn()) animate(preview, { opacity: [0, 1], y: [20, 0], scale: [0.97, 1] }, { type: "spring", stiffness: 180, damping: 20 });
  }).observe(preview, { attributes: true, attributeFilter: ["hidden"] });
}

// ---- Blessing burst: gold petals, stars and hearts from the button ---------
const bless = document.querySelector("#bless");
const blessNote = document.querySelector("#bless-note");
const wishes = [
  "Thank you — your blessings mean the world to us.",
  "May your kindness find its way back to you.",
  "We feel the love. See you on the 25th!",
  "Every blessing makes our beginning brighter.",
];
let blessCount = 0;
if (bless) {
  bless.addEventListener("click", () => {
    blessNote.textContent = wishes[blessCount++ % wishes.length];
    if (!motionOn()) return;
    animate(blessNote, { opacity: [0, 1], y: [10, 0] }, { duration: 0.7, ease: EASE });
    const box = bless.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const glyphs = ["✦", "✧", "♡", "❀", "✿"];
    const count = innerWidth < 720 ? 22 : 36;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "bless-particle";
      p.textContent = glyphs[i % glyphs.length];
      p.style.fontSize = `${12 + Math.random() * 18}px`;
      p.style.opacity = 0;
      document.body.append(p);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
      const dist = 110 + Math.random() * 190;
      const x = cx + Math.cos(angle) * dist;
      const up = cy + Math.sin(angle) * dist;
      const fall = up + 120 + Math.random() * 160;
      animate(
        p,
        {
          x: [cx, x, x + (Math.random() - 0.5) * 80],
          y: [cy, up, fall],
          rotate: [0, (Math.random() - 0.5) * 540],
          scale: [0.3, 1, 0.7],
          opacity: [0, 1, 0],
        },
        { duration: 1.9 + Math.random() * 0.9, ease: "easeOut", times: [0, 0.4, 1] }
      ).finished.then(() => p.remove());
    }
    animate(bless, { scale: [1, 1.12, 1] }, { duration: 0.5, ease: EASE });
  });
}

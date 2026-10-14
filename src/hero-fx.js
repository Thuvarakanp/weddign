// Hero showpiece: 3D letter flip-in with cursor repel, gold dust that reacts to the
// pointer, a gold spotlight, and a tilting photo with layered depth.
import { animate, stagger } from "framer-motion/dom";

const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const root = document.documentElement;
const motionOn = () => !reduced.matches && !root.classList.contains("motion-paused");
const fine = matchMedia("(pointer: fine)").matches;
const EASE = [0.22, 1, 0.36, 1];

const hero = document.querySelector(".hero");
const title = document.querySelector("#hero-title");
const art = document.querySelector(".hero-art");
if (hero && title && !reduced.matches) {

  // ---- 1. Split the names into letters --------------------------------------
  title.setAttribute("aria-label", (window.EVENT ? window.EVENT.names.join(" & ") : "Nirosan & Sajitha"));
  const letters = [];
  const split = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of child.textContent) {
          if (ch === " ") {
            frag.append(" ");
            continue;
          }
          const s = document.createElement("span");
          s.className = "fx-ch";
          s.setAttribute("aria-hidden", "true");
          s.textContent = ch;
          letters.push({ el: s, x: 0, y: 0, tx: 0, ty: 0, r: 0, tr: 0 });
          frag.append(s);
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== "BR") {
        child.setAttribute("aria-hidden", "true");
        letters.push({ el: child, x: 0, y: 0, tx: 0, ty: 0, r: 0, tr: 0, amp: true });
      }
    }
  };
  split(title);

  if (motionOn()) {
    for (const l of letters) l.el.style.opacity = 0;
    (window.invitationOpened || Promise.resolve()).then(() => {
      animate(
        letters.map((l) => l.el),
        { opacity: [0, 1], rotateX: [-95, 0], y: [50, 0], filter: ["blur(8px)", "blur(0px)"] },
        { duration: 1.2, ease: EASE, delay: stagger(0.055, { startDelay: 0.5 }) }
      );
    });
  }

  // ---- 2. Gold dust canvas ----------------------------------------------------
  const canvas = document.createElement("canvas");
  canvas.className = "fx-dust";
  canvas.setAttribute("aria-hidden", "true");
  hero.prepend(canvas);
  const ctx = canvas.getContext("2d");
  const spot = document.createElement("div");
  spot.className = "fx-spot";
  spot.setAttribute("aria-hidden", "true");
  hero.prepend(spot);

  let W = 0, H = 0, dpr = 1;
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.clientWidth;
    H = hero.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener("resize", resize);

  const rnd = (a, b) => a + Math.random() * (b - a);
  const dust = Array.from({ length: innerWidth < 720 ? 36 : 80 }, () => ({
    x: rnd(0, W), y: rnd(0, H), vx: rnd(-0.1, 0.1), vy: rnd(-0.35, -0.08), r: rnd(0.6, 2.2), a: rnd(0.25, 0.9), tw: rnd(0, 6.28),
  }));
  const sparks = [];
  const mouse = { x: -999, y: -999, on: false };
  const emit = (x, y, n, power) => {
    for (let i = 0; i < n; i++) {
      const ang = rnd(0, 6.28), sp = rnd(0.5, 1) * power;
      sparks.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - power * 0.3, life: 1, r: rnd(1, 2.6) });
    }
  };

  let lastEmit = 0;
  hero.addEventListener("pointermove", (e) => {
    const b = hero.getBoundingClientRect();
    mouse.x = e.clientX - b.left;
    mouse.y = e.clientY - b.top;
    mouse.on = true;
    if (fine && e.pointerType === "mouse" && motionOn() && performance.now() - lastEmit > 45) {
      emit(mouse.x, mouse.y, 1, 1.2);
      lastEmit = performance.now();
    }
  });
  hero.addEventListener("pointerleave", () => (mouse.on = false));
  hero.addEventListener("pointerdown", (e) => {
    if (!motionOn() || e.target.closest("a,button")) return;
    const b = hero.getBoundingClientRect();
    emit(e.clientX - b.left, e.clientY - b.top, 28, 4.2);
  });

  // ---- 3. Photo tilt + depth layers -----------------------------------------
  const depth = art
    ? [
        [art.querySelector(".hero-photo"), 22],
        [art.querySelector(".arch-outline"), -10],
        [art.querySelector(".ring-art"), -18],
        [art.querySelector(".gold-glints"), 34],
      ].filter(([el]) => el)
    : [];
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  hero.addEventListener("pointermove", (e) => {
    if (!art || !fine || e.pointerType !== "mouse" || innerWidth < 1000) return;
    const b = art.getBoundingClientRect();
    tilt.tx = Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / (b.width * 0.9)));
    tilt.ty = Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / (b.height * 0.9)));
  });
  hero.addEventListener("pointerleave", () => (tilt.tx = tilt.ty = 0));

  // ---- 4. One shared animation loop ------------------------------------------
  let visible = true;
  new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(hero);
  let t = 0;
  const tick = () => {
    requestAnimationFrame(tick);
    if (!visible || document.hidden) return;
    const on = motionOn();
    ctx.clearRect(0, 0, W, H);
    if (!on) {
      for (const l of letters) l.el.style.translate = l.el.style.rotate = "";
      art && (art.style.transform = "");
      return;
    }
    t += 0.016;

    // spotlight
    if (mouse.on) spot.style.background = `radial-gradient(circle 280px at ${mouse.x}px ${mouse.y}px, #f0cf8c26, transparent 70%)`;
    spot.style.opacity = mouse.on ? 1 : 0;

    // dust
    for (const d of dust) {
      const dx = d.x - mouse.x, dy = d.y - mouse.y, dist = Math.hypot(dx, dy);
      if (mouse.on && dist < 150) {
        const f = (1 - dist / 150) * 0.9;
        d.vx += (dx / dist) * f;
        d.vy += (dy / dist) * f;
      }
      d.vx *= 0.96;
      d.vy = d.vy * 0.96 + (-0.18 - d.vy) * 0.01;
      d.x += d.vx + Math.sin(t + d.tw) * 0.12;
      d.y += d.vy;
      if (d.y < -10) { d.y = H + 10; d.x = rnd(0, W); }
      if (d.x < -10) d.x = W + 10;
      if (d.x > W + 10) d.x = -10;
      const a = d.a * (0.65 + 0.35 * Math.sin(t * 2 + d.tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(240,207,140,${a})`;
      ctx.shadowColor = "rgba(233,191,117,.8)";
      ctx.shadowBlur = d.r * 5;
      ctx.arc(d.x, d.y, d.r, 0, 6.283);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.vy += 0.06;
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.018;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(255,226,160,${s.life})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * s.life, 0, 6.283);
      ctx.fill();
    }

    // letters: repel + tilt away from the cursor, eased back with a spring-ish lerp
    const hb = hero.getBoundingClientRect();
    for (const l of letters) {
      const r = l.el.getBoundingClientRect();
      const cx = r.left + r.width / 2 - hb.left - l.x;
      const cy = r.top + r.height / 2 - hb.top - l.y;
      const dx = cx - mouse.x, dy = cy - mouse.y, dist = Math.hypot(dx, dy) || 1;
      if (mouse.on && fine && dist < 170) {
        const f = (1 - dist / 170) * 46;
        l.tx = (dx / dist) * f;
        l.ty = (dy / dist) * f;
        l.tr = (dx / dist) * (1 - dist / 170) * 24;
      } else l.tx = l.ty = l.tr = 0;
      l.x += (l.tx - l.x) * 0.14;
      l.y += (l.ty - l.y) * 0.14;
      l.r += (l.tr - l.r) * 0.14;
      l.el.style.translate = `${l.x.toFixed(2)}px ${l.y.toFixed(2)}px`;
      l.el.style.rotate = `${l.r.toFixed(2)}deg`;
    }

    // photo tilt + parallax layers
    if (art) {
      tilt.x += (tilt.tx - tilt.x) * 0.08;
      tilt.y += (tilt.ty - tilt.y) * 0.08;
      art.style.transform = `perspective(1100px) rotateY(${(tilt.x * 9).toFixed(2)}deg) rotateX(${(-tilt.y * 7).toFixed(2)}deg)`;
      for (const [el, d] of depth) el.style.translate = `${(tilt.x * d).toFixed(1)}px ${(tilt.y * d * 0.7).toFixed(1)}px`;
    }
  };
  tick();
}

import { useEffect, useRef } from "react";
import { GOLD } from "../tokens.js";
import { usePrefersReducedMotion } from "../hooks.js";

// Gold dust + drifting petals on a full-page canvas. Framer Motion has no
// canvas particle system, so this stays as bespoke rAF-driven code.
export function AmbientCanvas({ active }) {
  const canvasRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || !active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const N = Math.min(46, Math.floor(W / 26));
    const parts = Array.from({ length: N }, () => spawn(true));

    function spawn(anywhere) {
      const petal = Math.random() < 0.28;
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 20,
        r: petal ? 4 + Math.random() * 5 : 0.8 + Math.random() * 1.8,
        petal,
        vy: -(0.12 + Math.random() * 0.3),
        vx: (Math.random() - 0.5) * 0.15,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.004 + Math.random() * 0.008,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.01,
        alpha: 0.14 + Math.random() * 0.3,
      };
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let p of parts) {
        p.sway += p.swaySpeed;
        p.x += p.vx + Math.sin(p.sway) * 0.25;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.y < -30 || p.x < -30 || p.x > W + 30) Object.assign(p, spawn(false));

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        if (p.petal) {
          ctx.rotate(p.rot);
          ctx.fillStyle = GOLD;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = GOLD;
          ctx.beginPath();
          ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced, active]);

  if (reduced) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}
      aria-hidden="true"
    />
  );
}

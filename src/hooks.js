import { useEffect, useState } from "react";

export function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    return {
      days: Math.floor(diff / 864e5),
      hours: Math.floor((diff % 864e5) / 36e5),
      mins: Math.floor((diff % 36e5) / 6e4),
      secs: Math.floor((diff % 6e4) / 1e3),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

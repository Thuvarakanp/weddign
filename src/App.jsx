import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AmbientCanvas } from "./components/AmbientCanvas.jsx";
import { Seal } from "./components/Seal.jsx";
import { ScrollProgress } from "./components/ScrollProgress.jsx";
import { Watermarks } from "./components/Watermarks.jsx";
import { Countdown } from "./sections/Countdown.jsx";
import { Details } from "./sections/Details.jsx";
import { Hero } from "./sections/Hero.jsx";
import { Message } from "./sections/Message.jsx";
import { Closing } from "./sections/Closing.jsx";

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <div
      style={{
        background: "#F5F4FA",
        backgroundImage:
          "radial-gradient(ellipse 90% 50% at 50% -10%, #ffffff 0%, transparent 60%), repeating-linear-gradient(0deg, transparent 0 2px, rgba(120,110,150,0.016) 2px 3px), repeating-linear-gradient(90deg, transparent 0 2px, rgba(120,110,150,0.016) 2px 3px)",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#F5F4FA;}
        button,a{-webkit-tap-highlight-color:transparent;}
        @keyframes scrollFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(7px);}}
        .scrollFloat{animation:scrollFloat 3.2s ease-in-out infinite;}
        @keyframes sealPulse{0%,100%{box-shadow:0 0 0 0 rgba(200,155,75,0.25);}50%{box-shadow:0 0 0 22px rgba(200,155,75,0);}}
        .sealPulse{animation:sealPulse 2.8s ease-in-out infinite;}
        @media (min-width:640px){
          .detailGrid{grid-template-columns:1fr 1fr !important;}
        }
        @media (max-width:520px){
          .actionRow{flex-direction:column;align-items:center;}
          .actionRow a{width:min(100%,310px);}
        }
        @media (prefers-reduced-motion:reduce){
          *{transition:none !important; animation:none !important; scroll-behavior:auto !important;}
        }
      `}</style>

      <ScrollProgress />
      <AnimatePresence>{!opened && <Seal onOpen={() => setOpened(true)} />}</AnimatePresence>
      <Watermarks />
      <AmbientCanvas active={opened} />

      <Hero started={opened} />
      <Message />
      <Countdown />
      <Details />
      <Closing />
    </div>
  );
}

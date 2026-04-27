import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function HeroScene({ base = '/' }) {
  const root = useRef(null);

  useGSAP(
    () => {
      // Title chars animation
      gsap.from('.hero-title', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
      });
      gsap.from('.hero-sub', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.4,
        ease: 'power2.out',
      });
      gsap.from('.hero-cta', {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        delay: 0.8,
        ease: 'back.out(2)',
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative w-full">
      {/* Hero text */}
      <div className="text-center mb-12 relative z-10 px-4">
        <div className="hero-title inline-block mb-4 px-4 py-1 border border-daemon/40 bg-daemon/5 backdrop-blur-sm">
          <span className="font-pixel text-[10px] tracking-[0.3em] text-daemon">FASE 0 · 2026</span>
        </div>
        <h1 className="hero-title font-display text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight text-cream mb-6 leading-[0.95]">
          Tu daemon<br />
          <span className="bg-gradient-to-r from-daemon via-cream to-holodeck bg-clip-text text-transparent neon-cyan">
            nunca duerme
          </span>
        </h1>
        <p className="hero-sub text-lg md:text-xl text-cream/75 max-w-2xl mx-auto mb-10 leading-relaxed">
          Un agente autónomo de IA que vive 24/7 en tu servidor de Minecraft.<br className="hidden md:block" />
          Te acompaña, juega con vos, y genera mundos infinitos en tiempo real.
        </p>
        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            data-modal-trigger
            className="group relative px-8 py-4 font-display text-base tracking-widest uppercase bg-gradient-to-r from-holodeck to-daemon text-navy-deep rounded shadow-[0_0_30px_rgba(255,184,0,0.5)] hover:shadow-[0_0_50px_rgba(0,217,255,0.7)] hover:scale-105 transition-all"
          >
            <span className="relative z-10">🎮 Me sumo a la preventa</span>
          </button>
          <a
            href="#daemon"
            className="px-6 py-4 font-display text-sm tracking-widest uppercase border-2 border-daemon/50 text-daemon hover:bg-daemon/10 hover:border-daemon transition-all rounded"
          >
            Probá el demo ↓
          </a>
        </div>
      </div>
    </div>
  );
}

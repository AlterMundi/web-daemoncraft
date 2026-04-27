import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import MinecraftSkin from './MinecraftSkin.jsx';

gsap.registerPlugin(useGSAP);

export default function HeroScene({ base = '/' }) {
  const root = useRef(null);

  useGSAP(
    () => {
      // Entrance: stagger reveal of skins
      gsap.from('.skin-card', {
        opacity: 0,
        y: 60,
        scale: 0.8,
        duration: 1.2,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      });

      // Floating effect on each skin
      gsap.utils.toArray('.skin-float').forEach((el, i) => {
        gsap.to(el, {
          y: '+=14',
          duration: 2.5 + i * 0.3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });

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

  // Demonios — cada uno único
  const skins = [
    { id: 'inferno', file: 'demon-inferno.png', anim: 'run', speed: 1.1, glow: 'rgba(255, 90, 30, 0.5)', label: 'INFERNO', tag: 'Fuego' },
    { id: 'void', file: 'demon-void.png', anim: 'walk', speed: 0.7, glow: 'rgba(180, 80, 220, 0.5)', label: 'VOID', tag: 'Vacío' },
    { id: 'frost', file: 'demon-frost.png', anim: 'idle', speed: 0.5, glow: 'rgba(100, 220, 255, 0.5)', label: 'FROST', tag: 'Hielo' },
    { id: 'storm', file: 'demon-storm.png', anim: 'walk', speed: 1.0, glow: 'rgba(180, 255, 100, 0.5)', label: 'STORM', tag: 'Rayo' },
    { id: 'astral', file: 'demon-astral.png', anim: 'wave', speed: 0.8, glow: 'rgba(255, 230, 80, 0.5)', label: 'ASTRAL', tag: 'Cosmos' },
  ];

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
            Ver demo ↓
          </a>
        </div>
      </div>

      {/* Skin parade */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Central Daemon (the hero) */}
        <div className="flex flex-col items-center mb-8">
          <div className="skin-card skin-float relative">
            <div className="absolute -inset-8 bg-daemon/20 blur-3xl rounded-full animate-pulse" />
            <MinecraftSkin
              skinUrl={`${base}skin-daemon.png`}
              height={420}
              width={300}
              animation="idle"
              speed={0.6}
              rotateSpeed={0.4}
              zoom={0.95}
              glowColor="rgba(0, 217, 255, 0.5)"
            />
            <div className="text-center mt-2">
              <span className="font-pixel text-[10px] tracking-[0.3em] text-daemon px-3 py-1 border border-daemon/60 bg-navy-deep/80">
                ⚡ DAEMON
              </span>
            </div>
          </div>
        </div>

        {/* Section title */}
        <div className="text-center mt-12 mb-8">
          <p className="font-pixel text-[10px] tracking-[0.4em] text-cream/50 uppercase">
            ▸ Conocé el bestiario ▸
          </p>
        </div>

        {/* The DEMON party — 5 unique demons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {skins.map((skin) => (
            <div
              key={skin.id}
              className="skin-card skin-float flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-full">
                <div
                  className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: skin.glow }}
                />
                <div className="relative">
                  <MinecraftSkin
                    skinUrl={`${base}${skin.file}`}
                    height={220}
                    width={160}
                    animation={skin.anim}
                    speed={skin.speed}
                    rotateSpeed={0.4}
                    zoom={0.85}
                    glowColor={skin.glow}
                  />
                </div>
              </div>
              <div className="mt-2 text-center">
                <div
                  className="font-display text-sm tracking-widest uppercase"
                  style={{ color: skin.glow.replace('0.5', '0.95') }}
                >
                  {skin.label}
                </div>
                <div className="font-pixel text-[8px] tracking-[0.3em] text-cream/50 mt-1">
                  ▸ {skin.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

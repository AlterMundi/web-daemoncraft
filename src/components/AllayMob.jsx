import { useMemo } from 'react';

/**
 * AllayMob — CSS 3D cube Allay (Minecraft-style, faithful proportions).
 *
 * Reference: Gemini renders + Mojang model.
 *  - 8×8×8 head cube (proportionally LARGE — chibi).
 *  - 4×6×4 body cube (small torso, no legs).
 *  - 1×6×1 thin arm cubes hanging from shoulders.
 *  - Pixelated translucent wings with cyan→pink gradient (canon).
 *  - Two simple dark eye dots, no sclera.
 *  - Bottom of body & wings semi-translucent (luminous canon).
 *
 * Animations are split across nested wrappers so they never fight for `transform`:
 *  .allay-rotor → slow Y rotation
 *  .allay-bob   → vertical bob + lateral sway ("nada en el aire")
 *  .wing-l/r    → fast Y-rotation flutter
 *
 * Personality variants: inferno | frost | void | astral | zombie | classic
 */
export default function AllayMob({
  bodyColor = '#76C8E5',
  glowColor = 'rgba(0, 217, 255, 0.5)',
  wingTipColor = '#F8AAD0',  // canonical pink gradient at wing bottom
  size = 1,
  personality = 'classic',
  name = 'ALLAY',
  skinUrl = null,             // Minecraft-style 32x32 PNG skin texture
}) {
  const id = useMemo(() => `allay-${Math.random().toString(36).slice(2, 8)}`, []);
  const s = size;

  // Color shades
  const dark   = darken(bodyColor, 35);
  const shade  = darken(bodyColor, 18);
  const light  = lighten(bodyColor, 14);
  const accent = lighten(bodyColor, 28);
  const wingMain = hexToRgba(lighten(bodyColor, 20), 0.55);
  const wingMainSolid = lighten(bodyColor, 20);

  // Stable particles
  const particles = useMemo(() => {
    const count = personality === 'astral' ? 9 : personality === 'zombie' ? 5 : 7;
    const seed = (i, m) => ((i * 9301 + 49297) % m) / m;
    return Array.from({ length: count }, (_, i) => ({
      left: 14 + seed(i + 1, 233) * 72,
      bottom: 8 + seed(i + 11, 197) * 50,
      delay: (i * 0.42) % 3,
      drift: (seed(i + 7, 131) - 0.5) * 30,
    }));
  }, [personality, size]);

  return (
    <div className={`allay-host ${id} is-${personality}`} style={{ '--allay-glow': glowColor }}>
      <style>{`
        .${id}.allay-host {
          position: relative;
          width: ${300 * s}px;
          height: ${420 * s}px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: ${1200 * s}px;
        }

        /* Background aura */
        .${id} .aura {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 55%, var(--allay-glow) 0%, transparent 55%);
          filter: blur(${28 * s}px);
          pointer-events: none;
          animation: ${id}-pulse 3.4s ease-in-out infinite;
        }
        @keyframes ${id}-pulse {
          0%, 100% { opacity: 0.55; transform: scale(0.94); }
          50%      { opacity: 1;    transform: scale(1.08); }
        }

        /* Animation layer 1: slow Y rotation only */
        .${id} .rotor {
          position: relative;
          transform-style: preserve-3d;
          width: ${100 * s}px;
          height: ${260 * s}px;
          animation: ${id}-rotor 14s linear infinite;
        }
        @keyframes ${id}-rotor {
          to { transform: rotateY(360deg); }
        }

        /* Animation layer 2: vertical bob + sway only */
        .${id} .bob {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: ${id}-bob 3.4s ease-in-out infinite;
        }
        @keyframes ${id}-bob {
          0%, 100% { transform: translate3d(0, 0, 0)              rotateZ(-1.5deg); }
          25%      { transform: translate3d(${3*s}px,  -${6*s}px, 0) rotateZ(0.5deg); }
          50%      { transform: translate3d(0,         -${12*s}px,0) rotateZ(1.5deg); }
          75%      { transform: translate3d(-${3*s}px, -${6*s}px, 0) rotateZ(-0.5deg); }
        }

        /* === HEAD (8×8×8 → 80×80×80 px) — slight forward tilt (Mojang model has the head looking down a bit) === */
        .${id} .head {
          position: absolute;
          width: ${80*s}px;
          height: ${80*s}px;
          left: 50%;
          top: 0;
          margin-left: -${40*s}px;
          transform-style: preserve-3d;
          transform: rotateX(8deg);
          z-index: 3;
        }
        .${id} .head .f {
          position: absolute;
          width: ${80*s}px;
          height: ${80*s}px;
          box-sizing: border-box;
          border: ${1*s}px solid rgba(0,0,0,0.18);
          image-rendering: pixelated;
        }
        .${id} .head .front  { transform: translateZ(${40*s}px);                  background-color: ${bodyColor}; }
        .${id} .head .back   { transform: rotateY(180deg) translateZ(${40*s}px);  background-color: ${shade}; }
        .${id} .head .left   { transform: rotateY(-90deg) translateZ(${40*s}px);  background-color: ${darken(bodyColor, 8)}; }
        .${id} .head .right  { transform: rotateY(90deg)  translateZ(${40*s}px);  background-color: ${darken(bodyColor, 8)}; }
        .${id} .head .top    { transform: rotateX(90deg)  translateZ(${40*s}px);  background-color: ${light}; }
        .${id} .head .bottom { transform: rotateX(-90deg) translateZ(${40*s}px);  background-color: ${darken(bodyColor, 22)}; }

        /* Eyes on front face — small dark dots (canon) */
        .${id} .eyes {
          position: absolute;
          top: ${30*s}px;
          left: 50%;
          transform: translateX(-50%) translateZ(${41*s}px);
          display: flex;
          gap: ${22*s}px;
          z-index: 10;
        }
        .${id} .eye {
          width: ${10*s}px;
          height: ${14*s}px;
          background: ${darken(bodyColor, 55)};
          border-radius: ${1*s}px;
          position: relative;
          box-shadow: inset ${-1*s}px ${-1*s}px 0 rgba(0,0,0,0.25);
          animation: ${id}-blink 5.2s ease-in-out infinite;
          transform-origin: center;
        }
        .${id} .eye::after {
          content: '';
          position: absolute;
          top: ${1*s}px;
          left: ${1*s}px;
          width: ${3*s}px;
          height: ${3*s}px;
          background: white;
          opacity: 0.85;
        }
        @keyframes ${id}-blink {
          0%, 92%, 96%, 100% { transform: scaleY(1); }
          94%                { transform: scaleY(0.08); }
        }

        /* === BODY (4×6×4 → 40×60×40 px) === */
        .${id} .body {
          position: absolute;
          width: ${40*s}px;
          height: ${60*s}px;
          left: 50%;
          top: ${82*s}px;
          margin-left: -${20*s}px;
          transform-style: preserve-3d;
          z-index: 2;
        }
        .${id} .body .f {
          position: absolute;
          box-sizing: border-box;
          border: ${1*s}px solid rgba(0,0,0,0.15);
        }
        .${id} .body .front  { width:${40*s}px; height:${60*s}px; transform: translateZ(${20*s}px);                  background-color: ${bodyColor}; }
        .${id} .body .back   { width:${40*s}px; height:${60*s}px; transform: rotateY(180deg) translateZ(${20*s}px);  background-color: ${shade}; }
        .${id} .body .left   { width:${40*s}px; height:${60*s}px; transform: rotateY(-90deg) translateZ(${20*s}px);  background-color: ${darken(bodyColor,8)}; }
        .${id} .body .right  { width:${40*s}px; height:${60*s}px; transform: rotateY(90deg)  translateZ(${20*s}px);  background-color: ${darken(bodyColor,8)}; }
        .${id} .body .top    { width:${40*s}px; height:${40*s}px; transform: rotateX(90deg)  translateZ(0);          background-color: ${light}; }
        .${id} .body .bottom { width:${40*s}px; height:${40*s}px; transform: rotateX(-90deg) translateZ(${60*s}px);  background-color: ${hexToRgba(darken(bodyColor,30), 0.4)}; }

        /* === ARMS (1×6×1 → 10×60×10 px) — thin & abstract === */
        .${id} .arm {
          position: absolute;
          width: ${10*s}px;
          height: ${60*s}px;
          top: ${82*s}px;
          transform-style: preserve-3d;
          z-index: 1;
        }
        .${id} .arm-l { left: calc(50% - ${30*s}px); }
        .${id} .arm-r { left: calc(50% + ${20*s}px); }
        .${id} .arm .f {
          position: absolute;
          box-sizing: border-box;
          border: ${0.5*s}px solid rgba(0,0,0,0.15);
        }
        .${id} .arm .front  { width:${10*s}px; height:${60*s}px; transform: translateZ(${5*s}px);                  background-color: ${bodyColor}; }
        .${id} .arm .back   { width:${10*s}px; height:${60*s}px; transform: rotateY(180deg) translateZ(${5*s}px);  background-color: ${shade}; }
        .${id} .arm .left   { width:${10*s}px; height:${60*s}px; transform: rotateY(-90deg) translateZ(${5*s}px);  background-color: ${darken(bodyColor,12)}; }
        .${id} .arm .right  { width:${10*s}px; height:${60*s}px; transform: rotateY(90deg)  translateZ(${5*s}px);  background-color: ${darken(bodyColor,12)}; }
        .${id} .arm .top    { width:${10*s}px; height:${10*s}px; transform: rotateX(90deg) translateZ(0);          background-color: ${light}; }
${skinUrl ? `
        /* === SKIN TEXTURE OVERLAY (Mojang Allay UV layout, 32×32 → ${320*s}×${320*s} at scale ${10*s}) === */
        .${id} .head .f, .${id} .body .f, .${id} .arm .f {
          background-image: url(${skinUrl});
          background-repeat: no-repeat;
          background-size: ${320*s}px ${320*s}px;
          image-rendering: pixelated;
        }
        /* HEAD 8×8×8 — face=8×8 displayed as ${80*s}×${80*s} */
        .${id} .head .top    { background-position: -${ 80*s}px            0;            }
        .${id} .head .bottom { background-position: -${160*s}px            0;            }
        .${id} .head .right  { background-position:            0          -${80*s}px; }
        .${id} .head .front  { background-position: -${ 80*s}px           -${80*s}px; }
        .${id} .head .left   { background-position: -${160*s}px           -${80*s}px; }
        .${id} .head .back   { background-position: -${240*s}px           -${80*s}px; }
        /* BODY 4×6×4 — face_front=4×6 displayed as ${40*s}×${60*s}, face_top=4×4 as ${40*s}×${40*s} */
        .${id} .body .top    { background-position: -${ 40*s}px           -${160*s}px; }
        .${id} .body .bottom { background-position: -${ 80*s}px           -${160*s}px; }
        .${id} .body .right  { background-position:            0          -${220*s}px; }
        .${id} .body .front  { background-position: -${ 40*s}px           -${220*s}px; }
        .${id} .body .left   { background-position: -${ 80*s}px           -${220*s}px; }
        .${id} .body .back   { background-position: -${120*s}px           -${220*s}px; }
        /* ARMS 1×6×1 — face_front=1×6 displayed as ${10*s}×${60*s} */
        .${id} .arm .top     { background-position: -${170*s}px           -${220*s}px; }
        .${id} .arm .right   { background-position: -${160*s}px           -${230*s}px; }
        .${id} .arm .front   { background-position: -${170*s}px           -${230*s}px; }
        .${id} .arm .left    { background-position: -${180*s}px           -${230*s}px; }
        .${id} .arm .back    { background-position: -${190*s}px           -${230*s}px; }
` : ''}

        /* === WINGS — pixelated SVG planes, 3D positioned behind body === */
        .${id} .wings {
          position: absolute;
          top: ${66*s}px;
          left: 50%;
          transform: translateX(-50%) translateZ(-${22*s}px);
          transform-style: preserve-3d;
          width: ${200*s}px;
          height: ${110*s}px;
          margin-left: -${100*s}px;
          z-index: 0;
          pointer-events: none;
        }
        .${id} .wing {
          position: absolute;
          width: ${90*s}px;
          height: ${110*s}px;
          top: 0;
          transform-style: preserve-3d;
        }
        .${id} .wing-l {
          right: 50%;
          transform-origin: right center;
          animation: ${id}-flutter-l 0.18s ease-in-out infinite alternate;
        }
        .${id} .wing-r {
          left: 50%;
          transform-origin: left center;
          animation: ${id}-flutter-r 0.18s ease-in-out infinite alternate;
        }
        .${id} .wing svg { width: 100%; height: 100%; display: block; shape-rendering: crispEdges; }
        @keyframes ${id}-flutter-l {
          from { transform: rotateY(40deg)  rotateZ(-6deg); }
          to   { transform: rotateY(80deg)  rotateZ(-14deg); }
        }
        @keyframes ${id}-flutter-r {
          from { transform: rotateY(-40deg) rotateZ(6deg); }
          to   { transform: rotateY(-80deg) rotateZ(14deg); }
        }

        /* === Personality decoration animations === */
        .${id} .horns {
          position: absolute;
          top: -${22*s}px;
          left: 50%;
          transform: translateX(-50%) translateZ(${41*s}px);
          width: ${80*s}px;
          height: ${30*s}px;
          z-index: 11;
          animation: ${id}-horn-flicker 1.4s ease-in-out infinite;
        }
        .${id} .horns svg { width: 100%; height: 100%; }
        @keyframes ${id}-horn-flicker {
          0%, 100% { filter: drop-shadow(0 0 1px rgba(255,80,0,0.7)); }
          50%      { filter: drop-shadow(0 0 4px rgba(255,150,0,1)); }
        }

        .${id} .halo {
          position: absolute;
          top: -${18*s}px;
          left: 50%;
          margin-left: -${60*s}px;
          width: ${120*s}px;
          height: ${28*s}px;
          z-index: 11;
          transform: translateZ(${30*s}px);
          animation: ${id}-halo-spin 7s linear infinite;
        }
        @keyframes ${id}-halo-spin { to { transform: translateZ(${30*s}px) rotate(360deg); } }
        .${id} .halo svg { width: 100%; height: 100%; }

        .${id} .ring {
          position: absolute;
          top: ${20*s}px;
          left: 50%;
          margin-left: -${110*s}px;
          width: ${220*s}px;
          height: ${220*s}px;
          z-index: 0;
          animation: ${id}-ring-spin 5s linear infinite;
          opacity: 0.85;
        }
        @keyframes ${id}-ring-spin { to { transform: rotate(-360deg); } }
        .${id} .ring svg { width: 100%; height: 100%; }

        .${id} .frost-crown {
          position: absolute;
          top: -${10*s}px;
          left: 50%;
          margin-left: -${42*s}px;
          width: ${84*s}px;
          height: ${20*s}px;
          z-index: 11;
          transform: translateZ(${42*s}px);
          animation: ${id}-shimmer 1.6s ease-in-out infinite;
        }
        .${id} .frost-crown svg { width: 100%; height: 100%; }
        @keyframes ${id}-shimmer { 0%,100%{opacity:.7;} 50%{opacity:1;} }

        .${id} .chest-mark {
          position: absolute;
          top: ${20*s}px;
          left: 50%;
          margin-left: -${10*s}px;
          width: ${20*s}px;
          height: ${20*s}px;
          transform: translateZ(${21*s}px);
        }
        .${id} .chest-mark svg { width: 100%; height: 100%; }

        .${id} .bandage {
          position: absolute;
          top: ${20*s}px;
          left: 0;
          width: ${80*s}px;
          height: ${10*s}px;
          transform: translateZ(${41*s}px);
          background: #D8D2BC;
          opacity: 0.92;
          box-shadow: inset 0 -1px 0 rgba(0,0,0,0.2);
        }

        /* Zombie variant */
        .${id}.is-zombie .bob { animation: ${id}-bob-zombie 4.4s ease-in-out infinite; }
        @keyframes ${id}-bob-zombie {
          0%, 100% { transform: translate3d(0, -${4*s}px, 0) rotateZ(-4deg); }
          50%      { transform: translate3d(0, -${10*s}px, 0) rotateZ(3deg); }
        }
        .${id}.is-zombie .arm-l { transform: rotateZ(15deg); transform-origin: top center; }
        .${id}.is-zombie .arm-r { transform: rotateZ(-15deg); transform-origin: top center; }

        /* Particle layer */
        .${id} .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
        .${id} .pcl {
          position: absolute;
          width: ${10*s}px;
          height: ${10*s}px;
          opacity: 0;
          animation: ${id}-rise 3.2s linear infinite;
        }
        @keyframes ${id}-rise {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4); }
          15%  { opacity: 1; }
          85%  { opacity: 0.85; }
          100% { opacity: 0; transform: translate(var(--drift, 0px), -${130*s}px) scale(1.2); }
        }
        .${id}.is-zombie .pcl { animation: ${id}-drip 3s linear infinite; }
        @keyframes ${id}-drip {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.5); }
          25%  { opacity: 0.9; }
          100% { opacity: 0; transform: translate(var(--drift, 0px), ${60*s}px) scale(0.7); }
        }

        @media (prefers-reduced-motion: reduce) {
          .${id} *, .${id} { animation: none !important; }
        }
      `}</style>

      <div className="aura" />

      <div className="rotor">
        <div className="bob">
          {/* WINGS — back layer */}
          <div className="wings">
            <div className="wing wing-l">
              <PixelWing side="left"  main={wingMainSolid} pink={wingTipColor} />
            </div>
            <div className="wing wing-r">
              <PixelWing side="right" main={wingMainSolid} pink={wingTipColor} />
            </div>
          </div>

          {/* VOID — orbiting rings (around figure) */}
          {personality === 'void' && (
            <div className="ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke={accent} strokeWidth="0.6" strokeDasharray="3 2" opacity="0.55" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={accent} strokeWidth="0.5" strokeDasharray="1 4" opacity="0.7" />
                <circle cx="50" cy="50" r="34" fill="none" stroke="white"  strokeWidth="0.3" strokeDasharray="0.5 5" opacity="0.45" />
              </svg>
            </div>
          )}

          {/* ASTRAL — halo above head */}
          {personality === 'astral' && (
            <div className="halo">
              <svg viewBox="0 0 120 28" preserveAspectRatio="none">
                <ellipse cx="60" cy="14" rx="56" ry="10" fill="none" stroke="white"  strokeWidth="2.5" opacity="0.95" />
                <ellipse cx="60" cy="14" rx="48" ry="7"  fill="none" stroke={accent} strokeWidth="1.2" opacity="0.7" />
              </svg>
            </div>
          )}

          {/* HEAD */}
          <div className="head">
            <div className="f front" />
            <div className="f back" />
            <div className="f left" />
            <div className="f right" />
            <div className="f top" />
            <div className="f bottom" />

            {/* INFERNO horns on top of head */}
            {personality === 'inferno' && (
              <div className="horns">
                <svg viewBox="0 0 80 30" preserveAspectRatio="none">
                  <path d="M 18 30 L 8 0 L 28 24 Z" fill={dark} />
                  <path d="M 18 30 L 12 8 L 25 22 Z" fill={accent} opacity="0.6" />
                  <circle cx="8" cy="0.6" r="2" fill="#FFB347" />
                  <path d="M 62 30 L 72 0 L 52 24 Z" fill={dark} />
                  <path d="M 62 30 L 68 8 L 55 22 Z" fill={accent} opacity="0.6" />
                  <circle cx="72" cy="0.6" r="2" fill="#FFB347" />
                </svg>
              </div>
            )}

            {/* FROST crown */}
            {personality === 'frost' && (
              <div className="frost-crown">
                <svg viewBox="0 0 84 20" preserveAspectRatio="none">
                  <rect x="0" y="14" width="84" height="6" fill="white" opacity="0.85" />
                  <path d="M 10 14 L 16 0 L 22 14 Z" fill="white" />
                  <path d="M 30 14 L 38 -2 L 46 14 Z" fill="white" />
                  <path d="M 54 14 L 62 0 L 70 14 Z" fill="white" />
                  <path d="M 30 14 L 38 4 L 46 14 Z" fill={accent} opacity="0.7" />
                </svg>
              </div>
            )}

            {/* ZOMBIE bandage */}
            {personality === 'zombie' && <div className="bandage" />}

            {/* Eyes */}
            {/* Eyes: zombie always overlays X (covers skin's eyes); without skin shows custom dots; with skin only adds glow for inferno/void */}
            {personality === 'zombie' ? (
              <div className="eyes" style={{ gap: `${20*s}px` }}>
                <ZombieEye s={s} />
                <ZombieEye s={s} />
              </div>
            ) : !skinUrl ? (
              <div className="eyes">
                <div className="eye" />
                <div className="eye" />
              </div>
            ) : (personality === 'inferno' || personality === 'void') ? (
              /* Glow-only overlay — sits over the skin's eye pixels */
              <div className="eyes" style={{ pointerEvents: 'none' }}>
                <div className="eye" style={{
                  background: 'transparent',
                  boxShadow: personality === 'inferno'
                    ? `0 0 ${10*s}px #FF6622, 0 0 ${5*s}px #FFAA22`
                    : `0 0 ${8*s}px ${accent}, 0 0 ${4*s}px white`,
                }} />
                <div className="eye" style={{
                  background: 'transparent',
                  boxShadow: personality === 'inferno'
                    ? `0 0 ${10*s}px #FF6622, 0 0 ${5*s}px #FFAA22`
                    : `0 0 ${8*s}px ${accent}, 0 0 ${4*s}px white`,
                }} />
              </div>
            ) : null}
          </div>

          {/* BODY */}
          <div className="body">
            <div className="f front" />
            <div className="f back" />
            <div className="f left" />
            <div className="f right" />
            <div className="f top" />
            <div className="f bottom" />

            {/* Chest emblems */}
            {personality === 'inferno' && (
              <div className="chest-mark">
                <svg viewBox="0 0 20 20">
                  <path d="M 10 2 L 6 12 L 10 18 L 14 12 Z" fill="#FFAA00" />
                  <path d="M 10 6 L 8 12 L 10 16 L 12 12 Z" fill="#FFEE66" />
                </svg>
              </div>
            )}
            {personality === 'astral' && (
              <div className="chest-mark">
                <svg viewBox="0 0 20 20">
                  <path d="M 10 2 L 12 8 L 18 9 L 13 13 L 15 19 L 10 15 L 5 19 L 7 13 L 2 9 L 8 8 Z" fill="white" opacity="0.95" />
                </svg>
              </div>
            )}
            {personality === 'void' && (
              <div className="chest-mark">
                <svg viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="7" fill={dark} />
                  <circle cx="10" cy="10" r="4.5" fill={accent} opacity="0.75" />
                  <circle cx="10" cy="10" r="1.8" fill="white" opacity="0.95" />
                </svg>
              </div>
            )}
          </div>

          {/* ARMS */}
          <div className="arm arm-l">
            <div className="f front" />
            <div className="f back" />
            <div className="f left" />
            <div className="f right" />
            <div className="f top" />
          </div>
          <div className="arm arm-r">
            <div className="f front" />
            <div className="f back" />
            <div className="f left" />
            <div className="f right" />
            <div className="f top" />
          </div>
        </div>
      </div>

      {/* Personality particles */}
      <div className="particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="pcl"
            style={{
              left: `${p.left}%`,
              bottom: `${p.bottom}%`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            }}
          >
            <ParticleGlyph personality={personality} bodyColor={bodyColor} accent={accent} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- pixel wing (SVG with crispEdges, pink gradient at bottom) ---------- */
function PixelWing({ side, main, pink }) {
  // Wing rendered as a pixel grid; "main" cyan body, lower rows blend toward "pink".
  // Designed at viewBox 12×14 — small grid keeps stairstepped look.
  const cells = [
    // row 0 (top tip)
    [4,5,6,7],
    // row 1
    [3,4,5,6,7,8],
    // row 2
    [2,3,4,5,6,7,8,9],
    // row 3
    [1,2,3,7,8,9,10],
    // row 4
    [0,1,2,8,9,10,11],
    // row 5 (mid)
    [0,1,9,10,11],
    // row 6
    [0,1,9,10,11],
    // row 7
    [0,1,2,8,9,10,11],
    // row 8
    [1,2,3,7,8,9,10],
    // row 9
    [2,3,4,5,6,7,8,9],
    // row 10
    [3,4,5,6,7,8],
    // row 11 (bottom tip)
    [4,5,6,7],
  ];
  const W = 12, H = 12;
  const flip = side === 'right';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`wg-${side}-${main.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={main} stopOpacity="0.85" />
          <stop offset="50%"  stopColor={main} stopOpacity="0.7" />
          <stop offset="80%"  stopColor={pink} stopOpacity="0.65" />
          <stop offset="100%" stopColor={pink} stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <g transform={flip ? `scale(-1 1) translate(-${W} 0)` : ''}>
        {cells.map((row, y) => row.map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="1.02"
            height="1.02"
            fill={`url(#wg-${side}-${main.replace('#','')})`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.04"
          />
        )))}
        {/* highlight veins */}
        <line x1="0" y1="6"  x2="11" y2="6"  stroke="rgba(255,255,255,0.3)" strokeWidth="0.12" />
        <line x1="3" y1="2"  x2="11" y2="6"  stroke="rgba(255,255,255,0.18)" strokeWidth="0.08" />
        <line x1="3" y1="10" x2="11" y2="6"  stroke="rgba(255,255,255,0.18)" strokeWidth="0.08" />
      </g>
    </svg>
  );
}

/* ---------- zombie eye ---------- */
function ZombieEye({ s }) {
  return (
    <svg width={10*s} height={14*s} viewBox="0 0 10 14">
      <line x1="1" y1="2"  x2="9" y2="12" stroke="#1c1c1c" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="9" y1="2"  x2="1" y2="12" stroke="#1c1c1c" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- particle glyphs ---------- */
function ParticleGlyph({ personality, bodyColor, accent }) {
  switch (personality) {
    case 'inferno':
      return (
        <svg viewBox="0 0 8 12" width="100%" height="100%">
          <path d="M 4 0 C 6 3, 7.5 5, 6 8 C 7 10, 5 11, 4 12 C 3 11, 1 10, 2 8 C 0.5 5, 2 3, 4 0 Z" fill="#FF5522" />
          <path d="M 4 3 C 5 5, 5.8 6.5, 5 8.5 C 5.5 10, 4.5 10.5, 4 11 C 3.5 10.5, 2.5 10, 3 8.5 C 2.2 6.5, 3 5, 4 3 Z" fill="#FFCC22" />
        </svg>
      );
    case 'frost':
      return (
        <svg viewBox="0 0 8 8" width="100%" height="100%">
          <g stroke="#CFE9FF" strokeWidth="0.7" strokeLinecap="round">
            <line x1="4" y1="0.5" x2="4" y2="7.5" />
            <line x1="0.5" y1="4" x2="7.5" y2="4" />
            <line x1="1.3" y1="1.3" x2="6.7" y2="6.7" />
            <line x1="1.3" y1="6.7" x2="6.7" y2="1.3" />
          </g>
          <circle cx="4" cy="4" r="0.7" fill="white" />
        </svg>
      );
    case 'astral':
      return (
        <svg viewBox="0 0 8 8" width="100%" height="100%">
          <path d="M 4 0 L 4.7 3 L 8 4 L 4.7 5 L 4 8 L 3.3 5 L 0 4 L 3.3 3 Z" fill="#FFFFEE" />
          <circle cx="4" cy="4" r="0.5" fill="#FFE9A8" />
        </svg>
      );
    case 'void':
      return (
        <svg viewBox="0 0 8 8" width="100%" height="100%">
          <circle cx="4" cy="4" r="3"   fill="none" stroke={accent} strokeWidth="0.8" />
          <circle cx="4" cy="4" r="1.2" fill={accent} opacity="0.8" />
        </svg>
      );
    case 'zombie':
      return (
        <svg viewBox="0 0 6 8" width="100%" height="100%">
          <ellipse cx="3" cy="3" rx="1.2" ry="2"   fill="#7BA34F" />
          <ellipse cx="3" cy="6" rx="1.6" ry="0.6" fill="#7BA34F" opacity="0.6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 8 8" width="100%" height="100%">
          <path d="M 4 1 L 5 3.5 L 7.5 4 L 5 4.5 L 4 7 L 3 4.5 L 0.5 4 L 3 3.5 Z" fill={bodyColor} />
        </svg>
      );
  }
}

/* ---------- color helpers ---------- */
function darken(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + Math.round(2.55 * percent));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(2.55 * percent));
  const b = Math.min(255, (num & 0x0000FF) + Math.round(2.55 * percent));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
function hexToRgba(hex, alpha) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) & 0xFF;
  const g = (num >> 8)  & 0xFF;
  const b =  num        & 0xFF;
  return `rgba(${r},${g},${b},${alpha})`;
}

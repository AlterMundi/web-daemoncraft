/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md}'],
  theme: {
    extend: {
      colors: {
        // === Minecraft daytime palette ===
        sky: {
          light: '#A4D9F7',    // horizonte claro
          DEFAULT: '#7EC0EE',  // cielo medio Minecraft
          deep: '#4FA3D6',     // cielo alto
        },
        grass: {
          light: '#94C95C',
          DEFAULT: '#7CAC50',  // grass block top
          dark: '#5A7F3A',
          side: '#8FA352',     // grass block side
        },
        dirt: {
          light: '#A88255',
          DEFAULT: '#8B5A3C',  // dirt block
          dark: '#6B4423',
        },
        stone: {
          light: '#B5B5B5',
          DEFAULT: '#8A8A8A',
          dark: '#555555',
        },
        wood: {
          light: '#C8A165',
          DEFAULT: '#9E6B3D',  // oak log
          dark: '#6B4423',
        },
        cloud: '#FFFFFF',
        // Dorado Hermes — acento secundario
        hermes: {
          DEFAULT: '#F5C542',
          light: '#FCDC6E',
          dark: '#C79A1E',
        },
        // Navy/cream quedan pero secundarios
        night: {
          DEFAULT: '#1A1E2E',
          deep: '#0E1220',
        },
        cream: '#FAF7F0',
        ink: '#1F2933',         // texto principal sobre cream
      },
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        mono: ['"Monocraft"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Nunito"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Fredoka"', '"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 rgba(0,0,0,0.25)',
        'pixel-lg': '6px 6px 0 0 rgba(0,0,0,0.3)',
        'block': 'inset 0 -4px 0 0 rgba(0,0,0,0.25), inset 0 4px 0 0 rgba(255,255,255,0.25)',
        'block-gold': 'inset 0 -4px 0 0 #C79A1E, inset 0 4px 0 0 #FCDC6E',
        'block-grass': 'inset 0 -4px 0 0 #5A7F3A, inset 0 4px 0 0 #94C95C',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'cloud-drift': 'cloud-drift 60s linear infinite',
        'cloud-drift-slow': 'cloud-drift 90s linear infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'bob': 'bob 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'cloud-drift': {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110vw)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};

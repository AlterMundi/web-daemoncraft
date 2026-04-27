/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md}'],
  theme: {
    extend: {
      colors: {
        // === DaemonCraft 2026 Branding ===
        // Daemon = Tu compañero (Cyan life)
        daemon: {
          DEFAULT: '#00D9FF',   // Daemon Cyan — presencia viva
          light: '#80EAFF',
          dark: '#00B8D4',
          glow: 'rgba(0, 217, 255, 0.4)',
        },
        // Holodeck = Tu mundo (Gold generation)
        holodeck: {
          DEFAULT: '#FFB800',   // Gold Accent — importancia, CTAs
          light: '#FFD149',
          dark: '#FF9C00',
          glow: 'rgba(255, 184, 0, 0.3)',
        },
        // Role Master = Tu director (Purple orchestration)
        rolemaster: {
          DEFAULT: '#2D1B4E',   // Deep Purple — misterio, profundidad
          light: '#4A3A7A',
          dark: '#1A0F2E',
          glow: 'rgba(45, 27, 78, 0.3)',
        },
        // Base neutrals
        navy: {
          DEFAULT: '#0A1428',   // Dark Navy — fondo principal
          light: '#1F2A4A',
          lighter: '#2D3E5F',
          deep: '#050B15',
        },
        void: {
          DEFAULT: '#0A1428',   // alias para navy
          light: '#1F2A4A',
          deep: '#050B15',
        },
        // Minecraft daytime palette (mantenido para compatibilidad visual MC)
        sky: {
          light: '#A4D9F7',
          DEFAULT: '#7EC0EE',
          deep: '#4FA3D6',
        },
        grass: {
          light: '#94C95C',
          DEFAULT: '#7CAC50',
          dark: '#5A7F3A',
          side: '#8FA352',
        },
        dirt: {
          light: '#A88255',
          DEFAULT: '#8B5A3C',
          dark: '#6B4423',
        },
        stone: {
          light: '#B5B5B5',
          DEFAULT: '#8A8A8A',
          dark: '#555555',
        },
        wood: {
          light: '#C8A165',
          DEFAULT: '#9E6B3D',
          dark: '#6B4423',
        },
        cloud: '#FFFFFF',
        // Legacy compat (hermes -> daemon alias)
        hermes: {
          DEFAULT: '#FF5722',
          light: '#FF8A65',
          dark: '#E64A19',
        },
        night: {
          DEFAULT: '#0B0C15',
          deep: '#05060A',
        },
        cream: '#E8E8ED',
        ink: '#1F2933',
      },
      fontFamily: {
        display: ['"Russo One"', '"Press Start 2P"', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Chakra Petch"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['"Chakra Petch"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 rgba(0,0,0,0.25)',
        'pixel-lg': '6px 6px 0 0 rgba(0,0,0,0.3)',
        'block': 'inset 0 -4px 0 0 rgba(0,0,0,0.25), inset 0 4px 0 0 rgba(255,255,255,0.25)',
        'block-daemon': 'inset 0 -4px 0 0 #E64A19, inset 0 4px 0 0 #FF8A65',
        'block-grass': 'inset 0 -4px 0 0 #5A7F3A, inset 0 4px 0 0 #94C95C',
        'glow-daemon': '0 0 20px rgba(255,87,34,0.3)',
        'glow-cyan': '0 0 20px rgba(0,229,255,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'cloud-drift': 'cloud-drift 60s linear infinite',
        'cloud-drift-slow': 'cloud-drift 90s linear infinite',
        'sway': 'sway 4s ease-in-out infinite',
        'bob': 'bob 2s ease-in-out infinite',
        'pulse-daemon': 'pulse-daemon 2s ease-in-out infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
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
        'pulse-daemon': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,87,34,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(255,87,34,0.6)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
          '75%': { opacity: '0.95' },
        },
      },
    },
  },
  plugins: [],
};

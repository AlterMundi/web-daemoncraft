# HermesCraft · Web

Landing de **HermesCraft** — el compañero IA persistente para Minecraft.
Un proyecto de [AlterMundi](https://altermundi.net).

🌐 **Live**: https://altermundi.github.io/web-hermescraft/

## Stack

- [Astro 5](https://astro.build) + [Tailwind CSS](https://tailwindcss.com)
- [React](https://react.dev) (islands para componentes interactivos)
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — animaciones al scroll
- [skinview3d](https://github.com/bs-community/skinview3d) — Steve-Hermes 3D rotatorio

## Desarrollo local

```bash
npm install
npm run dev        # → http://localhost:8767
```

## Build

```bash
npm run build      # → ./dist
npm run preview    # → serve dist en :8767
```

## Deploy

Automático en cada push a `main` vía GitHub Actions — ver [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### Custom domain

Si se configura un dominio (ej. `hermescraft.ai`):

1. Crear archivo `public/CNAME` con el dominio.
2. En `astro.config.mjs` cambiar `base: '/web-hermescraft/'` → `base: '/'` y `site` al dominio.

## Assets generados por IA

El skin de Steve-Hermes (`public/skin-hermes.png`) se genera con:

```bash
python3 scripts/generate-skin.py
```

Las ilustraciones del sitio (hero landscape, presets SOUL, etc.) se pueden
generar con Gemini (nano-banana) — requiere billing activa:

```bash
GEMINI_API_KEY=... python3 scripts/generate-images.py
```

---

© 2026 AlterMundi · Minecraft™ es marca de Mojang AB, no hay afiliación oficial.

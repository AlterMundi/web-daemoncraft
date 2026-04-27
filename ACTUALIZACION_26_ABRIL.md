# Actualización de DeamonCraft Web - 26 Abril 2026

## Cambios Realizados

### 1. Eliminación de Archivos Obsoletos ("Falopa")
- ❌ Eliminado: `HermesCraft_Brand_Narrative.pdf` (documento viejo, proyecto renombrado)
- ❌ Eliminado: `HermesCraft_Investor_Deck_Grok43.pdf` (investor deck obsoleto)
- ❌ Eliminado: `DAEMONCRAFT_STRATEGY.md` (reemplazado por documento de punta a punta oficial)
- ❌ Eliminado: `DECK_DAEMONCRAFT_SEED.md` (documento parcial, información consolidada)
- ❌ Eliminado: `PLAN.md` (reemplazado por documento maestro oficial)

### 2. Actualización de Componentes
- **Hero.astro**: Cambiado "v0.1 en vivo · 500+ daemons" → "Fase 0: Fundamentos · Abril 2026" (información realista)
- **Roadmap.astro**: Actualizado con fechas específicas y fases claras:
  - Fase 01: Abril 2026 (Fundamentos)
  - Fase 02: Mayo–Junio 2026 (Primera Camada)
  - Fase 03: Julio–Septiembre 2026 (Invocación Pública)
  - Fase 04: Octubre 2026+ (El Reino de los Daemons)
- **Crowdfunding.astro**: Actualizado copy para reflejar que se está levantando $450K

### 3. Renumeración de Secciones (h-mini)
Reordenado y renumerado todos los números de sección para coherencia:
- 01 / Los SOULs (Companeros)
- 02 / Onboarding (ComoFunciona)
- 03 / Arquitectura (Agente)
- 04 / Bridge Familia (Familia)
- 05 / Educación (Educacion)
- 06 / Privacidad (ParaPadres)
- 07 / Precios (Precios)
- 08 / Roadmap (Roadmap)
- 09 / Manifiesto (Manifiesto)

### 4. Reordenamiento de Secciones en index.astro
Ahora el orden en la landing page es:
1. Hero
2. Companeros (SOULs)
3. ComoFunciona (onboarding 30s)
4. Agente (arquitectura)
5. Familia (Telegram bridge)
6. Educacion (impacto pedagógico)
7. ParaPadres (privacidad y seguridad)
8. Precios (tiers)
9. Roadmap (fases)
10. Manifiesto (por qué)
11. Crowdfunding (seed round)
12. Footer

### 5. Información Baseada en Documento Oficial
Todos los cambios se basan en `/home/saira/de_punta_a_punta.md` que contiene:
- Visión completa del proyecto
- Arquitectura multi-agente
- Componentes técnicos detallados
- Roadmap 2026 con métricas claras
- Especificaciones de producto
- Stack tecnológico
- Riesgos y dependencias

## Stack de la Web
- Astro 5 + React + Tailwind CSS
- GSAP ScrollTrigger para animaciones
- skinview3d para visualización 3D del Daemon
- TypeScript para type safety
- Deploy automático vía GitHub Actions

## Próximos Pasos
1. ✅ npm install completando
2. ⏳ npm run build para verificar compilación
3. ⏳ npm run dev para preview en localhost:3000
4. ⏳ Verificar visual y coherencia de contenido
5. ⏳ Deployar cuando esté listo

## Notas
- La web ahora refleja información realista de Fase 0 (Abril 2026)
- Eliminada toda métrica falopa ("500+ daemons en vivo")
- Alineada completamente con documento maestro de punta a punta
- Estructura coherente de 9 secciones principales + header/footer
- Call-to-action claro hacia demo de seed round

---
**Actualizado por:** Claude Code  
**Fecha:** 26 Abril 2026  
**Basado en:** `/home/saira/de_punta_a_punta.md`

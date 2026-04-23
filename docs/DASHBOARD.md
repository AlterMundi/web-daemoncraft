# Dashboard DaemonCraft — Sistema de Seguimiento

**URL:** dashboard.daemoncraft.ai (futuro)
**Stack:** Next.js + Tailwind + Recharts (o similar)
**Dueño:** Agente Tech + Orquestador

## Objetivo
Visualizar en tiempo real:
1. Qué está haciendo cada agente
2. Flujo de trabajo entre agentes
3. Estado de tareas y bloqueos
4. Métricas del proyecto

## Secciones

### 1. Vista de Agentes (Kanban por agente)

### 2. Flujo de Trabajo (Diagrama)
- Flechas mostrando dependencias entre agentes
- Tareas bloqueantes resaltadas en rojo
- Tareas desbloqueadas resaltadas en verde

### 3. Métricas en Vivo
- Usuarios activos
- MRR
- Agentes conectados
- Mensajes de soporte pendientes
- Posts publicados esta semana
- Emails enviados

### 4. Feed de Actividad
- "Agente Tech commiteó prototipo v0.1"
- "Agente Marca publicó video en TikTok"
- "Agente Growth recibió 50 nuevos emails"
- "Bot Concierge resolvió 12 tickets"

### 5. Alertas
- 🔴 "Agente Tech bloqueado: falta decisión sobre LLM"
- 🟡 "Agente Marca necesita asset visual para video"
- 🟡 "Agente Growth esperando MVP para outreach"

## Data source
- GitHub API (commits, PRs, issues)
- Obsidian vault (estado de tareas)
- Telegram bots (mensajes, tickets)
- Internal DB (usuarios, MRR, métricas)
- X API (posts, engagement)
- Mailchimp/Resend API (emails enviados)

## Implementación
- [ ] Definir schema de datos
- [ ] Crear API endpoint /status
- [ ] Crear API endpoint /metrics
- [ ] Crear API endpoint /activity
- [ ] Dashboard UI (Next.js)
- [ ] WebSocket para actualizaciones en tiempo real

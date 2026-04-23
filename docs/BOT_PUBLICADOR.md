# Bot Telegram #1: Publicador Daemon

**Nombre:** @DaemonPublisherBot (provisional)
**Rol:** Distribución automática de contenido
**Dueño:** Agente Marca + Growth

## Funciones

1. **Blog → Web**
   - Recibe post nuevo (Markdown) vía Telegram o webhook
   - Convierte a HTML/Astro
   - Commitea a repo DeamonCraft-web
   - Triggerea redeploy

2. **Redes Sociales**
   - Recibe post aprobado
   - Publica en X/Twitter vía API
   - Publica en Instagram (texto + imagen)
   - Publica en TikTok (texto)
   - Guarda métricas (likes, shares, impressions)

3. **Newsletter**
   - Recibe email aprobado
   - Envía vía ConvertKit/Resend/Mailchimp API
   - Maneja bounces y unsubscribes

## Comandos admin

```
/post blog "Titulo" "Contenido md..."
/post x "Contenido tweet..."
/post ig "Caption" [imagen adjunta]
/post newsletter "Asunto" "Cuerpo html..."
/schedule x "2026-05-01 09:00" "Contenido..."
/metrics x "ultimos 7 dias"
```

## Integraciones
- GitHub API (para commitear blog posts)
- X API v2
- Instagram Graph API
- ConvertKit/Resend API
- Obsidian vault (lee calendario de contenido)

## Estado
- [ ] Elegir stack (Python + python-telegram-bot + FastAPI)
- [ ] Setup cuenta bot en @BotFather
- [ ] Implementar comando /post blog
- [ ] Implementar comando /post x
- [ ] Implementar scheduler
- [ ] Deploy en servidor

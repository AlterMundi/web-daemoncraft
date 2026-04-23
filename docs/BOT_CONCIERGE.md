# Bot Telegram #2: Daemon Concierge

**Nombre:** @DaemonConciergeBot (provisional)
**Rol:** Atención al cliente, soporte, ventas, onboarding
**Dueño:** Agente Comunidad + Growth

## Funciones

1. **Soporte Técnico**
   - FAQ automática con embeddings (RAG sobre docs)
   - Escalado a humano cuando no sabe
   - Creación de tickets en sistema interno

2. **Ventas / Onboarding**
   - Explica tiers de precios
   - Guía signup paso a paso
   - Demos programadas (integración Calendly)
   - Seguimiento post-demo

3. **Reportes para Padres**
   - Envía resúmenes diarios/semanales del Daemon
   - Responde preguntas sobre actividad del hijo
   - Alertas de seguridad (Guardian Mode)

4. **Feedback Loop**
   - Recopila NPS periódico
   - Encuestas de satisfacción
   - Bug reports con screenshot

## Flujos conversacionales

```
Usuario: "Hola, tengo un problema"
Bot: "Hola! Soy el Concierge de DaemonCraft. ¿Con qué te ayudo?
      1. 🔧 Soporte técnico
      2. 💰 Precios y planes
      3. 📈 Reporte de mi hijo
      4. 📞 Agendar demo"

Usuario: "2"
Bot: [Explica planes con botones inline]
```

## Integraciones
- OpenAI API (GPT-4 para respuestas naturales)
- LlamaIndex/Pinecone (RAG sobre docs)
- Calendly API (scheduling)
- Stripe API (pagos/info de cuenta)
- Internal API (datos de usuarios, reportes)
- Obsidian vault (lee FAQ y docs)

## Seguridad
- No almacena datos personales
- COPPA compliant (no guarda info de menores)
- Audit log de todas las conversaciones

## Estado
- [ ] Elegir stack (Python + python-telegram-bot + LangChain)
- [ ] Setup cuenta bot en @BotFather
- [ ] Indexar documentación en vector DB
- [ ] Implementar flujo FAQ
- [ ] Implementar flujo ventas
- [ ] Implementar reportes padres
- [ ] Deploy en servidor

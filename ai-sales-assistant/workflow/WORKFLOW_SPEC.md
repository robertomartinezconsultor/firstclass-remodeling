# n8n Workflow Spec

Esta es la receta practica para llevar el MVP a `n8n` cuando ya tengamos Node.js y el runtime instalado.

## Objetivo

Crear un asistente comercial que atienda por chat, consulte el catalogo de servicios, califique el lead y mande los leads calientes a una hoja o CRM.

## Entradas

- `catalog/services.csv`
- `prompts/system_prompt.md`
- canal de entrada:
  - chat web
  - WhatsApp
  - formulario web
  - Facebook Lead Ads

## Flujo recomendado

1. `Chat Trigger` o `Webhook`
   - recibe el mensaje del cliente y un `session_id`

2. `Set`
   - normaliza `session_id`, idioma, timestamp, source

3. `Read Binary File` o `Spreadsheet File`
   - lee `catalog/services.csv`

4. `Code`
   - convierte CSV a JSON y saca coincidencias simples por palabras clave
   - deja lista una lista de servicios candidatos

5. `AI Agent` con Ollama o proveedor compatible
   - system prompt: `prompts/system_prompt.md`
   - contexto extra: servicios candidatos, zonas, telefono, WhatsApp
   - memory: por `session_id`

6. `Information Extractor`
   - extrae:
     - name
     - phone
     - email
     - project_type
     - budget
     - neighborhood
     - timeline
     - summary

7. `IF`
   - si hay `project_type` + `budget` + (`phone` o `email`)
   - entonces el lead queda como `qualified`
   - si no, sigue como `in_progress`

8. `Google Sheets` o `Airtable`
   - agrega o actualiza el lead

9. `Slack`, `Email` o `WhatsApp notify`
   - solo para leads calificados
   - mensaje sugerido:
     - nombre
     - proyecto
     - zona
     - presupuesto
     - timeline
     - ultimo mensaje

10. `Respond to Webhook`
   - manda la respuesta del asistente al chat

## Campos sugeridos para CRM

- created_at
- session_id
- source
- name
- phone
- email
- project_type
- budget
- neighborhood
- timeline
- lead_status
- recommended_service
- notes

## Notas operativas

- Si `Ollama` no esta disponible, el `Code` node puede responder con reglas simples como hace `assistant_server.py`.
- Si quieres conectar WhatsApp, conviene usar la misma extraccion de lead y solo cambiar el trigger/canal.
- Para cotizaciones serias, mantén siempre la frase: `Ballpark estimate. Exact quote requires consultation.`

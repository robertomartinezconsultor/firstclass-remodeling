# First Class Remodeling TX Sales Assistant

MVP local para captar, calificar y empujar leads de remodelacion sin depender de n8n ni Ollama para la primera version.

## Que ya hace

- Atiende en un chat web local.
- Recomienda el servicio correcto usando el catalogo real de la empresa.
- Da rangos ballpark de inversion.
- Captura lead data clave: nombre, contacto, proyecto, zona, presupuesto y timeline.
- Guarda leads calificados en `data/leads.jsonl`.
- Queda listo para enchufarse a Ollama o a un workflow de n8n cuando el runtime este disponible.

## Como correrlo

```bash
cd /Users/cashamerica/FirstClassRemodelingTX/ai-sales-assistant
python3 assistant_server.py --port 8791
```

Luego abre:

`http://localhost:8791`

## Estructura

- `assistant_server.py`: servidor local y logica del asistente.
- `catalog/services.json`: catalogo estructurado de servicios.
- `catalog/services.csv`: version plana del catalogo para hojas o n8n.
- `prompts/system_prompt.md`: prompt maestro para la futura capa LLM.
- `workflow/WORKFLOW_SPEC.md`: receta exacta para montarlo luego en n8n.
- `static/`: interfaz web local.
- `data/leads.jsonl`: leads capturados por el MVP.

## Estado tecnico de hoy

- `n8n` no esta instalado en esta maquina porque falta runtime de Node.js.
- `Ollama` esta instalado, pero el binario cae al arrancar por un error local del runtime de MLX.
- El MVP funciona con un motor local basado en reglas mientras resolvemos esos dos puntos.

## Siguiente mejora natural

1. Instalar Node.js localmente.
2. Instalar n8n.
3. Importar la receta de `workflow/WORKFLOW_SPEC.md`.
4. Reparar Ollama o apuntar a otro proveedor local compatible.

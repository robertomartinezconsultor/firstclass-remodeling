# AI Sales Assistant Handoff

## Current State

- Project: `/Users/cashamerica/FirstClassRemodelingTX/ai-sales-assistant`
- Status: local MVP working
- Public test URL on this Mac: `http://127.0.0.1:8791`
- Engine: local rule engine
- Lead file: `data/leads.jsonl`
- Test leads were cleared after validation
- LaunchAgent is installed and running:
  - label: `com.firstclassremodelingtx.sales-assistant`
  - plist: `launchd/com.firstclassremodelingtx.sales-assistant.plist`

## What It Does

- Recommends remodeling services from the real First Class Remodeling TX catalog
- Gives ballpark investment ranges
- Captures lead info
- Saves qualified leads locally
- Has prompt and workflow spec ready for future `n8n` and `Ollama`
- Client-facing experience is text chat only, not voice
- The visible personality is now `Project Advisor`, not `sales assistant`
- Replies should be in English, short, warm, human and not overly salesy
- The advisor should ask only one short question at a time

## Important Files

- `assistant_server.py`
- `catalog/services.json`
- `catalog/services.csv`
- `prompts/system_prompt.md`
- `workflow/WORKFLOW_SPEC.md`
- `static/index.html`
- `static/app.js`
- `data/leads.jsonl`
- `../MARKETING_PLAYBOOK.md`
- `../MARKETING_EXECUTION_NEXT.md`
- `../FACEBOOK_ACCESS_AUDIT.md`

## Product Decisions From Today

- The user does not want the assistant to sound like a salesman
- The assistant should feel more like a friendly project advisor
- The tone should be good-vibes, helpful, concise and human
- The current opening is short and casual
- The assistant should not dump long paragraphs
- Clients in San Antonio should see English responses
- The assistant can still parse some Spanish keywords internally if needed, but visible output is English
- A client-side version is now embedded locally into `../index.html`
- The homepage integration adds:
  - hero CTA
  - floating button
  - modal advisor
  - estimate-form prefill
  - WhatsApp handoff
- Live publish is still not confirmed

## How It Should Behave

- Example opening:
  - `Hi, I'm your First Class project advisor. What are you thinking about remodeling?`
- Example short response style:
  - confirm likely fit
  - mention ballpark range
  - lightly mention credibility
  - ask one short next question
- Good example:
  - `That sounds like a good fit for Custom Kitchens. Most projects in that range land around $25,000 - $80,000+, depending on layout and finishes. We've been doing this in San Antonio for 15+ years. What name should I put on the estimate?`

## How To Test

1. Open `http://127.0.0.1:8791`
2. Type a message like:
   - `I want a kitchen remodel in Stone Oak and my budget is around $50,000.`
3. Expected behavior:
   - English reply
   - short and warm tone
   - one follow-up question
   - lead details update in the right-side snapshot
4. Qualified leads are stored in `data/leads.jsonl`

## Website Integration Status

- The advisor logic exists in two forms:
  - local standalone app in this folder
  - client-side embedded version in `../index.html`
- It is now integrated into `/Users/cashamerica/FirstClassRemodelingTX/index.html`
- The next product step is to publish and verify the homepage integration live
- Recommended UI direction:
  - floating button bottom-right
  - label like `Talk to a Project Advisor`
  - opens a modal or slide-in chat panel

## Known Blockers

- `n8n` is not installed because this machine does not currently have Node.js
- `Ollama` is installed but crashes on launch with a local MLX runtime error

## Next Useful Steps

1. Publish and verify the homepage advisor integration live
2. Keep tuning the tone so it feels high-trust and warm for San Antonio homeowners
3. Install Node.js locally
4. Install and run `n8n`
5. Import the flow described in `workflow/WORKFLOW_SPEC.md`
6. Repair `Ollama` or switch to another local/remote compatible model

## Marketing Strategy Files

- `../MARKETING_PLAYBOOK.md` contains:
  - positioning
  - voice
  - ideal customer types
  - offers
  - objections
  - content pillars
  - funnel
  - advisor role
  - paid ad angles
- `../MARKETING_EXECUTION_NEXT.md` contains:
  - what to build next
  - why the advisor embed is the best next move
- `../FACEBOOK_ACCESS_AUDIT.md` contains:
  - page handle
  - page ID
  - token renewal note
  - what was and was not found in browser/project storage

## Notes

- No secrets are stored in this handoff
- If `launchd` is installed, logs should live in:
  - `launchd.stdout.log`
  - `launchd.stderr.log`

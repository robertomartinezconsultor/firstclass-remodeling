# CLAUDE.md — First Class Remodeling TX

## Proyecto
Portal de clientes y admin para First Class Remodeling TX, empresa de remodelación en San Antonio TX.
Dueño: Roberto Martinez. Admin: Roberto + Joe.

## Servidor
- IP: 159.203.143.156
- SSH: `ssh -p 2222 root@159.203.143.156`
- Archivos portal: `/opt/fcr-portal/`
- API portal: FastAPI en puerto 8085 (fcr-portal-api service)
- Nginx: puerto 443 → client-portal.html, /admin → portal-admin.html, /api/ → proxy :8085

## Archivos clave
- `/opt/fcr-portal/client-portal.html` — Portal cliente (~150KB, single file)
- `/opt/fcr-portal/portal-admin.html` — Portal admin (~110KB, single file)
- `/opt/fcr-portal/api.py` — Backend FastAPI (Joe AI, login, projects, weather, admin-login)
- `/opt/fcr-portal/sub.html` — Vista sub-contractor

## Sitio web principal
- Carpeta local: `/Users/cashamerica/FirstClassRemodelingTX/`
- Live: https://firstclassremodelingtx.com
- Repo live: robertomartinezconsultor/firstclass-remodeling
- Email público: estimates@firstclassremodelingtx.com

## Branding
- Fondo: #050507 (negro profundo)
- Acento: #D4AF37 (dorado), gradiente: #C9A84C → #E8D48B → #D4AF37 → #B8942E
- Font títulos: Georgia, Times New Roman, serif
- Font body: -apple-system, BlinkMacSystemFont, sans-serif
- Logo: F serif dorada con anillo metálico 3D
- Estilo: premium dark, minimalista, iOS-feel

## Firebase
- Project: firstclass-portal
- Collections: projects (subcollections: phases, photos, payments, updates, messages, changeOrders)
- Write secret: FCR_WRITE_2026
- Demo login: DEMO-KIT-2026

## Reglas CRÍTICAS
- NO usar frameworks (React, Vue, Angular) — todo es vanilla JS/HTML/CSS
- Los portales son single-file HTML (CSS + JS inline)
- Deploy: SCP al servidor, nginx sirve directamente
- Roberto NO quiere parches — rewrite limpio o no tocar
- Todo debe verse perfecto en iPhone Y laptop
- 0 APIs de pago
- Si algo funciona NO LO TOQUES — agregar features en archivos separados si es posible
- SIEMPRE hacer backup antes de editar: cp archivo archivo.bak
- Probar localmente en el servidor antes de declarar "listo"
- El cliente es "un contratista un poco tonto" — UI ultra simple

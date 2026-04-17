/* FCR — bilingual EN/ES dictionary + toggle. Sprint 3.
   - Strings with key data-i18n="section.key" swap on lang change.
   - Persists choice in localStorage, respects navigator.language on first visit.
   - Uses View Transitions API when available (smooth swap), falls back to instant. */

const FCR_DICT = {
  // Header nav
  'nav.services':      { en: 'Services',            es: 'Servicios' },
  'nav.gallery':       { en: 'Gallery',             es: 'Galería' },
  'nav.blog':          { en: 'Blog',                es: 'Blog' },
  'nav.estimate':      { en: 'Free Estimate',       es: 'Cotización gratis' },
  'nav.portal':        { en: 'Client Portal',       es: 'Portal del cliente' },
  'nav.contact':       { en: 'Contact / Free Estimate', es: 'Contacto / Cotización' },
  'nav.photos':        { en: 'Photo Gallery',       es: 'Galería de fotos' },
  'nav.guides':        { en: 'Blog & Pricing Guides', es: 'Blog y guías de precios' },

  // Hero
  'hero.eyebrow':      { en: 'San Antonio · 15+ Years · Licensed TX · Bilingual',
                         es: 'San Antonio · 15+ años · Licencia TX · Bilingüe' },
  'hero.h1a':          { en: 'Remodeling that feels<br>planned &mdash; and finished <em>cleaner</em>.',
                         es: 'Remodelaciones <br>planeadas al detalle &mdash; y acabadas <em>como se debe</em>.' },
  'hero.h1b':          { en: 'Kitchen &amp; bath remodels.<br>On schedule. On budget. <em>Bilingual</em>.',
                         es: 'Cocinas y baños.<br>A tiempo. En presupuesto. <em>Bilingüe</em>.' },
  'hero.sub':          { en: 'Custom kitchens, baths, outdoor living, and whole-home remodels. Licensed Texas contractor. Bilingual crews. Owner supervises every job.',
                         es: 'Cocinas a medida, baños, exteriores y remodelaciones completas. Contratista con licencia en Texas. Cuadrillas bilingües. El dueño supervisa cada obra.' },
  'hero.cta.primary':  { en: 'Get a free estimate', es: 'Cotización gratis' },
  'hero.cta.phone':    { en: 'Talk to Roberto · (210) 606-5298',
                         es: 'Habla con Roberto · (210) 606-5298' },
  'hero.trust.1':      { en: 'Licensed &amp; insured in Texas',
                         es: 'Licencia y seguro en Texas' },
  'hero.trust.2':      { en: 'Free in-home estimates',
                         es: 'Cotización gratis a domicilio' },
  'hero.trust.3':      { en: 'Google rated · bilingual crew',
                         es: 'Calificado en Google · equipo bilingüe' },
  'hero.trust.4':      { en: 'San Antonio &amp; surrounding TX',
                         es: 'San Antonio y alrededores TX' },

  // Services
  'svc.tag':           { en: 'What We Build',       es: 'Lo que construimos' },
  'svc.headline':      { en: 'Every project.<br>Every room.',
                         es: 'Cada proyecto.<br>Cada cuarto.' },
  'svc.lead':          { en: 'From the kitchen to the backyard &mdash; complete remodeling services for San Antonio homeowners.',
                         es: 'De la cocina al patio &mdash; servicios completos de remodelación para San Antonio.' },
  'svc.kitchen.h':     { en: 'Kitchen Remodel',     es: 'Remodelación de cocina' },
  'svc.kitchen.p':     { en: 'Custom cabinetry, quartz counters, islands, backsplash, and full kitchen rebuilds &mdash; finished clean, inspected, documented.',
                         es: 'Gabinetes a medida, cubiertas de cuarzo, islas, backsplash y reconstrucciones completas &mdash; acabado limpio, inspeccionado, documentado.' },
  'svc.kitchen.link':  { en: 'See kitchen work',    es: 'Ver trabajo de cocina' },
  'svc.bath.h':        { en: 'Bathroom Remodel',    es: 'Remodelación de baño' },
  'svc.bath.p':        { en: 'Walk-in showers, tub-to-shower conversions, double vanities, full master bath rebuilds with waterproofed substrate and tighter grout lines.',
                         es: 'Duchas sin puerta, conversión de tina a ducha, tocadores dobles, reconstrucción total de baño principal con impermeabilización y mejor acabado de lechada.' },
  'svc.bath.link':     { en: 'See bathroom work',   es: 'Ver trabajo de baño' },
  'svc.outdoor.h':     { en: 'Outdoor Kitchen &amp; BBQ', es: 'Cocina exterior y BBQ' },
  'svc.outdoor.p':     { en: 'Custom BBQ islands, built-in grills, outdoor bars, and covered outdoor kitchens designed for San Antonio heat and rain.',
                         es: 'Islas de BBQ a medida, parrillas empotradas, barras exteriores y cocinas techadas diseñadas para el calor y lluvia de San Antonio.' },
  'svc.outdoor.link':  { en: 'See outdoor work',    es: 'Ver trabajo exterior' },
  'svc.patio.h':       { en: 'Patios &amp; Covered Porches', es: 'Patios y porches techados' },
  'svc.patio.p':       { en: 'Covered patios, pergolas, concrete, and tile. Extend the living space outward without compromising drainage or shade planning.',
                         es: 'Patios techados, pérgolas, concreto y tile. Amplía el espacio sin comprometer drenaje ni sombra.' },
  'svc.patio.link':    { en: 'See patio work',      es: 'Ver trabajo de patio' },
  'svc.add.h':         { en: 'Home Additions',      es: 'Ampliaciones' },
  'svc.add.p':         { en: 'New rooms, sunrooms, garage conversions, full structural additions. Permits, inspections, and framing handled in-house.',
                         es: 'Cuartos nuevos, solariums, conversión de garaje, ampliaciones estructurales completas. Permisos, inspecciones y estructura manejados por nosotros.' },
  'svc.add.link':      { en: 'See additions',       es: 'Ver ampliaciones' },
  'svc.floor.h':       { en: 'Flooring',            es: 'Pisos' },
  'svc.floor.p':       { en: 'Hardwood, luxury vinyl plank, large-format porcelain tile, stone. Subfloor prep checked before anything gets laid.',
                         es: 'Madera, vinil de lujo, porcelanato gran formato, piedra. Revisamos el subsuelo antes de instalar.' },
  'svc.floor.link':    { en: 'See flooring work',   es: 'Ver trabajo de pisos' },
  'svc.cta.estimate':  { en: 'Get a Free Estimate', es: 'Cotización gratis' },
  'svc.cta.gallery':   { en: 'View Photo Gallery',  es: 'Ver galería de fotos' },

  // Why us
  'why.tag':           { en: 'Why First Class',     es: 'Por qué First Class' },
  'why.headline':      { en: 'Built on trust.<br>Delivered on time.',
                         es: 'Construido con confianza.<br>Entregado a tiempo.' },
  'why.1.h':           { en: 'Licensed &amp; Insured', es: 'Licencia y seguro' },
  'why.1.p':           { en: 'Full Texas contractor license and insurance on every project. We pull all permits.',
                         es: 'Licencia de contratista de Texas y seguro completo en cada proyecto. Nosotros sacamos los permisos.' },
  'why.2.h':           { en: 'In-Home Estimates',   es: 'Cotización a domicilio' },
  'why.2.p':           { en: 'No charge, no pressure. Detailed written quote within 24&ndash;48 hours of your visit.',
                         es: 'Sin costo, sin presión. Cotización escrita detallada dentro de 24&ndash;48 horas después de la visita.' },
  'why.3.h':           { en: 'Google Rating',       es: 'Calificación Google' },
  'why.3.p':           { en: 'Consistent top-rated reviews from homeowners across San Antonio and surrounding areas.',
                         es: 'Reseñas de alta calificación consistentes de dueños en San Antonio y alrededores.' },
  'why.4.h':           { en: 'Client Portal',       es: 'Portal del cliente' },
  'why.4.p':           { en: 'Track your project live &mdash; photos, timeline, docs, and updates from your phone.',
                         es: 'Sigue tu proyecto en vivo &mdash; fotos, cronograma, documentos y actualizaciones desde tu teléfono.' },

  // Real projects / testimonials
  'prj.tag':           { en: 'Real projects',       es: 'Proyectos reales' },
  'prj.headline':      { en: 'What homeowners say<br>after the dust settles.',
                         es: 'Lo que dicen los dueños<br>cuando se asienta el polvo.' },
  'prj.lead':          { en: 'Four recent remodels across San Antonio. Names shortened, neighborhoods named, photos available on request.',
                         es: 'Cuatro remodelaciones recientes en San Antonio. Nombres abreviados, barrios mencionados, fotos a solicitud.' },
  'prj.1.who':         { en: 'A.H. · Stone Oak',     es: 'A.H. · Stone Oak' },
  'prj.1.proj':        { en: 'Master bath remodel · 3 weeks', es: 'Remodelación de baño principal · 3 semanas' },
  'prj.1.quote':       { en: 'Everything showed up when Roberto said it would. The tile lines came out tighter than our old bath, and the jobsite was clean every night. That is what we were paying for and that is what we got.',
                         es: 'Todo llegó cuando Roberto dijo que iba a llegar. La lechada del azulejo quedó más derecha que la del baño viejo, y la obra limpia cada noche. Eso es por lo que pagamos y eso fue lo que recibimos.' },
  'prj.2.who':         { en: 'M.R. · Helotes',       es: 'M.R. · Helotes' },
  'prj.2.proj':        { en: 'Kitchen & island rebuild · 5 weeks', es: 'Reconstrucción de cocina e isla · 5 semanas' },
  'prj.2.quote':       { en: 'They found three things the previous contractor would have buried under drywall. We are glad we waited for First Class. Bilingual crew made my parents feel at home through the work.',
                         es: 'Encontraron tres cosas que el contratista anterior habría tapado con tablaroca. Qué bueno que esperamos a First Class. La cuadrilla bilingüe hizo que mis papás se sintieran en casa durante la obra.' },
  'prj.3.who':         { en: 'J.&C.P. · Boerne',     es: 'J. y C.P. · Boerne' },
  'prj.3.proj':        { en: 'Outdoor kitchen & covered patio · 6 weeks', es: 'Cocina exterior y patio techado · 6 semanas' },
  'prj.3.quote':       { en: 'The patio cover handles the afternoon sun exactly the way Roberto said it would. That level of detail is why we are already planning phase two with them.',
                         es: 'El techo del patio maneja el sol de la tarde exactamente como Roberto dijo. Ese nivel de detalle es por lo que ya estamos planeando la fase dos con ellos.' },
  'prj.4.who':         { en: 'L.T. · Shavano Park',  es: 'L.T. · Shavano Park' },
  'prj.4.proj':        { en: 'Whole-home refresh · 9 weeks', es: 'Remodelación completa · 9 semanas' },
  'prj.4.quote':       { en: 'Written scope, written change orders, nothing surprising on the final invoice. In remodeling, that counts as magic.',
                         es: 'Alcance por escrito, órdenes de cambio por escrito, nada raro en la factura final. En remodelación, eso cuenta como magia.' },
  'prj.stat.1':        { en: 'Years in San Antonio', es: 'Años en San Antonio' },
  'prj.stat.2':        { en: 'Projects completed',   es: 'Proyectos completados' },
  'prj.stat.3':        { en: 'Google rating',        es: 'Calificación Google' },
  'prj.stat.4':        { en: 'BBB accredited',       es: 'Acreditado BBB' },
  'par.label':         { en: 'Materials & trust',    es: 'Materiales y confianza' },

  // CTA section
  'cta.headline':      { en: 'Ready to start your project?', es: '¿Listo para empezar?' },
  'cta.lead':          { en: "Free in-home estimate. We'll walk through your space, talk through the scope, and send a detailed written quote within 24&ndash;48 hours.",
                         es: 'Cotización gratis a domicilio. Recorremos el espacio, hablamos del alcance y te mandamos cotización escrita detallada en 24&ndash;48 horas.' },

  // FAQ
  'faq.tag':           { en: 'Common Questions',    es: 'Preguntas frecuentes' },
  'faq.headline':      { en: 'FAQ',                 es: 'Preguntas frecuentes' },

  // Toggle button label
  'lang.toggle':       { en: 'ES',                  es: 'EN' },
  'lang.toggleAria':   { en: 'Cambiar a español',   es: 'Switch to English' }
};

(function(){
  const KEY = 'fcr_lang';

  function detect() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'en' || saved === 'es') return saved;
      const n = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
      return n.startsWith('es') ? 'es' : 'en';
    } catch(e) { return 'en'; }
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      const entry = FCR_DICT[k];
      if (!entry) return;
      const val = entry[lang] || entry.en;
      // Preserve child SVG icons by storing them once and re-appending.
      const kids = Array.from(el.children).filter(c => c.tagName === 'SVG');
      el.innerHTML = val;
      kids.forEach(svg => {
        // re-append leading or trailing icons based on original position not tracked;
        // by convention, SVG icons with class "ico" live at the START of CTAs.
        if (svg.classList.contains('ico')) el.insertBefore(svg, el.firstChild);
      });
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      const pairs = el.getAttribute('data-i18n-attr').split(';');
      pairs.forEach(pair => {
        const [attr, key] = pair.split(':');
        const entry = FCR_DICT[key.trim()];
        if (entry) el.setAttribute(attr.trim(), entry[lang] || entry.en);
      });
    });
    const tog = document.getElementById('langToggle');
    if (tog) {
      tog.textContent = FCR_DICT['lang.toggle'][lang];
      tog.setAttribute('aria-label', FCR_DICT['lang.toggleAria'][lang]);
    }
    try { localStorage.setItem(KEY, lang); } catch(e){}
    if (window.fcrPushEvent) window.fcrPushEvent('lang_change', { lang });
  }

  function swap(lang) {
    if (document.startViewTransition) {
      document.startViewTransition(() => apply(lang));
    } else {
      apply(lang);
    }
  }

  window.fcrSetLang = swap;

  document.addEventListener('DOMContentLoaded', () => {
    const tog = document.getElementById('langToggle');
    if (tog) {
      tog.addEventListener('click', () => {
        const cur = document.documentElement.lang === 'es' ? 'es' : 'en';
        swap(cur === 'es' ? 'en' : 'es');
      });
    }
    apply(detect());
  });
})();

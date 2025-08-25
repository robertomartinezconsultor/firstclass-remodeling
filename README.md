<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Services | First Class Remodeling – Quality & Investor Remodeling in San Antonio</title>
  <meta name="description" content="Kitchen, bath and whole-home remodeling built to last. Investor services (Fix & Flip, BRRRR). Designed for San Antonio homeowners and real estate investors who want quality and clear ROI." />
  <meta property="og:title" content="Services | First Class Remodeling" />
  <meta property="og:description" content="Kitchen, bath and whole-home remodeling built to last. Investor services (Fix & Flip, BRRRR). San Antonio, TX." />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />
  <link rel="icon" href="logofirstclass.jpg" />

  <!-- Tailwind via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    /* Brand palette (psychology: trust, growth, quality) */
    :root{
      --color-primary:#0f172a; /* deep navy */
      --color-secondary:#006d5b; /* teal/emerald */
      --color-accent:#c9a341; /* soft gold */
      --color-text:#0f172a;
      --color-bg:#f8fafc;
    }

    /* Language helpers: show only one language */
    body.hidden-es .es { display: none !important; } /* default EN visible */
    body.hidden-en .en { display: none !important; }

    /* Simple utilities */
    .btn-primary{
      background:var(--color-secondary); color:#fff; font-weight:600;
      border-radius:9999px; padding:.75rem 1.25rem;
      transition:.2s ease-in-out;
    }
    .btn-primary:hover{ filter:brightness(.95); }
    .btn-outline{
      background:#fff; color:var(--color-text); font-weight:600;
      border-radius:9999px; padding:.75rem 1.25rem; border:1px solid #e2e8f0;
    }
    .badge{
      display:inline-block; padding:.25rem .6rem; border-radius:9999px;
      background:rgba(201,163,65,.14); color:var(--color-accent); font-weight:600; font-size:.75rem;
    }
    .card{
      background:#fff; border:1px solid #e2e8f0; border-radius:1.5rem;
      overflow:hidden; box-shadow:0 1px 2px rgba(0,0,0,.04);
    }
    .hero-overlay{
      background:linear-gradient(to top, rgba(15,23,42,.85), rgba(15,23,42,.35));
    }
  </style>
</head>

<!-- EN as default (hide Spanish) -->
<body class="hidden-es bg-[var(--color-bg)] text-[var(--color-text)]">

  <!-- Sticky contact / language -->
  <div class="sticky top-0 z-50 border-b border-slate-200 backdrop-blur"
       style="background:rgba(255,255,255,.85)">
    <div class="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
      <div class="font-medium">
        <span class="en">San Antonio Remodeling & Investments</span>
        <span class="es">Remodelación y Inversiones en San Antonio</span>
      </div>
      <div class="flex items-center gap-3">
        <a href="tel:+12106065298"
           class="px-3 py-1 rounded-full text-white"
           style="background:var(--color-secondary)">
          (210) 606-5298
        </a>
        <button id="langToggle" type="button"
                class="px-3 py-1 rounded-full border border-slate-300 bg-white">
          <span class="en">ES</span><span class="es">EN</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Nav -->
  <header class="bg-white">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="index.html" class="flex items-center gap-3">
        <img src="logofirstclass.jpg" alt="First Class Remodeling logo"
             class="h-10 md:h-12 w-auto rounded-md object-contain" />
        <span class="sr-only">First Class Remodeling</span>
      </a>
      <nav class="hidden md:flex items-center gap-6 font-medium">
        <a href="index.html" class="text-slate-600 hover:text-slate-900">Home</a>
        <a href="services.html" class="text-[var(--color-secondary)] font-semibold">Services</a>
        <a href="portfolio.html" class="text-slate-600 hover:text-slate-900">Portfolio</a>
        <a href="about.html" class="text-slate-600 hover:text-slate-900">About</a>
        <a href="roi.html" class="text-slate-600 hover:text-slate-900">ROI</a>
        <a href="blog.html" class="text-slate-600 hover:text-slate-900">Blog</a>
        <a href="#contact" class="btn-primary">Contact</a>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section class="relative">
    <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&q=80&w=1600"
         alt="Kitchen renovation with custom cabinetry"
         class="w-full h-[58vh] md:h-[68vh] object-cover" loading="lazy">
    <div class="absolute inset-0 hero-overlay"></div>
    <div class="absolute inset-0">
      <div class="max-w-5xl mx-auto px-4 h-full flex flex-col justify-end pb-10">
        <span class="badge mb-3">SERVICES</span>
        <h1 class="text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight drop-shadow">
          <span class="en">Kitchen, Bath & Whole-Home Remodeling Built to Last</span>
          <span class="es">Cocinas, Baños y Remodelaciones Integrales hechas para durar</span>
        </h1>
        <p class="text-white/90 mt-4 text-lg md:text-xl max-w-3xl">
          <span class="en">Thoughtful design, durable materials and professional craftsmanship—so your home looks great and works beautifully every day.</span>
          <span class="es">Diseño pensado, materiales duraderos y mano de obra profesional—para que tu hogar luzca y funcione perfecto día a día.</span>
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <a href="#contact" class="btn-primary">
            <span class="en">Request a consultation</span>
            <span class="es">Solicitar consulta</span>
          </a>
          <a href="portfolio.html" class="btn-outline">
            <span class="en">See our work</span>
            <span class="es">Ver proyectos</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Services grid -->
  <section class="py-16">
    <div class="max-w-7xl mx-auto px-4">
      <div class="mb-10">
        <h2 class="text-3xl md:text-4xl font-bold">
          <span class="en">Our Services</span>
          <span class="es">Nuestros Servicios</span>
        </h2>
        <p class="text-slate-600 mt-3 max-w-3xl">
          <span class="en">We focus on high-quality remodeling with clear timelines and transparent budgets for homeowners and investors.</span>
          <span class="es">Nos enfocamos en remodelaciones de alta calidad con tiempos y presupuestos claros para propietarios e inversionistas.</span>
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Kitchens -->
        <div class="card">
          <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1200"
               alt="Kitchen renovation with stone countertops" class="h-40 w-full object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="text-xl font-semibold">
              <span class="en">Kitchen Renovations</span><span class="es">Remodelación de Cocinas</span>
            </h3>
            <p class="text-slate-600 mt-2">
              <span class="en">Custom layouts, durable finishes and efficient storage—built for everyday cooking and hosting.</span>
              <span class="es">Diseños personalizados, acabados duraderos y almacenamiento eficiente—pensado para cocinar y recibir.</span>
            </p>
          </div>
        </div>

        <!-- Bathrooms -->
        <div class="card">
          <img src="https://images.unsplash.com/photo-1584624271550-3f8266b5a7d4?auto=format&fit=crop&q=80&w=1200"
               alt="Bathroom with tile shower and vanity" class="h-40 w-full object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="text-xl font-semibold">
              <span class="en">Bathroom Upgrades</span><span class="es">Mejoras de Baño</span>
            </h3>
            <p class="text-slate-600 mt-2">
              <span class="en">Modern fixtures, smart layouts and easy-to-maintain materials for a calm, functional space.</span>
              <span class="es">Accesorios modernos, distribuciones inteligentes y materiales fáciles de mantener para un baño funcional.</span>
            </p>
          </div>
        </div>

        <!-- Whole-home -->
        <div class="card">
          <img src="https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&q=80&w=1200"
               alt="Living room whole-home remodel" class="h-40 w-full object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="text-xl font-semibold">
              <span class="en">Whole-Home Remodeling</span><span class="es">Remodelaciones Integrales</span>
            </h3>
            <p class="text-slate-600 mt-2">
              <span class="en">Cohesive design across rooms, improved flow and durable materials for long-term value.</span>
              <span class="es">Diseño cohesivo entre espacios, mejor circulación y materiales duraderos para valor a largo plazo.</span>
            </p>
          </div>
        </div>

        <!-- Additions -->
        <div class="card">
          <img src="https://images.unsplash.com/photo-1600573472591-ee6c8e695b32?auto=format&fit=crop&q=80&w=1200"
               alt="Home addition exterior" class="h-40 w-full object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="text-xl font-semibold">
              <span class="en">Home Additions</span><span class="es">Ampliaciones</span>
            </h3>
            <p class="text-slate-600 mt-2">
              <span class="en">Add bedrooms, expand living areas or create a dedicated office with permitting handled end-to-end.</span>
              <span class="es">Agrega recámaras, amplía áreas sociales o crea una oficina dedicada, con trámites incluidos de principio a fin.</span>
            </p>
          </div>
        </div>

        <!-- Investors: Fix & Flip -->
        <div class="card">
          <img src="https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=1200"
               alt="Investor-focused renovation planning" class="h-40 w-full object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="text-xl font-semibold">
              <span class="en">Fix & Flip</span><span class="es">Fix & Flip</span>
            </h3>
            <p class="text-slate-600 mt-2">
              <span class="en">Targeted upgrades to maximize sale price and speed, protecting timelines and budget.</span>
              <span class="es">Mejoras enfocadas para maximizar precio de venta y velocidad, cuidando tiempos y presupuesto.</span>
            </p>
          </div>
        </div>

        <!-- Investors: BRRRR -->
        <div class="card">
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200"
               alt="Rental-ready renovation" class="h-40 w-full object-cover" loading="lazy">
          <div class="p-5">
            <h3 class="text-xl font-semibold">
              <span class="en">BRRRR Upgrades</span><span class="es">Mejoras BRRRR</span>
            </h3>
            <p class="text-slate-600 mt-2">
              <span class="en">Durable materials and tenant-proof finishes that help stabilize rents and appraisal value.</span>
              <span class="es">Materiales duraderos y acabados resistentes para estabilizar rentas y valor de tasación.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section id="contact" class="py-16 bg-white border-t border-slate-200">
    <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h3 class="text-2xl md:text-3xl font-bold">
          <span class="en">Let’s plan your project</span>
          <span class="es">Planeemos tu proyecto</span>
        </h3>
        <p class="text-slate-600 mt-3">
          <span class="en">Tell us about your goals and timeline. We’ll recommend a smart scope and a clear path to value.</span>
          <span class="es">Cuéntanos tus metas y tiempos. Te proponemos un alcance inteligente y una ruta clara hacia el valor.</span>
        </p>
        <div class="mt-4 flex flex-wrap gap-3">
          <a href="tel:+12106065298" class="btn-primary">(210) 606-5298</a>
          <a href="portfolio.html" class="btn-outline">
            <span class="en">View Portfolio</span><span class="es">Ver Portafolio</span>
          </a>
        </div>
      </div>
      <form action="https://formspree.io/f/yourid" method="POST"
            class="card p-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-slate-600">Name / Nombre</label>
            <input name="name" class="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2" required>
          </div>
          <div>
            <label class="text-sm text-slate-600">Email</label>
            <input type="email" name="email" class="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2" required>
          </div>
          <div class="md:col-span-2">
            <label class="text-sm text-slate-600">
              <span class="en">Project Type</span><span class="es">Tipo de Proyecto</span>
            </label>
            <select name="project" class="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2">
              <option>Kitchen</option>
              <option>Bathroom</option>
              <option>Whole-Home</option>
              <option>Additions</option>
              <option>Fix & Flip</option>
              <option>BRRRR</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="text-sm text-slate-600">
              <span class="en">Message</span><span class="es">Mensaje</span>
            </label>
            <textarea name="message" rows="4" class="w-full mt-1 rounded-xl border border-slate-300 px-3 py-2"></textarea>
          </div>
        </div>
        <button type="submit" class="btn-primary mt-4 w-full">
          <span class="en">Send</span><span class="es">Enviar</span>
        </button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-10" style="background:var(--color-primary); color:#cbd5e1;">
    <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
      <div>&copy; <span id="year"></span> First Class Remodeling · San Antonio, TX</div>
      <div class="flex gap-4">
        <a href="https://www.facebook.com/firstclassremodelingsatx" class="underline" target="_blank" rel="noopener">Facebook</a>
        <a href="roi.html" class="underline">ROI</a>
        <a href="blog.html" class="underline">Blog</a>
      </div>
    </div>
  </footer>

  <script>
    // Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Language toggle with persistence
    (function(){
      try{
        var saved = localStorage.getItem('fcr_lang') || 'en';
        function apply(lang){
          document.body.classList.toggle('hidden-es', lang === 'en');
          document.body.classList.toggle('hidden-en', lang === 'es');
        }
        document.addEventListener('DOMContentLoaded', function(){
          apply(saved);
          var t=document.getElementById('langToggle');
          if(t){ t.addEventListener('click',function(){
            saved = (document.body.classList.contains('hidden-es') ? 'es' : 'en');
            localStorage.setItem('fcr_lang', saved);
            apply(saved);
          });}
        });
      }catch(e){}
    })();
  </script>
</body>
</html>

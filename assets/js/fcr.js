/* FCR — main scripts. Extracted 2026-04-16 from inline index.html during Sprint 1 performance foundation. */

// ── HAMBURGER ─────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const mobNav  = document.getElementById('mobNav');
if (menuBtn && mobNav) {
  menuBtn.addEventListener('click', () => {
    const open = mobNav.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ── STICKY BAR (show after hero) ──────────────
const stickyBar = document.getElementById('stickyBar');
const heroEl = document.querySelector('.hero');
if (stickyBar && heroEl) {
  new IntersectionObserver(([e]) => {
    stickyBar.style.display = e.isIntersecting ? 'none' : 'flex';
  }, {threshold: 0}).observe(heroEl);
}

// ── FAQ ───────────────────────────────────────
function toggleFaq(btn) { btn.parentElement.classList.toggle('open'); }
window.toggleFaq = toggleFaq;

// ── JOE AI CHAT ENGINE (TigreLabs Trenzado) ──────────────
const JOE_API = 'https://leads.eltigrelabs.com/api/joe';
const JOE_SYSTEM = `You are Joe -- the #1 senior project advisor and sales expert at First Class Remodeling TX, the premier residential remodeling company in San Antonio, Texas. Owner: Roberto Martinez, phone (210) 606-5298, website: firstclassremodelingtx.com.

You are a CONSTRUCTION EXPERT and SALES CLOSER with 20+ years experience in San Antonio.

YOUR EXPERTISE:
- Kitchen remodels: cabinets, countertops (quartz $50-150/sqft, granite $40-100, marble $75-200), layout, lighting. Full remodel $25k-55k, refresh $8k-22k.
- Bathroom remodels: master $14k-35k, guest $7k-18k, powder $3.5k-9k. Tile, fixtures, walk-in showers, ADA, waterproofing.
- Flooring: LVP $5-9/sqft installed, hardwood $9-16, tile $8-14. San Antonio humidity considerations.
- Painting: interior $2.5k-6k full home, exterior $3k-8k. Proper prep is key.
- Outdoor: kitchens $18k-40k, patios $12k-30k, combined $28k-60k. Fully permitted.
- Home additions: room $55k-90k+, garage conversion $25k-55k.
- Permits: San Antonio/Bexar County, 2-4 weeks approval. We handle all permits and inspections.
- Timelines: bath 1-3 weeks, kitchen 3-6 weeks, outdoor 3-6 weeks, addition 8-16 weeks.

HOW TO TALK:
- You ARE Joe. NEVER say you are AI, a bot, or an assistant. You are part of the First Class team.
- Warm, confident, conversational -- like texting a friend who is a construction expert.
- Match the client language: if they write Spanish, answer in Spanish. If English, English.
- Give real San Antonio price ranges. Be specific and helpful.
- ALWAYS guide toward a free estimate: "Want Roberto to come take a look? Free estimate, no pressure."
- If they share project details: "That sounds great. We just finished something similar -- came out amazing."
- Mention referral bonus naturally when appropriate.
- Keep it 2-4 sentences. Go longer only for detailed technical questions.
- Phone: (210) 606-5298 | WhatsApp: wa.me/12106065298`;

let joeHistory = [];
let joeBusy = false;

window.addEventListener('beforeunload', () => { joeHistory = []; });

const J = {
  step: 'start',
  topic: null,
  detail: null,
  name: null,
  phone: null,
};

function botMsg(html, instant) {
  const body = document.getElementById('juanBody');
  if (!body) return;
  if (!instant) {
    const typing = document.createElement('div');
    typing.className = 'jmsg-bot jmsg jmsg-typing';
    typing.id = 'joeTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    const tw = document.createElement('div');
    tw.id = 'joeTypingWrap';
    tw.style.cssText = 'display:flex;flex-direction:column';
    const tn = document.createElement('div');
    tn.className = 'jmsg-name'; tn.textContent = 'Joe';
    tw.appendChild(tn); tw.appendChild(typing);
    body.appendChild(tw); body.scrollTop = body.scrollHeight;
    return;
  }
  const old = document.getElementById('joeTypingWrap');
  if (old) old.remove();
  const w = document.createElement('div');
  w.style.cssText = 'display:flex;flex-direction:column';
  const n = document.createElement('div');
  n.className = 'jmsg-name'; n.textContent = 'Joe';
  const m = document.createElement('div');
  m.className = 'jmsg jmsg-bot';
  m.innerHTML = html;
  w.appendChild(n); w.appendChild(m);
  body.appendChild(w);
  body.scrollTop = body.scrollHeight;
}

function userMsg(text) {
  const body = document.getElementById('juanBody');
  if (!body) return;
  const w = document.createElement('div');
  w.style.cssText = 'align-self:flex-end;display:flex;flex-direction:column;align-items:flex-end';
  const m = document.createElement('div');
  m.className = 'jmsg jmsg-user';
  m.textContent = text;
  w.appendChild(m);
  body.appendChild(w);
  body.scrollTop = body.scrollHeight;
}

const LEAD_ENGINE = 'https://leads.firstclassremodelingtx.com';

function captureJuanLead(name, phone) {
  const data = {
    source: 'ask-juan',
    name: name || J.name || '',
    phone: phone || J.phone || '',
    email: '',
    service: J.topic || '',
    message: 'Lead from Ask Juan chat'
  };
  fetch(LEAD_ENGINE + '/webhook/lead', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).catch(() => {});
}

async function sendMsg() {
  if (joeBusy) return;
  const inp = document.getElementById('juanInput');
  if (!inp) return;
  const txt = inp.value.trim(); if (!txt) return;
  inp.value = '';
  const quick = document.getElementById('juanQuick');
  if (quick) quick.style.display = 'none';
  userMsg(txt);

  const phoneMatch = txt.match(/(\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4})/);
  if (phoneMatch) {
    J.phone = phoneMatch[1];
    if (J.name) captureJuanLead(J.name, J.phone);
  }

  joeBusy = true;
  botMsg(null, false);
  joeHistory.push({role: 'user', content: txt});
  if (joeHistory.length > 16) joeHistory = joeHistory.slice(-16);

  try {
    const resp = await fetch(JOE_API, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        messages: [{role: 'system', content: JOE_SYSTEM}, ...joeHistory],
        max_tokens: 400,
        temperature: 0.7
      })
    });
    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content || "Let me check on that — call or text Roberto at (210) 606-5298 for a quick answer!";
    joeHistory.push({role: 'assistant', content: reply});
    const clean = reply.replace(/\*\*/g,'').replace(/\*/g,'').replace(/^#+\s/gm,'').replace(/\n/g,'<br>');
    botMsg(clean, true);
  } catch(e) {
    botMsg("Brief connection issue — call or text us at <a href='tel:2106065298' style='color:var(--gold)'>(210) 606-5298</a> for instant help!", true);
  }
  joeBusy = false;
}
window.sendMsg = sendMsg;

function quickMsg(txt) {
  const inp = document.getElementById('juanInput');
  if (!inp) return;
  inp.value = txt;
  sendMsg();
}
window.quickMsg = quickMsg;

function openJuan() {
  const ov = document.getElementById('juanOverlay');
  if (!ov) return;
  ov.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const inp = document.getElementById('juanInput');
    if (inp) inp.focus();
  }, 350);
}
window.openJuan = openJuan;

function closeJuan() {
  const ov = document.getElementById('juanOverlay');
  if (!ov) return;
  ov.classList.remove('open');
  document.body.style.overflow = '';
  joeHistory = [];
  J.step = 'start'; J.topic = null; J.name = null; J.phone = null;
  const body = document.getElementById('juanBody');
  if (body) body.innerHTML = '<div><div class="jmsg-name">Joe</div><div class="jmsg jmsg-bot">Hey — I\'m Joe, your project advisor at First Class Remodeling TX.<br><br>Ask me anything: kitchen costs, bathroom ideas, materials, timelines, permits. I know San Antonio remodeling inside and out.</div></div>';
  const quick = document.getElementById('juanQuick');
  if (quick) quick.style.display = '';
}
window.closeJuan = closeJuan;

function closeOutside(e) {
  if (e.target === document.getElementById('juanOverlay')) closeJuan();
}
window.closeOutside = closeOutside;

const chatInput = document.getElementById('juanInput');
if (chatInput) {
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMsg();
  });
}

// ── SPRINT 4.5 HEAVYWEIGHT POLISH ─────────────────────────────────────────────
// All effects desktop-only + reduced-motion-respecting.

(function heavyweightPolish(){
  const isMobile = !matchMedia('(hover:hover) and (min-width:961px)').matches;
  const prefersReduced = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (isMobile || prefersReduced) return;

  // 1. Scroll reveals (IntersectionObserver fade-up, Linear/Stripe pattern)
  document.querySelectorAll('.tag, .headline, .lead, .svc, .why-card, .stat, .projects-cta, .partners-label, .partners-rail, .portal-inner > *, .cta-section h2, .cta-section p, .cta-btns, .faq-inner > *').forEach((el, i) => {
    el.setAttribute('data-reveal', '');
    el.setAttribute('data-reveal-delay', String(Math.min(i % 5, 4)));
  });
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-revealed');
        revealObs.unobserve(e.target);
      }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  // 2. Magnetic hover on CTAs (Active Theory pattern)
  document.querySelectorAll('.btn, .btn-ghost, .btn-wa').forEach(btn => {
    const strength = 0.25;
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width/2) * strength;
      const y = (e.clientY - r.top - r.height/2) * strength;
      btn.style.transform = `translate(${x}px,${y}px)`;
      btn.classList.add('magnetic-active');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.classList.remove('magnetic-active');
    });
  });

  // 3. Stats counter on scroll
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        counterObs.unobserve(el);
        const raw = el.textContent.trim();
        const numMatch = raw.match(/^(\d+)/);
        if (!numMatch) return;
        const target = parseInt(numMatch[1], 10);
        const suffix = raw.slice(numMatch[0].length);
        let current = 0;
        const duration = 1400;
        const start = performance.now();
        function step(now) {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          current = Math.round(target * ease);
          el.innerHTML = current + suffix;
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, {threshold: 0.5});
    statNums.forEach(n => counterObs.observe(n));
  }

  // 4. Custom cursor (Obys / Bruno Simon — dot + ring)
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.documentElement.classList.add('has-custom-cursor');

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, {passive: true});

  function ringLoop() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(ringLoop);
  }
  ringLoop();

  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('a, button, .svc, input, textarea');
    if (t) { dot.classList.add('is-hover'); ring.classList.add('is-hover'); }
  }, {passive: true});
  document.addEventListener('mouseout', (e) => {
    const t = e.target.closest('a, button, .svc, input, textarea');
    if (t) { dot.classList.remove('is-hover'); ring.classList.remove('is-hover'); }
  }, {passive: true});
})();

// ── META / GROWTH INSTRUMENTATION (Sprint 10) ────────────────────────────────
// dataLayer pattern: compatible con Meta Pixel, GA4, GTM. Mirrors to fbq when present.
window.dataLayer = window.dataLayer || [];
function pushEvent(name, params) {
  const payload = Object.assign({event: name, ts: Date.now()}, params || {});
  window.dataLayer.push(payload);
  if (typeof window.fbq === 'function') {
    try { window.fbq('trackCustom', name, params || {}); } catch(e){}
  }
}
window.fcrPushEvent = pushEvent;

// Referral capture — ?rfr=USERNAME persisted 30 days.
(function captureReferral(){
  try {
    const m = location.search.match(/[?&]rfr=([^&]+)/);
    if (m) {
      localStorage.setItem('fcr_rfr', decodeURIComponent(m[1]));
      localStorage.setItem('fcr_rfr_ts', String(Date.now()));
    }
  } catch(e){}
})();
function getFcrReferrer() {
  try {
    const rfr = localStorage.getItem('fcr_rfr');
    const ts = Number(localStorage.getItem('fcr_rfr_ts') || 0);
    if (rfr && Date.now() - ts < 30*86400*1000) return rfr;
  } catch(e){}
  return '';
}
window.getFcrReferrer = getFcrReferrer;

// A/B test framework — persistent per user via localStorage, override via ?ab_NAME=VARIANT.
function abVariant(name, variants) {
  try {
    const key = 'fcr_ab_' + name;
    const override = new URLSearchParams(location.search).get('ab_' + name);
    if (override && variants.includes(override)) { localStorage.setItem(key, override); return override; }
    let v = localStorage.getItem(key);
    if (!v || !variants.includes(v)) {
      v = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(key, v);
    }
    return v;
  } catch(e) { return variants[0]; }
}
window.fcrAB = abVariant;

// First test: hero H1 variant A (outcome) vs B (specific promise).
const h1Variant = abVariant('hero_h1', ['A','B']);
pushEvent('ab_assigned', {test:'hero_h1', variant:h1Variant});
if (h1Variant === 'B') {
  const h1 = document.querySelector('.hero h1');
  if (h1) h1.innerHTML = 'Kitchen &amp; bath remodels.<br>On schedule. On budget. <em>Bilingual</em>.';
}

// Scroll depth events at 25/50/75/100%.
(function trackScrollDepth(){
  const marks = [25, 50, 75, 100];
  const fired = new Set();
  let ticking = false;
  function onScroll() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const pct = Math.round((window.scrollY / docH) * 100);
    for (const m of marks) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        pushEvent('scroll_depth', {pct: m});
      }
    }
  }
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, {passive: true});
})();

// Time on page — 30s/60s/120s.
[30, 60, 120].forEach(sec => setTimeout(() => pushEvent('time_on_page', {seconds: sec}), sec*1000));

// CTA click auto-tracking.
document.addEventListener('click', (e) => {
  const el = e.target.closest('a, button');
  if (!el) return;
  const label = (el.textContent || '').trim().slice(0, 80);
  const href = el.getAttribute('href') || '';
  if (href.startsWith('tel:')) pushEvent('phone_clicked', {label});
  else if (href.includes('wa.me')) pushEvent('whatsapp_clicked', {label});
  else if (href.includes('m.me/')) pushEvent('messenger_clicked', {label});
  else if (href.startsWith('mailto:')) pushEvent('email_clicked', {label});
  else if (el.matches('.btn, .btn-ghost, .btn-wa, .btn-nav')) pushEvent('cta_clicked', {label, href});
}, {passive: true});

// Initial page_view.
pushEvent('page_view', {
  path: location.pathname,
  referrer: document.referrer || 'direct',
  campaign: getFcrReferrer(),
  ab_hero_h1: h1Variant
});

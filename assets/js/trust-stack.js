/* Trust Stack loader — team, project map, breathing stats.
   Data-driven. Progressive enhancement: map falls back to list if Leaflet fails. */
(function(){
  'use strict';

  const DATA = {
    stats:    '/data/stats.json',
    team:     '/data/team.json',
    projects: '/data/projects-map.json'
  };

  // ── breathing stats ────────────────────────
  function renderStats(stats){
    document.querySelectorAll('[data-stat]').forEach(el => {
      const key = el.getAttribute('data-stat');
      if (stats[key] == null) return;
      const val = stats[key];
      if (typeof val === 'number') {
        animateNumber(el, val);
      } else {
        el.textContent = val;
      }
    });
  }

  function animateNumber(el, target){
    const dur = 900;
    const start = performance.now();
    function frame(now){
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ── team strip ─────────────────────────────
  function renderTeam(data){
    const strip = document.getElementById('teamStrip');
    if (!strip || !data.team) return;
    const html = data.team.map(m => {
      const meta = [m.years ? `${m.years}+ yrs` : null, m.bilingual ? 'EN • ES' : null].filter(Boolean).join(' · ');
      const photo = m.photo || '';
      return `
        <div class="team-card" role="listitem">
          <img src="${escapeHTML(photo)}" alt="${escapeHTML(m.name)}" loading="lazy" width="64" height="64" onerror="this.style.visibility='hidden'">
          <div class="tc-info">
            <span class="tc-name">${escapeHTML(m.name)}</span>
            <span class="tc-role">${escapeHTML(m.role)}</span>
            ${meta ? `<span class="tc-meta">${escapeHTML(meta)}</span>` : ''}
          </div>
        </div>`;
    }).join('');
    strip.innerHTML = html;
  }

  // ── project map ────────────────────────────
  function renderMapFallback(data){
    const list = document.getElementById('projectMapList');
    if (!list) return;
    list.innerHTML = data.projects.map(p => `
      <li><strong>${escapeHTML(p.neighborhood)} · ${p.zip}</strong>${escapeHTML(p.type)} · ${p.year}</li>
    `).join('');
  }

  function loadLeaflet(){
    return new Promise((resolve, reject) => {
      if (window.L) return resolve(window.L);
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      css.crossOrigin = '';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.onload = () => resolve(window.L);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function renderMap(data){
    const el = document.getElementById('projectMap');
    if (!el) return;
    renderMapFallback(data);
    try {
      const L = await loadLeaflet();
      const map = L.map(el, {
        center: [data.center.lat, data.center.lng],
        zoom: data.center.zoom || 10,
        scrollWheelZoom: false,
        attributionControl: true
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const goldIcon = L.divIcon({
        className: 'fcr-pin',
        html: '<span style="display:block;width:14px;height:14px;border-radius:50%;background:#d7b46c;border:2px solid #0a1018;box-shadow:0 0 0 4px rgba(215,180,108,.25)"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      data.projects.forEach(p => {
        L.marker([p.lat, p.lng], { icon: goldIcon })
          .addTo(map)
          .bindPopup(`<strong>${escapeHTML(p.neighborhood)} · ${p.zip}</strong><br>${escapeHTML(p.type)}<br><small>${p.year}</small>`);
      });
      el.setAttribute('data-loaded', 'true');
    } catch(err){
      console.warn('[trust-stack] Leaflet failed, using list fallback', err);
      el.setAttribute('data-loaded', 'fallback');
      el.style.display = 'none';
    }
  }

  // ── utils ──────────────────────────────────
  function escapeHTML(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  async function fetchJSON(url){
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + url);
    return r.json();
  }

  async function boot(){
    const hasTrustStack = document.getElementById('trust-stack');
    if (!hasTrustStack) return;

    const results = await Promise.allSettled([
      fetchJSON(DATA.stats),
      fetchJSON(DATA.team),
      fetchJSON(DATA.projects)
    ]);

    const [statsR, teamR, projR] = results;
    if (statsR.status === 'fulfilled') renderStats(statsR.value);
    if (teamR.status  === 'fulfilled') renderTeam(teamR.value);
    if (projR.status  === 'fulfilled') renderMap(projR.value);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

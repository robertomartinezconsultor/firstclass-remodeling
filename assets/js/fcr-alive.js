/* ============================================================
   FCR Alive — Tier 1 motion layer (vanilla, no deps)
   - Word-stagger hero reveal
   - Cursor spotlight on hero + why-section
   - IntersectionObserver stat counters
   - 3D tilt on service cards
   - Magnetic primary CTA
   - Scroll progress bar
   - Live activity pill (rotates recent projects)
   - Section reveal on scroll
   Respects prefers-reduced-motion and touch devices.
   ============================================================ */
(function(){
  'use strict';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TOUCH   = window.matchMedia && window.matchMedia('(hover: none)').matches;

  function ready(fn){
    // Run on window.load to guarantee i18n (DOMContentLoaded) already applied.
    if(document.readyState==='complete') fn();
    else window.addEventListener('load',fn,{once:true});
  }

  /* ---------- A11y: skip link + main landmark ---------- */
  function mountA11y(){
    if(!document.querySelector('.skip-link')){
      var skip=document.createElement('a');
      skip.className='skip-link';
      skip.href='#main-content';
      skip.textContent='Skip to main content';
      document.body.insertBefore(skip, document.body.firstChild);
    }
    // Ensure a main landmark exists and has id
    var main=document.querySelector('main');
    if(!main){
      // Find first section after header and wrap everything up to footer
      var header=document.querySelector('header');
      var footer=document.querySelector('footer');
      if(header&&footer&&header.parentNode===footer.parentNode){
        var parent=header.parentNode;
        main=document.createElement('main');
        main.id='main-content';
        main.setAttribute('role','main');
        var node=header.nextSibling;
        while(node&&node!==footer){
          var next=node.nextSibling;
          main.appendChild(node);
          node=next;
        }
        parent.insertBefore(main,footer);
      }else{
        // Fallback: mark first <section> NOT inside header/footer as landmark
        var candidates=document.querySelectorAll('section');
        var first=null;
        candidates.forEach(function(s){
          if(first) return;
          if(!s.closest('header,footer,nav')) first=s;
        });
        if(first){first.setAttribute('role','main');first.id=first.id||'main-content'}
      }
    }else if(!main.id){
      main.id='main-content';
    }
  }

  /* ---------- Sticky header blur toggle ---------- */
  function mountStickyHeader(){
    var hdr=document.querySelector('.header');
    if(!hdr) return;
    var ticking=false;
    function check(){
      if(window.scrollY>8) hdr.classList.add('is-stuck');
      else hdr.classList.remove('is-stuck');
      ticking=false;
    }
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(check);ticking=true}
    },{passive:true});
    check();
  }

  /* ---------- Scroll progress bar ---------- */
  function mountProgress(){
    if(REDUCED) return;
    var bar=document.createElement('div');
    bar.className='alive-progress';
    document.body.appendChild(bar);
    var ticking=false;
    function update(){
      var h=document.documentElement;
      var max=h.scrollHeight-h.clientHeight;
      var pct=max>0?(h.scrollTop||document.body.scrollTop)/max:0;
      bar.style.transform='scaleX('+Math.min(1,Math.max(0,pct))+')';
      ticking=false;
    }
    window.addEventListener('scroll',function(){
      if(!ticking){requestAnimationFrame(update);ticking=true}
    },{passive:true});
    update();
  }

  /* ---------- Hero word-stagger ---------- */
  function splitHero(){
    var h1=document.querySelector('.hero h1');
    if(!h1) return;
    // If already split (spans exist), skip; otherwise (re-)split.
    if(h1.querySelector('.alive-word')){return}
    h1.dataset.alive='1';
    // Walk child nodes, wrap each word in a span; preserve <br> and <em>
    function wrap(node){
      var kids=Array.prototype.slice.call(node.childNodes);
      kids.forEach(function(c){
        if(c.nodeType===3){ // text
          var frag=document.createDocumentFragment();
          var parts=c.nodeValue.split(/(\s+)/);
          parts.forEach(function(p){
            if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(p));return}
            if(!p) return;
            var s=document.createElement('span');
            s.className='alive-word';
            s.textContent=p;
            frag.appendChild(s);
          });
          c.parentNode.replaceChild(frag,c);
        } else if(c.nodeType===1){
          if(c.tagName==='BR') return;
          if(c.tagName==='EM'){
            c.classList.add('alive-word');
            return;
          }
          wrap(c);
        }
      });
    }
    wrap(h1);
    var words=h1.querySelectorAll('.alive-word');
    if(REDUCED){words.forEach(function(w){w.classList.add('is-in')});return}
    words.forEach(function(w,i){
      setTimeout(function(){w.classList.add('is-in')}, 120+i*55);
    });

    // Cascade sub + CTAs + trust
    var delay=120+words.length*55+180;
    ['.hero-badge','.hero-sub','.hero-btns','.hero-trust'].forEach(function(sel,idx){
      var el=document.querySelector('.hero '+sel);
      if(!el) return;
      el.classList.add('alive-fade');
      setTimeout(function(){el.classList.add('is-in')}, delay+idx*140);
    });
  }

  /* ---------- Cursor spotlight ---------- */
  function mountSpotlight(){
    if(REDUCED||TOUCH) return;
    ['.hero','.why-section'].forEach(function(sel){
      var host=document.querySelector(sel);
      if(!host) return;
      var sp=document.createElement('div');
      sp.className='alive-spotlight';
      host.appendChild(sp);
      host.addEventListener('pointerenter',function(){sp.classList.add('is-on')});
      host.addEventListener('pointerleave',function(){sp.classList.remove('is-on')});
      host.addEventListener('pointermove',function(e){
        var r=host.getBoundingClientRect();
        sp.style.setProperty('--mx',(e.clientX-r.left)+'px');
        sp.style.setProperty('--my',(e.clientY-r.top)+'px');
      },{passive:true});
    });
  }

  /* Counters are already handled by fcr.js — skip to avoid duplication. */

  /* ---------- Service card 3D tilt ---------- */
  function mountTilt(){
    if(REDUCED||TOUCH) return;
    var cards=document.querySelectorAll('.svc, .reel-card');
    cards.forEach(function(card){
      var raf=null;
      function onMove(e){
        var r=card.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width;
        var y=(e.clientY-r.top)/r.height;
        var ry=(x-0.5)*10;
        var rx=(0.5-y)*10;
        if(raf) return;
        raf=requestAnimationFrame(function(){
          card.style.setProperty('--rx',rx.toFixed(2)+'deg');
          card.style.setProperty('--ry',ry.toFixed(2)+'deg');
          raf=null;
        });
      }
      function reset(){
        card.style.setProperty('--rx','0deg');
        card.style.setProperty('--ry','0deg');
      }
      card.addEventListener('pointermove',onMove,{passive:true});
      card.addEventListener('pointerleave',reset);
    });
  }

  /* Magnetic CTA already handled by fcr.js — skip. */

  /* ---------- Why-card hover video reveal ---------- */
  function mountWhyVideos(){
    if(TOUCH) return;
    document.querySelectorAll('.why-card video').forEach(function(v){
      var card=v.closest('.why-card');
      if(!card) return;
      card.addEventListener('pointerenter',function(){
        if(v.preload==='none') v.preload='auto';
        v.play().catch(function(){});
      });
      card.addEventListener('pointerleave',function(){v.pause()});
    });
  }

  /* ---------- Live activity pill ---------- */
  function mountLive(){
    if(REDUCED) return;
    var items=[
      {area:'Stone Oak',     scope:'Kitchen remodel',      when:'completed 3 days ago'},
      {area:'Helotes',       scope:'Master bath rebuild',  when:'finished last week'},
      {area:'Shavano Park',  scope:'Outdoor kitchen',      when:'delivered this month'},
      {area:'Boerne',        scope:'Whole-home remodel',   when:'walkthrough yesterday'},
      {area:'Schertz',       scope:'Patio + pergola',      when:'wrapped up today'}
    ];
    var pill=document.createElement('div');
    pill.className='alive-live';
    pill.setAttribute('role','status');
    pill.setAttribute('aria-live','polite');
    pill.innerHTML='<span class="alive-live-dot" aria-hidden="true"></span><span class="alive-live-body"></span>';
    document.body.appendChild(pill);
    var body=pill.querySelector('.alive-live-body');
    var i=0;
    function render(){
      var it=items[i%items.length];
      body.innerHTML='<b>'+it.scope+'</b> · '+it.area+'<small>'+it.when+'</small>';
      i++;
    }
    render();
    // show after hero for calm entry
    setTimeout(function(){pill.classList.add('is-in')},2400);
    setInterval(function(){
      pill.style.opacity='0';
      setTimeout(function(){render();pill.style.opacity=''}, 420);
    },8000);
  }

  /* Section reveal is handled by fcr.js [data-reveal] — skip. */

  /* ---------- Before/After slider ---------- */
  function mountBeforeAfter(){
    var sliders=document.querySelectorAll('.ba-slider[data-ba]');
    if(!sliders.length) return;
    sliders.forEach(function(s){
      var handle=s.querySelector('.ba-handle');
      if(!handle) return;
      var dragging=false;
      var pos=50;
      function apply(p){
        pos=Math.max(0,Math.min(100,p));
        s.style.setProperty('--ba-inset',(100-pos)+'%');
        s.style.setProperty('--ba-handle-left',pos+'%');
      }
      function toPct(clientX){
        var r=s.getBoundingClientRect();
        return ((clientX-r.left)/r.width)*100;
      }
      function onDown(e){
        dragging=true;s.setPointerCapture&&s.setPointerCapture(e.pointerId);
        apply(toPct(e.clientX));e.preventDefault();
      }
      function onMove(e){if(!dragging)return;apply(toPct(e.clientX))}
      function onUp(){dragging=false}
      s.addEventListener('pointerdown',onDown);
      s.addEventListener('pointermove',onMove);
      s.addEventListener('pointerup',onUp);
      s.addEventListener('pointercancel',onUp);
      s.addEventListener('pointerleave',onUp);
      // Keyboard
      handle.setAttribute('tabindex','0');
      handle.addEventListener('keydown',function(e){
        if(e.key==='ArrowLeft'){apply(pos-5);e.preventDefault()}
        if(e.key==='ArrowRight'){apply(pos+5);e.preventDefault()}
      });
      apply(50);
      // Autoplay nudge on first enter-view (teaser)
      if(!REDUCED&&'IntersectionObserver' in window){
        var io=new IntersectionObserver(function(es){
          es.forEach(function(ent){
            if(!ent.isIntersecting||s.dataset.teased) return;
            s.dataset.teased='1';io.unobserve(s);
            var steps=[50,72,40,56,50],i=0;
            var t=setInterval(function(){
              apply(steps[i++]);
              if(i>=steps.length)clearInterval(t);
            },380);
          });
        },{threshold:0.35});
        io.observe(s);
      }
    });
  }

  /* ---------- Weather-aware hero badge(s) ---------- */
  function mountWeatherFor(badge,cityQuery,cityLabel){
    if(!badge||badge.dataset.weather) return;
    badge.dataset.weather='1';
    var chip=document.createElement('span');
    chip.className='alive-weather';
    badge.appendChild(chip);
    // wttr.in is free, no-auth, returns JSON
    fetch('https://wttr.in/'+cityQuery+'?format=j1',{mode:'cors'}).then(function(r){
      if(!r.ok) throw new Error('weather');
      return r.json();
    }).then(function(data){
      var cur=data.current_condition&&data.current_condition[0];
      if(!cur) return;
      var tempF=parseInt(cur.temp_F,10);
      var desc=(cur.weatherDesc&&cur.weatherDesc[0]&&cur.weatherDesc[0].value)||'';
      var ico='🌤';
      var tag='';
      if(tempF>=78){ico='🌞';tag='Outdoor kitchen season'}
      else if(tempF>=60){ico='☀️';tag='Perfect patio weather'}
      else if(tempF>=45){ico='🌤';tag='Cozy remodel weather'}
      else{ico='🔥';tag='Indoor season'}
      chip.innerHTML='<span class="alive-weather-ico">'+ico+'</span><span>'+tempF+'°F &middot; '+tag+'</span>';
      chip.title=desc+' in '+cityLabel;
      requestAnimationFrame(function(){chip.classList.add('is-in')});
    }).catch(function(){
      chip.remove();
    });
  }
  function mountWeather(){
    if(REDUCED) return;
    mountWeatherFor(document.querySelector('.hero-badge:not(.hero-badge-fl)'),'San+Antonio','San Antonio, TX');
    mountWeatherFor(document.querySelector('.hero-badge-fl'),'Sarasota+FL','Sarasota, FL');
  }

  ready(function(){
    try{mountA11y();}catch(e){}
    try{mountStickyHeader();}catch(e){}
    try{splitHero();}catch(e){}
    try{mountProgress();}catch(e){}
    try{mountSpotlight();}catch(e){}
    try{mountTilt();}catch(e){}
    try{mountWhyVideos();}catch(e){}
    try{mountLive();}catch(e){}
    try{mountBeforeAfter();}catch(e){}
    try{mountWeather();}catch(e){}
  });
})();

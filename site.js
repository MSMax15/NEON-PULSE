const $ = id => document.getElementById(id);
const isFile = location.protocol === 'file:';

const bub = $('bubbles');
if (bub) {
  bub.innerHTML = Array.from({ length: 14 }, (_, i) => {
    const s = 6 + (i * 7) % 18;
    return '<span style="left:' + ((i * 37) % 100) + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (9 + (i * 5) % 11) + 's;animation-delay:-' + (i * 3) % 12 + 's"></span>';
  }).join('');
}

// Hamburger → right drawer
(() => {
  const btn = document.querySelector('.nav-burger');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-backdrop');
  const closeBtn = document.querySelector('.nav-close');
  if (!btn || !drawer) return;

  const open = () => {
    btn.setAttribute('aria-expanded', 'true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (backdrop) {
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('show'));
    }
    document.body.classList.add('nav-open');
    btn.setAttribute('aria-label', 'Menü schließen');
  };
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) {
      backdrop.classList.remove('show');
      setTimeout(() => { if (!drawer.classList.contains('open')) backdrop.hidden = true; }, 350);
    }
    document.body.classList.remove('nav-open');
    btn.setAttribute('aria-label', 'Menü öffnen');
  };

  btn.addEventListener('click', () => {
    btn.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// Home: countdown → launch mode
const hero = document.querySelector('.hero');
if (hero) {
  const target = new Date(2026, 10, 19, 0, 0, 0).getTime();
  let forceLaunch = false;
  try {
    forceLaunch = /(?:\?|&)launch=1(?:&|$)/.test(location.search) || localStorage.getItem('np-launch') === '1';
  } catch (_) {}

  const enterLaunch = () => {
    document.body.classList.add('launch');
    document.documentElement.classList.add('launch');
    const hl = $('headline');
    const count = $('count');
    const date = $('date');
    const actions = document.getElementById('hero-actions');
    if (hl) hl.textContent = 'GTA 6 is out';
    if (count) {
      count.innerHTML = '<div class="out">Launch Day</div><p class="launch-sub">Vice City is live. Check status, set the alarm, get your server.</p>';
    }
    if (date) date.textContent = 'Offizielle Statusseite und Community-Hosting – alles an einem Ort.';
    if (actions) {
      actions.innerHTML =
        '<a class="dive dive-primary" href="https://support.rockstargames.com/servicestatus" target="_blank" rel="noopener">Rockstar Status</a>' +
        '<a class="dive" href="#live">Livestream</a>' +
        '<a class="dive" href="#alarm">Server-Alarm</a>' +
        '<a class="dive" href="gta6-server-hosting.html">Server mieten</a>' +
        '<a class="dive" href="partner.html">6PULSE × ZAP</a>';
    }
    const ticker = document.querySelector('.ticker div');
    if (ticker) {
      ticker.innerHTML = '<span>LAUNCH DAY</span><i></i><span>GTA 6 is out now</span><i></i><span>Check Rockstar status</span><i></i><span>Server &amp; TeamSpeak hosting</span><i></i><span>Status-Alarm aktivieren</span><i></i><span>6PULSE × ZAP</span><i></i><span>LAUNCH DAY</span><i></i><span>GTA 6 is out now</span><i></i><span>Check Rockstar status</span><i></i><span>Server &amp; TeamSpeak hosting</span><i></i><span>Status-Alarm aktivieren</span><i></i><span>6PULSE × ZAP</span><i></i>';
    }
    document.dispatchEvent(new CustomEvent('np-launch'));
  };

  const tick = () => {
    const left = forceLaunch ? -1 : (target - Date.now());
    if (left <= 0) {
      enterLaunch();
      return false;
    }
    const p = n => String(n).padStart(2, '0');
    const d = $('d'), h = $('h'), m = $('m'), s = $('s');
    if (d) d.textContent = Math.floor(left / 864e5);
    if (h) h.textContent = p(Math.floor(left / 36e5) % 24);
    if (m) m.textContent = p(Math.floor(left / 6e4) % 60);
    if (s) s.textContent = p(Math.floor(left / 1e3) % 60);
    return true;
  };

  if (tick()) {
    const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000);
  }

  const bgEl = document.querySelector('.bg');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, tgt = 0, run = false;
  const step = () => {
    // softer lerp = smoother dive crossfade while scrolling
    const k = calm ? 1 : 0.075;
    cur += (tgt - cur) * k;
    if (Math.abs(tgt - cur) < 0.0008) {
      cur = tgt;
      run = false;
    } else {
      requestAnimationFrame(step);
    }
    if (bgEl) bgEl.style.setProperty('--d', cur.toFixed(4));
  };
  const depth = () => {
    const h = hero.offsetHeight || 1;
    // longer blend range for smoother surface → underwater
    tgt = Math.min(1, Math.max(0, (scrollY - h * 0.08) / (h * 1.35)));
    if (!run) {
      run = true;
      requestAnimationFrame(step);
    }
  };
  addEventListener('scroll', depth, { passive: true });
  addEventListener('resize', depth);
  depth();
  if (!calm && matchMedia('(pointer: fine)').matches) {
    addEventListener('mousemove', e => {
      if (bgEl) {
        bgEl.style.setProperty('--mx', (e.clientX / innerWidth - .5).toFixed(3));
        bgEl.style.setProperty('--my', (e.clientY / innerHeight - .5).toFixed(3));
      }
    }, { passive: true });
  }
  const wheel = $('wheel');
  if (wheel) {
    new IntersectionObserver((es, o) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); }
    }), { threshold: .25 }).observe(wheel);
  }
  document.querySelectorAll('.seg').forEach(g => {
    const on = () => {
      if ($('hub1')) $('hub1').textContent = g.dataset.name;
      if ($('hub2')) $('hub2').textContent = g.dataset.sub;
    };
    const off = () => {
      if ($('hub1')) $('hub1').textContent = 'GTA 6';
      if ($('hub2')) $('hub2').textContent = 'Pick a slot';
    };
    g.addEventListener('mouseenter', on);
    g.addEventListener('focus', on);
    g.addEventListener('mouseleave', off);
    g.addEventListener('blur', off);
  });
}

// Category lightbox + copy
document.addEventListener('click', e => {
  const c = e.target.closest('.copy');
  if (c) {
    const prev = c.previousElementSibling;
    if (prev) {
      navigator.clipboard.writeText(prev.textContent).then(() => {
        c.textContent = 'Copied';
        setTimeout(() => { c.textContent = 'Copy'; }, 1500);
      }).catch(() => {});
    }
    return;
  }
  const ph = e.target.closest('.ph');
  if (!ph) return;
  const img = ph.querySelector('img');
  const cap = ph.parentElement && ph.parentElement.querySelector('figcaption');
  if (!img) return;
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Bildansicht');

  // Build the lightbox with DOM APIs. Never interpolate image alt text or
  // caption markup into innerHTML.
  const enlarged = document.createElement('img');
  enlarged.src = img.currentSrc || img.src;
  enlarged.alt = img.alt || '';
  enlarged.decoding = 'async';
  lb.append(enlarged);

  if (cap && cap.textContent.trim()) {
    const caption = document.createElement('p');
    caption.textContent = cap.textContent.trim();
    lb.append(caption);
  }

  lb.addEventListener('click', () => lb.remove());
  document.body.append(lb);
});
addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.lb')?.remove(); });

// Formspree alarm. Only send to the configured HTTPS endpoint.
document.querySelectorAll('form[data-subscribe]').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = f.querySelector('.msg');
  const btn = f.querySelector('button[type="submit"], button:not([type])');
  if (!msg || !btn) return;

  if (isFile) {
    msg.textContent = 'Lokal (file://) kein Versand. Bitte die Live-Seite oder einen lokalen Server nutzen.';
    return;
  }

  let endpoint;
  try {
    endpoint = new URL(f.getAttribute('action') || '', location.href);
  } catch (_) {
    msg.textContent = 'Formularziel ungültig. Bitte später erneut versuchen.';
    return;
  }
  if (f.method.toLowerCase() !== 'post' ||
      endpoint.protocol !== 'https:' ||
      endpoint.origin !== 'https://formspree.io' ||
      endpoint.pathname !== '/f/xaeeklye') {
    msg.textContent = 'Formular ist momentan nicht korrekt konfiguriert.';
    return;
  }

  const honeypot = f.elements.namedItem('_gotcha');
  if (honeypot && String(honeypot.value || '').trim()) {
    // Quietly discard bot submissions; do not forward them.
    msg.textContent = 'Danke! Deine Anfrage wurde entgegengenommen.';
    f.reset();
    return;
  }

  const email = f.elements.namedItem('email');
  if (email && typeof email.value === 'string') {
    email.value = email.value.trim();
    if (email.value.length > 254 || !email.checkValidity()) {
      email.reportValidity();
      return;
    }
  }

  btn.disabled = true;
  msg.textContent = 'Anmeldung wird übermittelt ...';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(endpoint.href, {
      method: 'POST',
      body: new FormData(f),
      headers: { 'Accept': 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'strict-origin-when-cross-origin',
      signal: controller.signal
    });
    if (!response.ok) throw new Error('submission_failed');

    msg.textContent = 'Danke! 6PULSE hat deine Anmeldung erhalten. Automatische Status-Mails starten, sobald der Alarmdienst aktiv ist.';
    f.reset();
  } catch (_) {
    msg.textContent = 'Senden fehlgeschlagen oder Zeitüberschreitung. Bitte Verbindung prüfen und erneut versuchen.';
  } finally {
    clearTimeout(timeout);
    btn.disabled = false;
  }
}));

// Status chips
const chips = document.querySelectorAll('[data-status]');
if (chips.length) {
  const LABELS = {
    unlisted: 'Bei Rockstar noch nicht gelistet',
    up: 'Online',
    limited: 'Eingeschränkt',
    down: 'Gestört / Down',
    maintenance: 'Wartung'
  };
  const launchAt = new Date(2026, 10, 19, 0, 0, 0).getTime();
  const apply = (status, detail) => {
    const key = status || 'unlisted';
    const preLaunch = Date.now() < launchAt && (key === 'unlisted' || !status);
    chips.forEach(c => {
      if (preLaunch) {
        c.textContent = 'GTA 6: Noch nicht live – Release 19.11.2026';
        c.dataset.s = 'unlisted';
      } else {
        c.textContent = 'GTA 6: ' + (LABELS[key] || key);
        c.dataset.s = key;
      }
      if (detail) c.title = detail;
    });
  };

  if (isFile) {
    apply('unlisted', 'Lokaler Datei-Modus – status.json wird unter file:// oft blockiert.');
  } else {
    // live data from the bot branch first, the static file in this repo is only the fallback
    const tryUrls = [
      'https://raw.githubusercontent.com/MSMax15/NEON-PULSE/status-data/status.json',
      'status.json'
    ];
    (async () => {
      for (const url of tryUrls) {
        try {
          const r = await fetch(url, { cache: 'no-store' });
          if (!r.ok) continue;
          const s = await r.json();
          apply(s.status, s.detail || s.label || '');
          return;
        } catch (_) {}
      }
      apply('unlisted', 'Fallback – Rockstar bleibt die verbindliche Quelle.');
    })();
  }
}

// Packs 3D carousel + swipe
(() => {
  const root = document.querySelector('[data-packs]');
  if (!root) return;
  const cards = [...root.querySelectorAll('.pack-card')];
  const dots = [...document.querySelectorAll('[data-packs-dots] button')];
  const prev = root.querySelector('.packs-prev');
  const next = root.querySelector('.packs-next');
  if (!cards.length) return;
  let i = Math.min(1, cards.length - 1);
  const n = cards.length;
  let lock = false;

  const paint = () => {
    cards.forEach((c, idx) => {
      c.classList.remove('is-active', 'is-prev', 'is-next');
      if (idx === i) c.classList.add('is-active');
      else if (idx === (i - 1 + n) % n) c.classList.add('is-prev');
      else if (idx === (i + 1) % n) c.classList.add('is-next');
    });
    dots.forEach((d, idx) => d.classList.toggle('is-on', idx === i));
  };
  const go = dir => {
    if (lock) return;
    lock = true;
    i = (i + dir + n) % n;
    paint();
    setTimeout(() => { lock = false; }, 320);
  };
  const goTo = idx => {
    i = ((idx % n) + n) % n;
    paint();
  };

  prev?.addEventListener('click', () => go(-1));
  next?.addEventListener('click', () => go(1));
  dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.go)));

  const vp = root.querySelector('.packs-viewport');
  let x0 = null, y0 = null, dragged = false;
  const start = (x, y) => { x0 = x; y0 = y; dragged = false; };
  const move = (x, y) => {
    if (x0 == null) return;
    if (Math.abs(x - x0) > 12 && Math.abs(x - x0) > Math.abs((y || 0) - (y0 || 0))) dragged = true;
  };
  const end = x => {
    if (x0 == null) return;
    const dx = x - x0;
    if (dragged && Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    x0 = null;
    y0 = null;
  };
  vp?.addEventListener('touchstart', e => start(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
  vp?.addEventListener('touchmove', e => move(e.changedTouches[0].clientX, e.changedTouches[0].clientY), { passive: true });
  vp?.addEventListener('touchend', e => end(e.changedTouches[0].clientX), { passive: true });
  vp?.addEventListener('mousedown', e => start(e.clientX, e.clientY));
  addEventListener('mousemove', e => move(e.clientX, e.clientY));
  addEventListener('mouseup', e => end(e.clientX));
  vp?.addEventListener('click', e => {
    if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; }
  }, true);

  paint();
})();

// Images: tolerate .jpg / .jpeg / .png / .webp mixes and give the wheel a fallback photo
(() => {
  const EXTS = ['jpg', 'jpeg', 'png', 'webp'];
  const parts = u => { const m = u.match(/^(.*)\.(jpe?g|png|webp)$/i); return m ? [m[1], m[2].toLowerCase()] : [u, '']; };
  const variants = u => { const [b, e] = parts(u); return [e, ...EXTS].filter((x, i, a) => x && a.indexOf(x) === i).map(x => b + '.' + x); };
  const loads = u => new Promise(res => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = u; });
  const first = async urls => { for (const u of urls) if (await loads(u)) return u; return null; };

  // category pages: keep the slot hint when no photo exists under any extension
  document.querySelectorAll('.ph img').forEach(async img => {
    const src = img.getAttribute('src') || '';
    const found = await first(variants(src));
    if (!found) img.remove(); else if (found !== src) img.src = found;
  });

  // wheel: images/<name>.* first, then the first photo of that category (images/<name>/01.*)
  document.querySelectorAll('.seg').forEach(async a => {
    const cat = (a.getAttribute('href') || '').replace('.html', '');
    const el = a.querySelector('image');
    if (!el || !cat) return;
    const found = await first([...variants('images/' + cat + '.jpg'), ...variants('images/' + cat + '/01.jpg')]);
    if (found) el.setAttribute('href', found); else el.remove();
  });
})();

// Optional, cookie-free click counting for affiliate links (GoatCounter). Stays OFF while GOATCOUNTER is empty.
// To switch on: create a free account at goatcounter.com, put your site code below, and add GoatCounter to datenschutz.html first.
(() => {
  const GOATCOUNTER = '';
  if (!GOATCOUNTER) return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://' + GOATCOUNTER + '.goatcounter.com/count';
  document.head.appendChild(s);
  document.addEventListener('click', e => {
    const a = e.target.closest('a[rel~="sponsored"]');
    if (!a || !window.goatcounter || !window.goatcounter.count) return;
    let path = a.href; try { path = new URL(a.href).pathname; } catch (_) {}
    window.goatcounter.count({ path: 'affiliate' + path, title: location.pathname, event: true });
  });
})();

// Live block (YouTube, loads only after a click).
// Switch it from live.json: {"mode":"auto"|"live"|"offline","note":"...","videoId":""}
(() => {
  const box = document.getElementById('live');
  if (!box) return;
  const CHANNEL_ID = 'UCytwKvyxmhC1JVnb4PRdvOA';
  const badge = document.getElementById('live-badge');
  const note = document.getElementById('live-note');
  const stage = document.getElementById('live-stage');
  const gate = document.getElementById('live-gate');
  const off = document.getElementById('live-offline');
  const load = document.getElementById('live-load');
  const MODES = { auto: 'STREAM', live: 'LIVE', offline: 'OFFLINE' };
  const cfg = { mode: 'auto', note: '', videoId: '' };

  const paint = () => {
    badge.textContent = MODES[cfg.mode];
    badge.dataset.s = cfg.mode;
    note.textContent = cfg.note ||
      (cfg.mode === 'live' ? 'Wir sind gerade live. Klicke auf den Player.' :
       cfg.mode === 'offline' ? 'Gerade offline. Schau auf dem Kanal vorbei.' :
       'Wenn wir live sind, läuft der Stream hier. Sonst findest du uns auf dem Kanal.');
    if (gate) gate.hidden = cfg.mode === 'offline';
    if (off) off.hidden = cfg.mode !== 'offline';
  };
  const maybeShow = () => {
    if (document.body.classList.contains('launch') || cfg.mode === 'live') { paint(); box.hidden = false; }
  };

  fetch('live.json', { cache: 'no-store', credentials: 'omit' })
    .then(r => (r.ok ? r.json() : null))
    .then(d => {
      if (!d || typeof d !== 'object') return;
      if (Object.prototype.hasOwnProperty.call(MODES, d.mode)) cfg.mode = d.mode;
      if (typeof d.note === 'string') cfg.note = d.note.slice(0, 200);
      if (typeof d.videoId === 'string' && /^[A-Za-z0-9_-]{11}$/.test(d.videoId)) cfg.videoId = d.videoId;
    })
    .catch(() => {})
    .then(maybeShow);
  document.addEventListener('np-launch', maybeShow);

  if (load) load.addEventListener('click', () => {
    const base = cfg.videoId
      ? 'https://www.youtube-nocookie.com/embed/' + cfg.videoId + '?'
      : 'https://www.youtube-nocookie.com/embed/live_stream?channel=' + CHANNEL_ID + '&';
    const f = document.createElement('iframe');
    f.src = base + 'autoplay=1&rel=0';
    f.title = 'Feed Error Livestream auf YouTube';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.setAttribute('allowfullscreen', '');
    f.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    f.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox');
    stage.replaceChildren(f);
  });
})();

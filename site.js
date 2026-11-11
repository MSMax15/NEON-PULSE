/* Prefer HTTPS on production domain (GSC http/https split) */
(function(){try{if(location.protocol==='http:'&&/(^|\.)pulseneon\.de$/i.test(location.hostname)){location.replace('https://'+location.host+location.pathname+location.search+location.hash);}}catch(e){}})();
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
    btn.setAttribute('aria-label', 'Close menu');
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
    btn.setAttribute('aria-label', 'Open menu');
  };

  btn.addEventListener('click', () => {
    btn.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

// YouTube link is available site-wide without overpowering the navigation.
(() => {
  const footer = document.querySelector('footer .wrap');
  if (!footer || footer.querySelector('.youtube-channel-link')) return;
  const link = document.createElement('a');
  link.className = 'youtube-channel-link';
  link.href = 'https://www.youtube.com/@Pulseneonz';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'YouTube · Pulseneonz ↗';
  footer.append(link);
})();

// Official launch cinema: autoplay is attempted immediately. Browsers may block audible autoplay;
// if so, continue muted and expose a one-tap sound control. Redirect on video end or at 40 seconds.
function showLaunchCinema(previewMode = false) {
  let seen = false;
  try { seen = localStorage.getItem('np-launch-cinema-seen') === '1'; } catch (_) {}
  if (seen && !previewMode && !/(?:\?|&)replay=1(?:&|$)/.test(location.search)) return;
  if (document.querySelector('.launch-cinema')) return;

  const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@Pulseneonz';
  const overlay = document.createElement('section');
  overlay.className = 'launch-cinema is-playing';
  overlay.setAttribute('aria-label', 'Pulseneon GTA 6 Launch');
  overlay.innerHTML =
    '<video class="launch-cinema-video" playsinline autoplay preload="auto" poster="hero.png"><source src="launch-video/gta6-launch.mp4" type="video/mp4"></video>' +
    '<div class="launch-cinema-shade"></div>' +
    '<button type="button" class="cinema-unmute" aria-label="Enable video sound">🔊 Enable sound</button>' +
    '<div class="launch-cinema-copy" hidden><span class="cinema-kicker">PULSENEON PRESENTS</span><h2>VICE CITY IS YOURS.</h2><p>The wait is over. Welcome to GTA VI.</p><div class="cinema-actions"><a class="cinema-youtube" href="' + YOUTUBE_CHANNEL_URL + '" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div><small class="cinema-hint">Taking you to the Pulseneon channel…</small></div>';

  let finished = false;
  let endCardShown = false;
  let redirectTimer;
  const redirectToYouTube = () => {
    if (finished) return;
    finished = true;
    try { if (!previewMode) localStorage.setItem('np-launch-cinema-seen', '1'); } catch (_) {}
    window.location.href = YOUTUBE_CHANNEL_URL;
  };
  const revealEndCard = () => {
    if (endCardShown || finished) return;
    endCardShown = true;
    video.pause();
    overlay.classList.add('show-end-card');
    const copy = overlay.querySelector('.launch-cinema-copy');
    if (copy) copy.hidden = false;
    clearTimeout(redirectTimer);
    redirectTimer = setTimeout(redirectToYouTube, 5000);
  };
  const video = overlay.querySelector('video');
  overlay.querySelector('.cinema-unmute').addEventListener('click', () => {
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {});
    overlay.querySelector('.cinema-unmute').hidden = true;
  });
  video.addEventListener('ended', revealEndCard, { once: true });
  video.addEventListener('error', () => {
    overlay.classList.add('video-unavailable');
    revealEndCard();
  }, { once: true });
  document.body.append(overlay);
  // Hard limit: redirect after 40 seconds from launch, even if the video is longer or stalls.
  redirectTimer = setTimeout(redirectToYouTube, 40000);
  video.muted = false;
  video.volume = 1;
  const playAttempt = video.play();
  if (playAttempt && playAttempt.catch) {
    playAttempt.catch(() => {
      // Audible autoplay is commonly blocked. Muted autoplay is the best automatic fallback.
      video.muted = true;
      video.play().then(() => {
        const soundButton = overlay.querySelector('.cinema-unmute');
        if (soundButton) soundButton.hidden = false;
      }).catch(() => {
        // If even muted autoplay is blocked, retain the visible video and sound control.
        const soundButton = overlay.querySelector('.cinema-unmute');
        if (soundButton) soundButton.textContent = '▶ Play video / enable sound';
      });
    });
  }
}

// Home: countdown → launch mode
const hero = document.querySelector('.hero');
if (hero) {
  const releaseTarget = new Date(2026, 10, 19, 0, 0, 0).getTime();
  // Opening index.html directly on your computer starts a private 30-second preview.
  // On the live website, use ?preview=1 to test without changing the real release countdown.
  const previewMode = isFile || /(?:\?|&)preview=1(?:&|$)/.test(location.search);
  const target = previewMode ? Date.now() + 30000 : releaseTarget;
  let forceLaunch = false;
  try {
    forceLaunch = !previewMode && (/(?:\?|&)launch=1(?:&|$)/.test(location.search) || localStorage.getItem('np-launch') === '1');
  } catch (_) {}
  if (previewMode) {
    const headline = $('headline');
    const dateLine = $('date');
    if (headline) headline.textContent = 'Launch experience preview';
    if (dateLine) dateLine.textContent = 'Preview mode · The launch screen starts automatically in 30 seconds.';
  }

  const enterLaunch = () => {
    document.body.classList.add('launch');
    showLaunchCinema(previewMode);
    document.documentElement.classList.add('launch');
    const hl = $('headline');
    const count = $('count');
    const date = $('date');
    const actions = document.getElementById('hero-actions');
    if (hl) hl.textContent = 'GTA 6 is here';
    if (count) {
      count.innerHTML = '<div class="out">Launch Day</div><p class="launch-sub">Vice City is live. Check the status, enable alerts, and get your community started.</p>';
    }
    if (date) date.textContent = 'Official status, community hosting, and all GTA 6 updates in one place.';
    if (actions) {
      actions.innerHTML =
        '<a class="dive dive-primary" href="https://support.rockstargames.com/servicestatus" target="_blank" rel="noopener">Rockstar Status</a>' +
        '<a class="dive" href="#alarm">Server Alert</a>' +
        '<a class="dive" href="gta6-server-hosting.html">Rent a Server</a>' +
        '<a class="dive" href="partner.html">Pulseneon × ZAP</a>';
    }
    const ticker = document.querySelector('.ticker div');
    if (ticker) {
      ticker.innerHTML = '<span>GTA 6 IS HERE</span><i></i><span>Available Now</span><i></i><span>Check Rockstar Status</span><i></i><span>Server &amp; TeamSpeak Hosting</span><i></i><span>Enable Status Alerts</span><i></i><span>Pulseneon × ZAP</span><i></i><span>GTA 6 IS HERE</span><i></i><span>Available Now</span><i></i><span>Check Rockstar Status</span><i></i><span>Server &amp; TeamSpeak Hosting</span><i></i><span>Enable Status Alerts</span><i></i><span>Pulseneon × ZAP</span><i></i>'; 
    }
  };

  const tick = () => {
    const left = forceLaunch ? -1 : (target - Date.now());
    if (left <= 0) {
      enterLaunch();
      return false;
    }
    const p = n => String(n).padStart(2, '0');
    const vals = {
      d: String(Math.floor(left / 864e5)),
      h: p(Math.floor(left / 36e5) % 24),
      m: p(Math.floor(left / 6e4) % 60),
      s: p(Math.floor(left / 1e3) % 60)
    };
    const d = $('d'), h = $('h'), m = $('m'), s = $('s');
    if (d) d.textContent = vals.d;
    if (h) h.textContent = vals.h;
    if (m) m.textContent = vals.m;
    if (s) s.textContent = vals.s;
    document.querySelectorAll('[data-cd]').forEach(el => {
      const k = el.getAttribute('data-cd');
      if (k && vals[k] != null) el.textContent = vals[k];
    });
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
    const reveal = () => wheel.classList.add('in');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((es, o) => es.forEach(e => {
        if (e.isIntersecting) { reveal(); o.unobserve(e.target); }
      }), { threshold: .15 }).observe(wheel);
    }
    setTimeout(reveal, 900);
  }
  document.querySelectorAll('.seg').forEach(g => {
    const on = () => {
      if ($('hub1')) $('hub1').textContent = g.dataset.name;
      if ($('hub2')) $('hub2').textContent = g.dataset.sub;
    };
    const off = () => {
      if ($('hub1')) $('hub1').textContent = 'GTA 6';
      if ($('hub2')) $('hub2').textContent = 'Pick a category';
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
  lb.innerHTML = '<img src="' + img.src + '" alt="' + (img.alt || '') + '"><p>' + (cap ? cap.innerHTML : '') + '</p>';
  lb.onclick = () => lb.remove();
  document.body.append(lb);
});
addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.lb')?.remove(); });

// Formspree alarm (skip hard fail on file://)
document.querySelectorAll('form[data-subscribe]').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = f.querySelector('.msg');
  const btn = f.querySelector('button');
  if (!msg || !btn) return;
  if (isFile) {
    msg.textContent = 'Lokal (file://) kein Versand. Bitte die Live-Seite oder einen lokalen Server nutzen.';
    return;
  }
  btn.disabled = true;
  msg.textContent = 'Anmeldung wird übermittelt ...';
  try {
    const response = await fetch(f.action, {
      method: 'POST',
      body: new FormData(f),
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      let detail = '';
      try {
        const data = await response.json();
        detail = (data.errors || []).map(x => x.message).join(' ');
      } catch (_) {}
      throw new Error(detail || 'Formular konnte nicht gesendet werden.');
    }
    msg.textContent = 'Thanks! Your signup has been submitted. Please confirm your email address using the confirmation link from Buttondown. You will receive status updates only after confirming.';
    f.reset();
  } catch (err) {
    msg.textContent = 'Senden fehlgeschlagen. Bitte Verbindung prüfen und noch einmal versuchen.';
  } finally {
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

// Reliable hash scroll (#packs etc.) with fixed-nav offset – mobile + desktop
(() => {
  const OFFSET = () => {
    const nav = document.querySelector('nav');
    const h = nav ? nav.getBoundingClientRect().height : 72;
    return Math.max(64, Math.ceil(h + 12));
  };
  const scrollToHash = (hash, behavior) => {
    if (!hash || hash === '#') return false;
    const id = decodeURIComponent(hash.replace(/^#/, ''));
    if (!id) return false;
    const el = document.getElementById(id);
    if (!el) return false;
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET();
    window.scrollTo({ top: Math.max(0, top), behavior: behavior || 'smooth' });
    return true;
  };
  const run = (behavior) => {
    if (!location.hash) return;
    scrollToHash(location.hash, behavior);
  };
  // after layout: fonts/images can shift position
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      run('auto');
      requestAnimationFrame(() => run('smooth'));
      setTimeout(() => run('smooth'), 120);
      setTimeout(() => run('smooth'), 400);
    });
  } else {
    run('auto');
    setTimeout(() => run('smooth'), 50);
    setTimeout(() => run('smooth'), 300);
  }
  window.addEventListener('hashchange', () => run('smooth'));
  // same-page links with hash
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    let url;
    try { url = new URL(a.href, location.href); } catch (_) { return; }
    if (url.pathname !== location.pathname && url.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '')) {
      // allow /index.html vs /
      const here = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
      const there = url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
      if (here !== there) return;
    }
    if (!url.hash) return;
    if (scrollToHash(url.hash, 'smooth')) {
      e.preventDefault();
      if (history.pushState) history.pushState(null, '', url.hash);
      else location.hash = url.hash;
    }
  });
})();

/* Shop accordion inside the drawer */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".nav-acc-btn");
  if (!btn) return;
  e.preventDefault();
  const panelId = btn.getAttribute("aria-controls");
  const panel = panelId ? document.getElementById(panelId) : btn.parentElement.querySelector(".nav-acc-panel");
  if (!panel) return;
  const open = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", open ? "false" : "true");
  panel.hidden = open;
});


/* Floating countdown dock on home */
(function () {
  const dock = document.getElementById('count-dock');
  const hero = document.querySelector('header.hero');
  if (!dock || !hero || !document.body.classList.contains('page-home')) return;
  dock.hidden = false;
  const sync = () => {
    if (document.body.classList.contains('launch')) {
      dock.classList.remove('is-on');
      return;
    }
    const past = window.scrollY > Math.max(180, hero.offsetHeight * 0.55);
    dock.classList.toggle('is-on', past);
  };
  sync();
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync);
})();

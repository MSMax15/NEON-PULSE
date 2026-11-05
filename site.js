const $ = id => document.getElementById(id);
const bub = $('bubbles');
if (bub) bub.innerHTML = Array.from({ length: 14 }, (_, i) => { const s = 6 + (i * 7) % 18; return '<span style="left:' + ((i * 37) % 100) + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (9 + (i * 5) % 11) + 's;animation-delay:-' + (i * 3) % 12 + 's"></span>'; }).join('');

// home only: countdown → launch mode, dive depth, wheel reveal
const hero = document.querySelector('.hero');
if (hero){
  const target = new Date(2026, 10, 19, 0, 0, 0).getTime();
  const forceLaunch = /(?:\?|&)launch=1(?:&|$)/.test(location.search) || localStorage.getItem('np-launch') === '1';

  const enterLaunch = () => {
    document.body.classList.add('launch');
    document.documentElement.classList.add('launch');
    const hl = $('headline');
    const count = $('count');
    const date = $('date');
    const actions = document.getElementById('hero-actions');
    if (hl) hl.textContent = 'GTA 6 is out';
    if (count) count.innerHTML = '<div class="out">Launch Day</div><p class="launch-sub">Vice City is live. Check status, set the alarm, get your server.</p>';
    if (date) date.textContent = 'Offizielle Statusseite und Community-Hosting – alles an einem Ort.';
    if (actions) {
      actions.innerHTML =
        '<a class="dive dive-primary" href="https://support.rockstargames.com/servicestatus" target="_blank" rel="noopener">Rockstar Status</a>' +
        '<a class="dive" href="#alarm">Server-Alarm</a>' +
        '<a class="dive" href="gta6-server-hosting.html">Server mieten</a>' +
        '<a class="dive" href="partner.html">6PULSE × ZAP</a>';
    }
    const ticker = document.querySelector('.ticker div');
    if (ticker) {
      ticker.innerHTML = '<span>LAUNCH DAY</span><i></i><span>GTA 6 is out now</span><i></i><span>Check Rockstar status</span><i></i><span>Server &amp; TeamSpeak hosting</span><i></i><span>Status-Alarm aktivieren</span><i></i><span>6PULSE × ZAP</span><i></i><span>LAUNCH DAY</span><i></i><span>GTA 6 is out now</span><i></i><span>Check Rockstar status</span><i></i><span>Server &amp; TeamSpeak hosting</span><i></i><span>Status-Alarm aktivieren</span><i></i><span>6PULSE × ZAP</span><i></i>';
    }
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

  const bgEl = document.querySelector('.bg'), calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, tgt = 0, run = false;
  const step = () => {
    cur += (tgt - cur) * .12;
    if (calm || Math.abs(tgt - cur) < .001){ cur = tgt; run = false; } else requestAnimationFrame(step);
    if (bgEl) bgEl.style.setProperty('--d', cur.toFixed(4));
  };
  const depth = () => {
    const h = hero.offsetHeight;
    tgt = Math.min(1, Math.max(0, (scrollY - h * .3) / (h * .9)));
    if (!run){ run = true; requestAnimationFrame(step); }
  };
  addEventListener('scroll', depth, { passive: true });
  addEventListener('resize', depth); depth();
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
      if (e.isIntersecting){ e.target.classList.add('in'); o.unobserve(e.target); }
    }), { threshold: .25 }).observe(wheel);
  }
  document.querySelectorAll('.seg').forEach(g => {
    const on = () => { if ($('hub1')) $('hub1').textContent = g.dataset.name; if ($('hub2')) $('hub2').textContent = g.dataset.sub; };
    const off = () => { if ($('hub1')) $('hub1').textContent = 'GTA 6'; if ($('hub2')) $('hub2').textContent = 'Pick a slot'; };
    g.addEventListener('mouseenter', on); g.addEventListener('focus', on);
    g.addEventListener('mouseleave', off); g.addEventListener('blur', off);
  });
}

// category pages: lightbox + copy
document.addEventListener('click', e => {
  const c = e.target.closest('.copy');
  if (c){ navigator.clipboard.writeText(c.previousElementSibling.textContent).then(() => { c.textContent = 'Copied'; setTimeout(() => c.textContent = 'Copy', 1500); }).catch(() => {}); return; }
  const ph = e.target.closest('.ph');
  if (!ph) return;
  const img = ph.querySelector('img'), cap = ph.parentElement.querySelector('figcaption');
  if (!img) return;
  const lb = document.createElement('div'); lb.className = 'lb';
  lb.innerHTML = '<img src="' + img.src + '" alt="' + img.alt + '"><p>' + (cap ? cap.innerHTML : '') + '</p>';
  lb.onclick = () => lb.remove();
  document.body.append(lb);
});
addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelector('.lb')?.remove(); });

// status alarm: Formspree
document.querySelectorAll('form[data-subscribe]').forEach(f => f.addEventListener('submit', async e => {
  e.preventDefault();
  const msg = f.querySelector('.msg'), btn = f.querySelector('button');
  if (!msg || !btn) return;
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
      try { const data = await response.json(); detail = data.errors?.map(x => x.message).join(' '); } catch (_) {}
      throw new Error(detail || 'Formular konnte nicht gesendet werden.');
    }
    msg.textContent = 'Danke! Deine Anmeldung wurde übermittelt. Automatische Status-E-Mails werden erst nach Aktivierung des Alarmdienstes versendet.';
    f.reset();
  } catch (err) {
    msg.textContent = 'Das hat nicht geklappt. Bitte prüfe deine Verbindung und versuche es erneut.';
  } finally {
    btn.disabled = false;
  }
}));

const chips = document.querySelectorAll('[data-status]');
if (chips.length) fetch('https://raw.githubusercontent.com/MSMax15/NEON-PULSE/status-data/status.json')
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(s => {
    const L = { unlisted: 'Noch nicht bei Rockstar gelistet', up: 'Online', limited: 'Eingeschränkt', down: 'Gestört', maintenance: 'Wartung' };
    chips.forEach(c => { c.textContent = 'GTA 6 laut Rockstar: ' + (L[s.status] || 'unbekannt'); c.dataset.s = s.status; });
  })
  .catch(() => chips.forEach(c => { c.textContent = 'Status gerade nicht abrufbar'; }));

// VI nav toggle (mobile / tablet)
(() => {
  const btn = document.querySelector('.nav-vi');
  const panel = document.getElementById('nav-panel');
  if (!btn || !panel) return;
  const close = () => {
    btn.setAttribute('aria-expanded', 'false');
    panel.classList.remove('open');
    document.body.classList.remove('nav-open');
    btn.setAttribute('aria-label', 'Menü öffnen');
  };
  const open = () => {
    btn.setAttribute('aria-expanded', 'true');
    panel.classList.add('open');
    document.body.classList.add('nav-open');
    btn.setAttribute('aria-label', 'Menü schließen');
  };
  btn.addEventListener('click', () => {
    if (window.matchMedia('(min-width:961px)').matches) return;
    btn.getAttribute('aria-expanded') === 'true' ? close() : open();
  });
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  addEventListener('resize', () => { if (window.matchMedia('(min-width:961px)').matches) close(); });
})();

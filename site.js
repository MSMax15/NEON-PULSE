const $ = id => document.getElementById(id);
const bub = $('bubbles');
if (bub) bub.innerHTML = Array.from({ length: 14 }, (_, i) => { const s = 6 + (i * 7) % 18; return '<span style="left:' + ((i * 37) % 100) + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (9 + (i * 5) % 11) + 's;animation-delay:-' + (i * 3) % 12 + 's"></span>'; }).join('');

// home only: countdown, dive depth, mind map reveal
const hero = document.querySelector('.hero');
if (hero){
  const target = new Date(2026, 10, 19, 0, 0, 0).getTime();
  const tick = () => {
    const left = target - Date.now();
    if (left <= 0){ $('headline').textContent = 'Launch day'; $('count').innerHTML = '<div class="out">GTA 6 is out now</div>'; $('date').textContent = 'Servers busy? Check the server status link below.'; return false; }
    const p = n => String(n).padStart(2, '0');
    $('d').textContent = Math.floor(left / 864e5); $('h').textContent = p(Math.floor(left / 36e5) % 24);
    $('m').textContent = p(Math.floor(left / 6e4) % 60); $('s').textContent = p(Math.floor(left / 1e3) % 60);
    return true;
  };
  if (tick()){ const t = setInterval(() => { if (!tick()) clearInterval(t); }, 1000); }
  const bgEl = document.querySelector('.bg'), calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cur = 0, tgt = 0, run = false;
  const step = () => {
    cur += (tgt - cur) * .12;
    if (calm || Math.abs(tgt - cur) < .001){ cur = tgt; run = false; } else requestAnimationFrame(step);
    bgEl.style.setProperty('--d', cur.toFixed(4));
  };
  const depth = () => { const h = hero.offsetHeight; tgt = Math.min(1, Math.max(0, (scrollY - h * .3) / (h * .9))); if (!run){ run = true; requestAnimationFrame(step); } };
  addEventListener('scroll', depth, { passive: true });
  addEventListener('resize', depth); depth();
  if (!calm && matchMedia('(pointer: fine)').matches) addEventListener('mousemove', e => { bgEl.style.setProperty('--mx', (e.clientX / innerWidth - .5).toFixed(3)); bgEl.style.setProperty('--my', (e.clientY / innerHeight - .5).toFixed(3)); }, { passive: true });
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .25 }).observe($('wheel'));
  document.querySelectorAll('.seg').forEach(g => {
    const on = () => { $('hub1').textContent = g.dataset.name; $('hub2').textContent = g.dataset.sub; };
    const off = () => { $('hub1').textContent = 'GTA 6'; $('hub2').textContent = 'Pick a slot'; };
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

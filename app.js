
const API = 'https://telegram-lead-server-3zc1.onrender.com/submit';


document.getElementById('year').textContent = new Date().getFullYear();


const header = document.querySelector('.header');
document.querySelectorAll('[data-scroll]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('data-scroll'));
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const offset = (window.scrollY || window.pageYOffset) + rect.top;
    const h = header?.offsetHeight ?? 0;
    window.scrollTo({ top: offset - (h + 20), behavior: 'smooth' });
  });
});


const io = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// параллакс карточки (лёгкий)
const card = document.querySelector('.enver-card');
if (card) {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateZ(0) rotateX(${ -y * 3 }deg) rotateY(${ x * 4 }deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateZ(0)';
  });
}


const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const payload = {
    name: (fd.get('name') || '').toString().trim(),
    email: (fd.get('email') || '').toString().trim(),
    company: (fd.get('company') || '').toString().trim(),
    budget: (fd.get('budget') || '').toString().trim(),
    message: (fd.get('message') || '').toString().trim(),
  };
  for (const k of ['name', 'email', 'budget', 'message']) {
    if (!payload[k]) {
      note.textContent = 'Заполните обязательные поля.';
      return;
    }
  }
  note.textContent = 'Отправляем…';
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    note.textContent = 'Спасибо! Заявка отправлена.';
    form.reset();
  } catch (err) {
    console.error(err);
    note.textContent = 'Ошибка отправки. Попробуйте ещё раз.';
  }
});


(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('code-bg');
  if (!canvas || prefersReduced) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ctx = canvas.getContext('2d');
  let w, h, columns, drops, rafId;

  
  const glyphs = (
    '01<>/{}[]()=+*#%$@&;:?!' +
    ' const let var async await function return if else try catch' +
    ' <div> </div> fetch submit api token'
  ).split(' ');

  function resize() {
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    w = canvas.width;
    h = canvas.height;

    ctx.font = `${14 * dpr}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
    columns = Math.max(1, Math.floor(w / (14 * dpr)));
    drops = Array.from({ length: columns }, () => (Math.random() * h) | 0);
  }

  function tick() {
    // лёгкое затухание кадра — «следы»
    ctx.fillStyle = 'rgba(14,18,36,0.10)';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < drops.length; i++) {
      const text = glyphs[(Math.random() * glyphs.length) | 0];
      const x = i * (14 * dpr);
      const y = drops[i] * (16 * dpr);

      const grad = ctx.createLinearGradient(x, y - 20, x, y + 10);
      grad.addColorStop(0, 'rgba(108,99,255,0.65)');
      grad.addColorStop(1, 'rgba(0,255,224,0.55)');
      ctx.fillStyle = grad;
      ctx.fillText(text, x, y);

      
      if (y > h && Math.random() > 0.975) {
        drops[i] = 0;
      } else {
        drops[i]++;
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  tick();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      tick();
    }
  });
})();

import { projects, skills, certifications } from './data.js';

const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];

/* ── Cert illustration icons ── */
const certIcons = {
  1: { icon: 'ri-sparkling-2-line', label: 'AI · Prompt Eng' },
  2: { icon: 'ri-microsoft-line',   label: 'Microsoft AI'    },
  3: { icon: 'ri-shield-keyhole-line', label: 'Cybersecurity'},
  4: { icon: 'ri-calculator-line',  label: 'Abacus · UCMAS'  },
  5: { icon: 'ri-medal-line',       label: 'Martial Arts'    },
  6: { icon: 'ri-graduation-cap-line', label: 'CBSE'         },
};

/* ── Render Projects ── */
function renderProjects() {
  const el = $('#projects-grid');
  if (!el) return;
  el.innerHTML = projects.map((p, i) => `
    <article class="project-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="project-top">
        <span class="project-num">${String(i+1).padStart(2,'0')}</span>
        ${p.status ? `<span class="project-status">${p.status}</span>` : ''}
      </div>
      <div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-role">${p.role}${p.roleNote ? ` <span class="project-role-note">— ${p.roleNote}</span>` : ''}</p>
      </div>
      <p class="project-desc">${p.description}</p>
      <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
      <div class="project-foot">
        ${p.url
          ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn-launch"><i class="ri-external-link-line"></i> Launch Live Site</a>`
          : `<span class="btn-launch btn-launch-off"><i class="ri-archive-line"></i> Archived — No Live URL</span>`
        }
      </div>
    </article>
  `).join('');
}

/* ── Render Skills ── */
function renderSkills() {
  const el = $('#skills-container');
  if (!el) return;
  el.innerHTML = skills.map((g, i) => `
    <div class="skill-card reveal reveal-delay-${(i % 4) + 1}">
      <div class="skill-icon"><i class="${g.icon}"></i></div>
      <h3 class="skill-cat">${g.category}</h3>
      <ul class="skill-list">${g.items.map(item => `<li>${item}</li>`).join('')}</ul>
    </div>
  `).join('');
}

/* ── Render Certifications ── */
function renderCertifications() {
  const el = $('#certs-grid');
  if (!el) return;
  el.innerHTML = certifications.map((c, i) => {
    const meta = certIcons[c.id] || { icon: 'ri-award-line', label: 'Certificate' };
    return `
    <article class="cert-card reveal reveal-delay-${(i % 4) + 1}" data-cert-category="${c.category}">
      <div class="cert-illustration">
        <div class="cert-illustration-bg"></div>
        <div class="cert-dots"></div>
        <div class="cert-illustration-content">
          <i class="${meta.icon} cert-icon-large"></i>
          <span class="cert-illustration-title">${meta.label}</span>
        </div>
      </div>
      <div class="cert-body">
        <span class="cert-badge ${c.category}">${c.category === 'tech' ? '⚡ Tech & AI' : '🎓 Academic'}</span>
        <h3 class="cert-title">${c.title}</h3>
        <p class="cert-issuer">${c.issuer}</p>
        <p class="cert-detail">${c.detail}</p>
      </div>
    </article>`;
  }).join('');
}

/* ── Cert tab filter ── */
function initCertTabs() {
  const tabs = $$('.cert-tab');
  const grid = $('#certs-grid');
  function filter(f) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === f));
    if (!grid) return;
    $$('.cert-card', grid).forEach(card => {
      card.classList.toggle('hidden', f !== 'all' && card.dataset.certCategory !== f);
    });
  }
  tabs.forEach(t => t.addEventListener('click', () => filter(t.dataset.filter)));
  filter('all');
}

/* ── Scroll reveal ── */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ── Navbar scroll ── */
function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  let t = false;
  window.addEventListener('scroll', () => {
    if (!t) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        t = false;
      });
      t = true;
    }
  }, { passive: true });
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const btn  = $('#nav-hamburger');
  const menu = $('#mobile-menu');
  const cls  = $('#mobile-close');
  if (!btn || !menu) return;

  const open  = () => { menu.classList.add('open'); document.body.style.overflow = 'hidden'; btn.setAttribute('aria-expanded','true'); };
  const close = () => { menu.classList.remove('open'); document.body.style.overflow = ''; btn.setAttribute('aria-expanded','false'); };

  btn.addEventListener('click', open);
  cls?.addEventListener('click', close);
  $$('a', menu).forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
}

/* ── Custom cursor ── */
function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover:none)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function tick() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tick);
  }
  tick();

  const hover = $$('a, button, .project-card, .skill-card, .cert-card, .btn-launch');
  hover.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

/* ── Canvas background: particles + grid + mouse repel ── */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse = { x: -9999, y: -9999 };
  const COUNT = window.innerWidth < 600 ? 55 : 110;
  const CONNECT_DIST = 130;
  const MOUSE_DIST   = 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r  = Math.random() * 1.5 + 0.4;
    // mix of indigo, cyan, violet, white
    const palette = [
      'rgba(99,102,241,',
      'rgba(34,211,238,',
      'rgba(167,139,250,',
      'rgba(241,243,250,',
    ];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // subtle grid
    ctx.strokeStyle = 'rgba(255,255,255,0.018)';
    ctx.lineWidth = 1;
    const step = 64;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // update + draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // gentle mouse repulsion
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.018;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // dampen velocity
      p.vx *= 0.994;
      p.vy *= 0.994;

      p.x += p.vx;
      p.y += p.vy;

      // wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.8)';
      ctx.fill();

      // draw connecting lines
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x;
        const ey = p.y - q.y;
        const d  = Math.sqrt(ex * ex + ey * ey);
        if (d < CONNECT_DIST) {
          const alpha = (1 - d / CONNECT_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

  resize();
  initParticles();
  draw();
}

/* ── Typed badge ── */
function initTyped() {
  const el = $('.hero-badge-text');
  if (!el) return;
  const words = ['Full-Stack Web Developer','PCM + IP · Grade XII','Prompt Engineer','Building Since Standard 5','Open to Opportunities'];
  let wi = 0, ci = 0, del = false, delay = 110;
  function tick() {
    const w = words[wi];
    el.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
    if (!del) {
      ci++;
      delay = 95;
      if (ci === w.length) { del = true; delay = 2200; }
    } else {
      ci--;
      delay = 50;
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; delay = 380; }
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 2400);
}

/* ── Smooth anchor scroll ── */
function initScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' });
      }
    });
  });
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  renderProjects();
  renderSkills();
  renderCertifications();
  initCertTabs();
  initNavbar();
  initMobileMenu();
  initCursor();
  initTyped();
  initScroll();
  requestAnimationFrame(() => {
    initReveal();
    $$('.reveal').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.95) el.classList.add('visible');
    });
  });
});

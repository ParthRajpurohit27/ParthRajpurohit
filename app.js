// ============================================================
//  app.js — Application logic. Reads from data.js and renders
//  the full UI. Never edit this file to update portfolio data;
//  all data lives in data.js instead.
// ============================================================

import { projects, skills, certifications } from './data.js';

// ── Utility Helpers ──────────────────────────────────────────
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => parent.querySelectorAll(selector);

// ── Render Projects ──────────────────────────────────────────
function renderProjects() {
  const container = $('#projects-grid');
  if (!container) return;

  container.innerHTML = projects
    .map(
      (p, i) => `
    <article class="project-card reveal reveal-delay-${(i % 4) + 1}" aria-label="${p.title}">
      <div class="project-card-top">
        <span class="project-index">${String(i + 1).padStart(2, '0')}</span>
        ${p.status ? `<span class="project-status">${p.status}</span>` : ''}
      </div>

      <div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-role">
          ${p.role}
          ${p.roleNote ? `<span class="project-role-note"> — ${p.roleNote}</span>` : ''}
        </p>
      </div>

      <p class="project-description">${p.description}</p>

      <div class="project-tags">
        ${p.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join('')}
      </div>

      <div class="project-card-footer">
        ${
          p.url
            ? `<a href="${p.url}" target="_blank" rel="noopener noreferrer" class="btn-launch">
                <i class="ri-external-link-line"></i>
                Launch Live Site
               </a>`
            : `<span class="btn-launch btn-launch-disabled" aria-disabled="true">
                <i class="ri-archive-line"></i>
                Archived — No Live URL
               </span>`
        }
      </div>
    </article>
  `
    )
    .join('');
}

// ── Render Skills ─────────────────────────────────────────────
function renderSkills() {
  const container = $('#skills-container');
  if (!container) return;

  container.innerHTML = skills
    .map(
      (group, i) => `
    <div class="skill-card reveal reveal-delay-${(i % 4) + 1}" role="region" aria-label="${group.category}">
      <div class="skill-card-icon">
        <i class="${group.icon}"></i>
      </div>
      <h3 class="skill-category">${group.category}</h3>
      <ul class="skill-items" role="list">
        ${group.items
          .map((item) => `<li class="skill-item">${item}</li>`)
          .join('')}
      </ul>
    </div>
  `
    )
    .join('');
}

// ── Render Certifications ─────────────────────────────────────
function renderCertifications() {
  const container = $('#certs-grid');
  if (!container) return;

  container.innerHTML = certifications
    .map(
      (cert, i) => `
    <article
      class="cert-card reveal reveal-delay-${(i % 4) + 1}"
      data-cert-category="${cert.category}"
      aria-label="${cert.title}"
    >
      <div class="cert-image-wrap">
        <img
          src="${cert.image}"
          alt="Certificate: ${cert.title}"
          loading="lazy"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="cert-image-placeholder" style="display:none;">
          <i class="ri-award-line"></i>
          <span>Drop certificate image<br/>into assets/certs/</span>
        </div>
      </div>
      <div class="cert-body">
        <span class="cert-category-badge ${cert.category}">
          ${cert.category === 'tech' ? '⚡ Tech & AI' : '🎓 Academic'}
        </span>
        <h3 class="cert-title">${cert.title}</h3>
        <p class="cert-issuer">${cert.issuer}</p>
        <p class="cert-detail">${cert.detail}</p>
      </div>
    </article>
  `
    )
    .join('');
}

// ── Certifications Tab Filter ─────────────────────────────────
function initCertTabs() {
  const tabs = $$('.cert-tab');
  const grid = $('#certs-grid');

  function filterCerts(activeFilter) {
    tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.filter === activeFilter);
    });

    if (!grid) return;
    const cards = $$('.cert-card', grid);

    cards.forEach((card) => {
      if (activeFilter === 'all') {
        card.classList.remove('hidden');
      } else {
        const match = card.dataset.certCategory === activeFilter;
        card.classList.toggle('hidden', !match);
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterCerts(tab.dataset.filter);
    });
  });

  // Set default
  filterCerts('all');
}

// ── Scroll Reveal (Intersection Observer) ────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  $$('.reveal').forEach((el) => observer.observe(el));
}

// ── Navbar Scroll Effect ──────────────────────────────────────
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ── Mobile Menu ───────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = $('#nav-hamburger');
  const mobileMenu = $('#mobile-menu');
  const closeBtn = $('#mobile-close');

  if (!hamburger || !mobileMenu || !closeBtn) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);

  $$('a', mobileMenu).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── Active Nav Link Highlight ─────────────────────────────────
function initActiveSectionTracking() {
  const sections = $$('section[id]');
  const navLinks = $$('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color = link.getAttribute('href') === `#${id}`
              ? 'var(--text-primary)'
              : '';
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

// ── Typed Effect on Hero Badge ────────────────────────────────
function initHeroTyped() {
  const badge = $('.hero-badge-text');
  if (!badge) return;

  const texts = [
    'Full-Stack Web Developer',
    'PCM + IP · Grade 12',
    'Prompt Engineer · CBSE',
    'Building since Standard 5',
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 110;

  function type() {
    const current = texts[textIndex];

    if (!isDeleting) {
      badge.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      delay = 100;

      if (charIndex === current.length) {
        isDeleting = true;
        delay = 2000;
      }
    } else {
      badge.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      delay = 55;

      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        delay = 400;
      }
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
}

// ── Smooth Scroll for Anchor Links ───────────────────────────
function initSmoothScroll() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = $(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // account for fixed nav
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ── Boot: DOMContentLoaded ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Render all data-driven sections
  renderProjects();
  renderSkills();
  renderCertifications();

  // 2. Init UI interactions
  initCertTabs();
  initScrollReveal();
  initNavbar();
  initMobileMenu();
  initActiveSectionTracking();
  initHeroTyped();
  initSmoothScroll();

  // 3. Re-run scroll reveal after all renders
  // (re-query after innerHTML injection)
  requestAnimationFrame(() => {
    $$('.reveal').forEach((el) => {
      if (!el.classList.contains('visible')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92) {
          el.classList.add('visible');
        }
      }
    });
  });
});

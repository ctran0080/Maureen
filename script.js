/* ============================================================
   MAUREEN — Main Script
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   NAV — Scroll State & Mobile Toggle
   ============================================================ */
(function initNav() {
  const nav    = document.getElementById('main-nav');
  const toggle = document.querySelector('.nav__toggle');
  const links  = document.querySelector('.nav__links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 80);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('nav__links--open');
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('nav__links--open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ============================================================
   HERO — Entrance Animation Stagger
   ============================================================ */
(function initHeroEntrance() {
  const title    = document.querySelector('.hero__title');
  const subtitle = document.querySelector('.hero__subtitle');
  const tagline  = document.querySelector('.hero__tagline');
  const cta      = document.querySelector('.hero__cta');

  if (reducedMotion) {
    [title, subtitle, tagline, cta].forEach(el => {
      if (el) el.classList.add('is-visible');
    });
    return;
  }

  const sequence = [
    { el: title,    delay: 0    },
    { el: subtitle, delay: 400  },
    { el: tagline,  delay: 800  },
    { el: cta,      delay: 1400 },
  ];

  sequence.forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => el.classList.add('is-visible'), delay);
  });
})();

/* ============================================================
   HERO — Canvas Particle Atmosphere
   ============================================================ */
(function initParticles() {
  if (reducedMotion) return;

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  const PARTICLE_COUNT = 30;

  // Muted warm grays and barely-there reds — sparse, lonely
  const COLORS = [
    'rgba(138, 132, 128, VAL)',  // warm gray
    'rgba(160, 150, 140, VAL)',  // lighter warm gray
    'rgba(139, 26, 26, VAL)',    // blood red
  ];

  function randomColor(opacity) {
    const template = COLORS[Math.floor(Math.random() * COLORS.length)];
    return template.replace('VAL', opacity.toFixed(2));
  }

  function createParticle() {
    return {
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 1.0 + 0.2,
      vx:      (Math.random() - 0.5) * 0.08,
      vy:      -(Math.random() * 0.14 + 0.03),
      opacity: Math.random() * 0.08 + 0.02,
    };
  }

  function setup() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -4) p.y = canvas.height + 4;
      if (p.x < -4) p.x = canvas.width + 4;
      if (p.x > canvas.width + 4) p.x = -4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = randomColor(p.opacity);
      ctx.fill();
    });

    animFrameId = requestAnimationFrame(draw);
  }

  function handleResize() {
    cancelAnimationFrame(animFrameId);
    setup();
    draw();
  }

  setup();
  draw();

  window.addEventListener('resize', handleResize, { passive: true });
})();

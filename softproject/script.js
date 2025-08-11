// script.js
// Mobile nav, theme toggle, form validation, smooth scroll, and small utility helpers.

// DOM helpers
const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

/* --- Theme toggle with persistence --- */
const themeToggle = $('#theme-toggle');
const root = document.documentElement;
const storedTheme = localStorage.getItem('theme'); // 'light' or 'dark'

function applyTheme(theme) {
  if (theme === 'light') root.classList.add('light');
  else root.classList.remove('light');
  themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
}

if (storedTheme) applyTheme(storedTheme);
else {
  // Default: respect prefers-color-scheme
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(prefersLight ? 'light' : 'dark');
}

themeToggle?.addEventListener('click', () => {
  const isLight = root.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

/* --- Mobile menu toggle --- */
const mobileToggle = $('#mobile-menu-toggle');
const mobileMenu = $('#mobile-menu');

mobileToggle?.addEventListener('click', () => {
  const expanded = mobileToggle.getAttribute('aria-expanded') === 'true';
  mobileToggle.setAttribute('aria-expanded', String(!expanded));
  if (mobileMenu.hasAttribute('hidden')) {
    mobileMenu.removeAttribute('hidden');
  } else {
    mobileMenu.setAttribute('hidden', '');
  }
});

/* Close mobile menu when link clicked */
$$('#mobile-menu a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.setAttribute('hidden', '');
  mobileToggle.setAttribute('aria-expanded', 'false');
}));

/* --- Smooth scrolling for internal links --- */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href === '#' || href === '#0') return;
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (!el) return;
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
      // update history without jumping
      history.pushState(null, '', href);
    }
  });
});

/* --- Footer year --- */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* --- Contact form validation & fake submit --- */
const form = $('#contact-form');
const status = $('#form-status');

function showError(id, message) {
  const el = $(`#${id}`);
  if (el) el.textContent = message;
}

function clearErrors() {
  showError('error-name','');
  showError('error-email','');
  showError('error-message','');
}

function validateEmail(email) {
  // simple regex for validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  status.textContent = '';

  const name = (form.name.value || '').trim();
  const email = (form.email.value || '').trim();
  const message = (form.message.value || '').trim();
  let ok = true;

  if (name.length < 2) { showError('error-name','Please enter your name (2+ characters).'); ok = false; }
  if (!validateEmail(email)) { showError('error-email','Please enter a valid email.'); ok = false; }
  if (message.length < 10) { showError('error-message','Please write a short message (10+ characters).'); ok = false; }

  if (!ok) return;

  // Simulate submit (replace with actual fetch to server endpoint)
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.setAttribute('disabled','');
  submitBtn.textContent = 'Sending…';
  status.textContent = 'Sending message…';

  // Fake network delay
  setTimeout(() => {
    submitBtn.removeAttribute('disabled');
    submitBtn.textContent = 'Send message';
    form.reset();
    status.textContent = 'Thanks — your message was sent (simulation).';
  }, 1100);
});

/* --- Small accessibility improvement:
   When focus moves to an element with :focus-visible, ensure keyboard users see outline.
*/
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
});
document.addEventListener('mousedown', () => document.documentElement.classList.remove('user-is-tabbing'));
// script.js (add this at the bottom)

const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

let w, h, t = 0;
function resizeCanvas() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function draw() {
  t += 0.0025; // speed
  ctx.clearRect(0, 0, w, h);

  // Create gradient background
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, 'rgba(124,58,237,0.4)');
  grad.addColorStop(1, 'rgba(6,182,212,0.4)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Draw waves
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, h / 2);

    for (let x = 0; x <= w; x += 10) {
      const angle = (x / 200) + t * (i + 1) * 2;
      const y = Math.sin(angle) * (20 + i * 15) + (h / 2) + i * 20;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = `hsla(${200 + i * 60}, 70%, 60%, 0.5)`;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}
draw();


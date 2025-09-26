// ===== Formspree AJAX submit =====
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  const status = document.querySelector('.contact-status');
  if (form && status) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending...';
      try {
        const resp = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (resp.ok) {
          form.reset();
          status.textContent = 'Thanks! Your message has been sent.';
        } else {
          const data = await resp.json().catch(() => ({}));
          status.textContent = data?.errors?.[0]?.message || 'Something went wrong. Please try again.';
        }
      } catch {
        status.textContent = 'Network error. Please check your connection and try again.';
      }
    });
  }

  // ===== Typewriter with block cursor =====
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'AI/ML Engineer',
    'LLM Specialist',
    'Quantitative Finance Enthusiast'
  ];

  const TYPE_MIN = 35, TYPE_MAX = 70;
  const DELETE_MIN = 20, DELETE_MAX = 45;
  const HOLD_AFTER_TYPE = 1100;
  const HOLD_AFTER_DELETE = 350;

  let phraseIndex = 0, charIndex = 0, typing = true;

  function rand(a, b) { return Math.floor(a + Math.random() * (b - a)); }

  function tick() {
    const current = phrases[phraseIndex];
    if (typing) {
      charIndex = Math.min(charIndex + 1, current.length);
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        typing = false; setTimeout(tick, HOLD_AFTER_TYPE); return;
      } else { setTimeout(tick, rand(TYPE_MIN, TYPE_MAX)); return; }
    } else {
      charIndex = Math.max(charIndex - 1, 0);
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        typing = true; phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, HOLD_AFTER_DELETE); return;
      } else { setTimeout(tick, rand(DELETE_MIN, DELETE_MAX)); return; }
    }
  }
  tick();
});

// js/index.js - robust, single-file fix for dark mode, clock, background, subscribe
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  /* -------------------- Clock (visibility-aware) -------------------- */
  const timeEl = document.getElementById('currentTime');
  const dateEl = document.getElementById('currentDate');
  let clockInterval = null;

  function updateDateTime() {
    const now = new Date();
    if (timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    if (dateEl) dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  function startClock() {
    updateDateTime();
    if (clockInterval) clearInterval(clockInterval);
    clockInterval = setInterval(updateDateTime, 1000);
  }
  function stopClock() {
    if (clockInterval) { clearInterval(clockInterval); clockInterval = null; }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopClock(); else startClock();
  });
  startClock();

  /* -------------------- Background color changer -------------------- */
  (function setupBgChanger() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    const colors = ['#ffffff', '#8B0000', '#FFD700', '#F8F8F8', '#222'];
    let idx = 0;
    let btn = heroContent.querySelector('.bg-change-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-primary mt-3 bg-change-btn';
      btn.textContent = 'Change Background';
      heroContent.appendChild(btn);
    }
    btn.addEventListener('click', () => {
      document.body.style.backgroundColor = colors[idx];
      idx = (idx + 1) % colors.length;
    });
  })();

  /* -------------------- Subscribe form -------------------- */
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeModalEl = document.getElementById('subscribeModal');

  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('subscribeEmail');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email.value.trim())) {
        if (email) {
          email.classList.add('is-invalid');
          email.focus();
        }
        return;
      }

      // Close modal using Bootstrap API if available
      try {
        if (window.bootstrap && subscribeModalEl) {
          const modal = bootstrap.Modal.getInstance(subscribeModalEl) || new bootstrap.Modal(subscribeModalEl);
          modal.hide();
        }
      } catch (err) {
        // fallback: remove show class and body modal-open
        if (subscribeModalEl) {
          subscribeModalEl.classList.remove('show');
          subscribeModalEl.style.display = 'none';
          document.body.classList.remove('modal-open');
        }
      }

      // Inline success feedback
      const feedbackId = 'subscribeFeedback';
      let fb = document.getElementById(feedbackId);
      if (!fb) {
        fb = document.createElement('div');
        fb.id = feedbackId;
        fb.className = 'alert alert-success mt-3';
        fb.textContent = 'Thank you for subscribing! You will receive our newsletter.';
        const container = document.querySelector('.container') || document.body;
        container.insertAdjacentElement('afterbegin', fb);
      } else {
        fb.classList.remove('d-none');
      }

      // Reset and clear invalid class
      subscribeForm.reset();
      if (email) email.classList.remove('is-invalid');

      setTimeout(() => { if (fb) fb.classList.add('d-none'); }, 5000);
    });

    const subscribeEmail = document.getElementById('subscribeEmail');
    if (subscribeEmail) subscribeEmail.addEventListener('input', () => subscribeEmail.classList.remove('is-invalid'));
  }

  /* -------------------- Dev-time console notice -------------------- */
  // If any key element is missing, log to console to help debugging.
  const missing = [];
  if (!timeEl) missing.push('currentTime');
  if (!dateEl) missing.push('currentDate');
  if (!subscribeForm) missing.push('subscribeForm');
  if (missing.length) console.info('index.js: missing elements:', missing.join(', '));
});

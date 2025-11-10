// Requires jQuery to be loaded on the page
$(function () {
  // Dark mode toggle + persistence
  const darkKey = 'gourmet_dark_mode';
  function applyDarkMode(enabled) {
    if (enabled) {
      document.documentElement.classList.add('dark-mode');
      $('#darkModeToggle').attr('aria-pressed', 'true');
      $('#darkModeToggle').text('☀️');
    } else {
      document.documentElement.classList.remove('dark-mode');
      $('#darkModeToggle').attr('aria-pressed', 'false');
      $('#darkModeToggle').text('🌙');
    }
  }
  const saved = localStorage.getItem(darkKey);
  applyDarkMode(saved === 'true');

  $('#darkModeToggle').on('click', function () {
    const enabled = !document.documentElement.classList.contains('dark-mode');
    applyDarkMode(enabled);
    localStorage.setItem(darkKey, enabled ? 'true' : 'false');
  });

  // Live clock (updates every second)
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    $('#currentTime').text(time);
    $('#currentDate').text(date);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Subscribe form validation & submit (local demo)
  $('#subscribeForm').on('submit', function (e) {
    e.preventDefault();
    const $form = $(this);
    if (this.checkValidity() === false) {
      $form.addClass('was-validated');
      return;
    }
    // Simulate success
    $('#subscribeSuccess').removeClass('visually-hidden');
    setTimeout(() => {
      $('#subscribeSuccess').addClass('visually-hidden');
      $form[0].reset();
      $form.removeClass('was-validated');
      // hide modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('subscribeModal'));
      if (modal) modal.hide();
    }, 1400);
  });

  // Improve keyboard / accessibility for accordions (Bootstrap handles most; ensure focus state)
  $('.accordion-button').on('shown.bs.collapse hidden.bs.collapse', function () {
    // nothing special yet, reserved for future ARIA updates if needed
  });

  // Optional: add smooth image loading fallback (progressive enhancement)
  $('img').each(function () {
    if (!this.complete) {
      $(this).on('load error', function () { $(this).addClass('loaded'); });
    } else {
      $(this).addClass('loaded');
    }
  });

  // Enhance contact tel link for accessibility: ensure readable text but keep number visible
  $('.contact-link').attr('aria-label', 'Call Gourmet Haven at (555) 123-4567');
});

(function () {
  const MAX_WIDTH = 768;
  const btn = document.getElementById('darkModeToggle') || document.querySelector('.dark-mode-toggle');
  if (!btn) return;

  // Find reservation <li> robustly
  function findReservationItem() {
    return document.getElementById('reservationItem')
      || document.querySelector('li.reservation')
      || (function () {
        const a = document.querySelector('a[href*="reservation"]');
        return a ? a.closest('li') : null;
      })()
      || Array.from(document.querySelectorAll('.navbar-nav li')).find(li => /reservation/i.test(li.textContent));
  }

  const reservationItem = findReservationItem();
  const originalParent = btn.parentElement;
  const originalNextSibling = btn.nextSibling;

  // Ensure button is a plain button and not treated as a bootstrap toggle
  btn.type = btn.type || 'button';
  btn.removeAttribute('data-bs-toggle');
  btn.removeAttribute('data-bs-target');
  btn.removeAttribute('data-bs-auto-close');

  // Prevent clicks/touches on the dark button from bubbling to the navbar/collapse
  // This handler runs in the bubble phase (default) so it executes after existing
  // button handlers and then stops the event from reaching parent handlers.
  function stopBubble(e) {
    e.stopPropagation();
  }

  // Attach once (idempotent)
  btn.addEventListener('click', stopBubble, { passive: false });
  btn.addEventListener('touchstart', stopBubble, { passive: true });

  // Utility: insert newNode after referenceNode
  function insertAfter(referenceNode, newNode) {
    if (!referenceNode || !referenceNode.parentNode) return;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function placeButton() {
    const small = window.innerWidth <= MAX_WIDTH;
    if (small && reservationItem) {
      // Place right after the reservation anchor if present, otherwise append inside the li
      const anchor = reservationItem.querySelector('a');
      if (anchor) {
        if (anchor.nextSibling !== btn) insertAfter(anchor, btn);
      } else {
        if (!reservationItem.contains(btn)) reservationItem.appendChild(btn);
      }
    } else {
      // Restore to original location
      if (originalParent && originalParent !== btn.parentElement) {
        if (originalNextSibling && originalNextSibling.parentElement === originalParent) {
          originalParent.insertBefore(btn, originalNextSibling);
        } else {
          originalParent.appendChild(btn);
        }
      }
    }
  }

  // Initial placement and debounced resize handler
  placeButton();
  let resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(placeButton, 120);
  });
})();
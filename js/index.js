// consolidated-darkmode-and-safe-move.js
$(function () {
  const MAX_WIDTH = 768;
  const STORAGE_KEY = 'gourmet_dark_mode';
  const DARK_CLASS = 'dark-mode';

  // Find or create the button
  let $btn = $('#darkModeToggle');
  if (!$btn.length) $btn = $('.dark-mode-toggle').first();
  const $navbar = $('.navbar-nav').first();

  if (!$btn.length) {
    // create a single button if none exists
    const $new = $('<button>', {
      id: 'darkModeToggle',
      class: 'dark-mode-toggle btn btn-sm',
      type: 'button',
      title: 'Toggle Dark Mode',
      'aria-pressed': 'false',
      text: '🌙'
    });
    if ($navbar.length) $navbar.append($new);
    $btn = $('#darkModeToggle');
  }

  // Normalize and remove bootstrap toggle attributes
  $btn.attr('type', 'button');
  $btn.removeAttr('data-bs-toggle').removeAttr('data-bs-target').removeAttr('data-bs-auto-close');

  const rawBtn = $btn.get(0);
  const $reservationLi = $('#reservationItem').length ? $('#reservationItem') : $('li.reservation').first();

  // Save original location for restore
  const originalParent = rawBtn.parentNode;
  const originalNextSibling = rawBtn.nextSibling;

  // Dark mode helpers
  function setButtonUI(enabled) {
    $btn.attr('aria-pressed', String(enabled));
    $btn.text(enabled ? '☀️' : '🌙');
  }

  function applyDarkMode(enabled) {
    document.documentElement.classList.toggle(DARK_CLASS, enabled);
    document.body.classList.toggle(DARK_CLASS, enabled);
    setButtonUI(enabled);
    try { localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false'); } catch (e) {}
  }

  // Initialize from storage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    applyDarkMode(saved === 'true');
  } catch (e) {
    applyDarkMode(false);
  }

  // Single click handler (remove previous handlers first)
  $btn.off('click').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation(); // stop bubble in case capture didn't run
    const enabled = !document.documentElement.classList.contains(DARK_CLASS);
    applyDarkMode(enabled);
    try { this.blur(); } catch (err) {}
  });

  // Stop pointer/touch events in capture phase so Bootstrap never sees them
  if (rawBtn) {
    rawBtn.addEventListener('pointerdown', function (e) { e.stopPropagation(); }, { capture: true });
    rawBtn.addEventListener('touchstart', function (e) { e.stopPropagation(); }, { passive: true, capture: true });
  }

  // Move/restore logic (preserves same DOM element)
  function insertAfter(referenceNode, newNode) {
    if (!referenceNode || !referenceNode.parentNode) return;
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  function placeButton() {
    const small = window.innerWidth <= MAX_WIDTH;
    if (small && $reservationLi.length) {
      const anchor = $reservationLi.find('a').get(0);
      if (anchor) {
        if (anchor.nextSibling !== rawBtn) insertAfter(anchor, rawBtn);
      } else {
        if (!$reservationLi.has(rawBtn).length) $reservationLi.append(rawBtn);
      }
    } else {
      // restore to original location
      if (originalParent && originalParent !== rawBtn.parentElement) {
        if (originalNextSibling && originalNextSibling.parentElement === originalParent) {
          originalParent.insertBefore(rawBtn, originalNextSibling);
        } else {
          originalParent.appendChild(rawBtn);
        }
      }
    }
  }

  // Initial placement and debounced resize
  placeButton();
  let resizeTimer = null;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(placeButton, 120);
  });

  // Debug helper
  window.__gourmetDarkButton = {
    element: rawBtn,
    place: placeButton,
    applyDarkMode
  };
});

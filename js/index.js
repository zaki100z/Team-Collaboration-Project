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

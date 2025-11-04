$(function () {
  const darkKey = 'gourmet_dark_mode';

  function applyDarkMode(enabled) {
    if (enabled) {
      document.documentElement.classList.add('dark-mode');
      $('#darkModeToggle').attr('aria-pressed', 'true').text('☀️');
    } else {
      document.documentElement.classList.remove('dark-mode');
      $('#darkModeToggle').attr('aria-pressed', 'false').text('🌙');
    }
  }

  // Initialize dark mode from localStorage
  const saved = localStorage.getItem(darkKey);
  applyDarkMode(saved === 'true');

  $('#darkModeToggle').on('click', function () {
    const enabled = !document.documentElement.classList.contains('dark-mode');
    applyDarkMode(enabled);
    localStorage.setItem(darkKey, enabled ? 'true' : 'false');
  });

  // Live clock for header/footer usage (updates every second)
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

    // Placeholders in case other pages use these IDs
    if ($('#currentTime').length) $('#currentTime').text(time);
    if ($('#currentDate').length) $('#currentDate').text(date);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Ensure images get a small loaded class for progressive styling if needed
  $('img').each(function () {
    if (!this.complete) {
      $(this).on('load error', () => $(this).addClass('loaded'));
    } else $(this).addClass('loaded');
  });

  // Improve accessibility on contact link
  $('.contact-link').attr('aria-label', 'Call Gourmet Haven at (555) 123-4567');

  // Small UI polish: highlight active nav link
  $('.nav-link').each(function () {
    if (location.pathname.endsWith('about.html') && $(this).attr('href') === 'about.html') {
      $(this).addClass('active');
    }
  });
});

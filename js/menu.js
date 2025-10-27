$(document).ready(function() {

    // ===== VARIABLES =====
    let darkMode = false;
    const clickSound = new Audio('mixkit-camera-shutter-click-1133.wav');

    // ===== POPUP OPEN / CLOSE =====
    $('#openPopup').click(function() {
        $('#popupForm').fadeIn(500);
        clickSound.play();
    });

    $('#closePopup, #popupForm').click(function(e) {
        if (e.target.id === 'popupForm' || e.target.id === 'closePopup') {
            $('#popupForm').fadeOut(500);
        }
    });

    // ===== FORM VALIDATION =====
    $('#subscribeForm').submit(function(e) {
        e.preventDefault();
        const email = $('#email').val().trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '' || !emailPattern.test(email)) {
            $('<div class="popup-message">Please enter a valid email!</div>')
                .appendTo('#popupForm .popup-content')
                .fadeIn(300)
                .delay(1500)
                .fadeOut(300, function() { $(this).remove(); });
            return;
        }

        $('<div class="popup-message">Thank you for subscribing!</div>')
            .appendTo('#popupForm .popup-content')
            .fadeIn(300)
            .delay(1500)
            .fadeOut(300, function() { $(this).remove(); });

        $(this)[0].reset();
        $('#popupForm').fadeOut(500);
    });

    // ===== ACCORDION =====
    $('.accordion-header').click(function() {
        $(this).next('.accordion-body').slideToggle(300);
        $(this).toggleClass('active');
    });

    // ===== CHANGE BACKGROUND COLOR / DARK MODE =====
    $('#colorBtn').click(function() {
        $('body').animate(
            { backgroundColor: darkMode ? '#F8F8F8' : '#222', color: darkMode ? '#333' : 'white' },
            500
        );
        darkMode = !darkMode;
        $(this).text(darkMode ? 'Change Theme' : 'Switch to Light Theme');
    });

    // ===== DISPLAY CURRENT DATE AND TIME =====
    function updateDateTime() {
        const now = new Date();
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        $('#dateTime').text(now.toLocaleDateString('en-US', options));
    }

    setInterval(function() {
        $('#dateTime').fadeOut(500).fadeIn(500);
        updateDateTime();
    }, 1000);
    updateDateTime();

    // ===== BUTTON HOVER EFFECT =====
    $('button').hover(
        function() { $(this).css('transform', 'scale(1.05)'); },
        function() { $(this).css('transform', 'scale(1)'); }
    );

});

$(document).ready(function() {

    // ===== ЗВУК КЛИКА (если есть тот же файл) =====
    const clickSound = new Audio('mixkit-camera-shutter-click-1133.wav');
    let darkMode = false;

    // ===== POPUP =====
    const $popup = $('#popupForm');
    const $openBtn = $('#popupBtn');
    const $closeBtn = $('#closePopup');

    // Открытие popup
    $openBtn.on('click', function() {
        $popup.fadeIn(500);
        clickSound.play();
    });

    // Закрытие popup по кнопке или клику вне
    $closeBtn.add($popup).on('click', function(e) {
        if (e.target.id === 'popupForm' || e.target.id === 'closePopup') {
            $popup.fadeOut(500);
        }
    });

    // ===== ВАЛИДАЦИЯ ФОРМЫ =====
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === '' || email === '' || message === '') {
            $('<div class="popup-message">Please fill in all fields!</div>')
                .appendTo('#popupForm .popup-content')
                .fadeIn(300)
                .delay(1500)
                .fadeOut(300, function() { $(this).remove(); });
            return;
        }

        if (!emailPattern.test(email)) {
            $('<div class="popup-message">Please enter a valid email!</div>')
                .appendTo('#popupForm .popup-content')
                .fadeIn(300)
                .delay(1500)
                .fadeOut(300, function() { $(this).remove(); });
            return;
        }

        $('<div class="popup-message">Message sent successfully!</div>')
            .appendTo('#popupForm .popup-content')
            .fadeIn(300)
            .delay(1500)
            .fadeOut(300, function() { $(this).remove(); });

        this.reset();
        $popup.fadeOut(500);
    });

    // ===== АККОРДЕОН =====
    $('.accordion-header').on('click', function() {
        $(this).next('.accordion-body').slideToggle(300);
        $(this).toggleClass('active');
    });

    // ===== ИЗМЕНЕНИЕ ЦВЕТА / ТЕМЫ =====
    $('#colorBtn').on('click', function() {
        $('body').animate(
            { backgroundColor: darkMode ? '#F8F8F8' : '#222', color: darkMode ? '#333' : 'white' },
            500
        );
        darkMode = !darkMode;
        $(this).text(darkMode ? 'Change Theme' : 'Switch to Light Theme');
    });

    // ===== ДАТА И ВРЕМЯ =====
    function updateDateTime() {
        const now = new Date();
        const options = { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        $('#dateTime').text(now.toLocaleDateString('en-US', options));
    }

    setInterval(function() {
        $('#dateTime').fadeOut(500).fadeIn(500);
        updateDateTime();
    }, 1000);
    updateDateTime();

    // ===== ХОВЕР ЭФФЕКТЫ (анимация при наведении) =====
    $('button, .accordion-header, a, input, textarea').hover(
        function() {
            $(this).css({
                transform: 'scale(1.05)',
                transition: 'transform 0.2s ease'
            });
        },
        function() {
            $(this).css({
                transform: 'scale(1)',
                transition: 'transform 0.2s ease'
            });
        }
    );
});

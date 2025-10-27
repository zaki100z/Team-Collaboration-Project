// ===== Подключаем jQuery, если еще не подключен =====
// Убедись, что в HTML перед этим файлом есть:
// <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

$(document).ready(function() {

    // ===== POPUP FORM =====
    const $popup = $('#popupForm');
    const $openBtn = $('#popupBtn');
    const $closeBtn = $('#closePopup');

    // Открытие popup
    $openBtn.on('click', function() {
        $popup.fadeIn(200);
    });

    // Закрытие popup по кнопке
    $closeBtn.on('click', function() {
        $popup.fadeOut(200);
    });

    // Закрытие popup по клику вне окна
    $popup.on('click', function(e) {
        if (e.target === this) {
            $popup.fadeOut(200);
        }
    });

    // ===== CONTACT FORM VALIDATION =====
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();

        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const message = $('#message').val().trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === '' || email === '' || message === '') {
            alert('Please fill in all required fields!');
            return;
        }

        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address!');
            return;
        }

        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
        $popup.fadeOut(200);
    });

    // ===== ACCORDION =====
    $('.accordion-header').on('click', function() {
        const $body = $(this).next('.accordion-body');
        $body.slideToggle(200);
    });

    // ===== CHANGE BACKGROUND COLOR (THEME) =====
    const colors = ['#FFD700', '#8B0000', '#006400', '#1E90FF', '#8A2BE2', '#F8F8F8'];
    $('#colorBtn').on('click', function() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        $('body').css('background-color', randomColor);
    });

    // ===== DISPLAY CURRENT DATE AND TIME =====
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

    setInterval(updateDateTime, 1000);
    updateDateTime();
});

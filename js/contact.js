// ===== VARIABLES =====
const popup = document.getElementById('popupForm');
const openBtn = document.getElementById('popupBtn');
const closeBtn = document.getElementById('closePopup');
const contactForm = document.getElementById('contactForm');
const accHeaders = document.querySelectorAll('.accordion-header');
const colorBtn = document.getElementById('colorBtn');

// 🎵 Звук при открытии popup
const clickSound = new Audio('mixkit-camera-shutter-click-1133.wav');

// ===== POPUP OPEN / CLOSE =====
openBtn.addEventListener('click', () => {
    clickSound.play();
    popup.style.display = 'flex';
});

closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Закрытие popup по клику вне окна
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

// ===== CONTACT FORM VALIDATION =====
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

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
    popup.style.display = 'none';
});

// ===== ACCORDION =====
accHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        body.style.display = body.style.display === 'block' ? 'none' : 'block';
    });
});

// ===== DARK / LIGHT MODE =====
let darkMode = false;

colorBtn.addEventListener('click', () => {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.style.backgroundColor = '#222';
        document.body.style.color = 'white';
        colorBtn.textContent = 'Switch to Light Theme';
    } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = '#333';
        colorBtn.textContent = 'Switch to Dark Theme';
    }
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
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
}

setInterval(updateDateTime, 1000);
updateDateTime();

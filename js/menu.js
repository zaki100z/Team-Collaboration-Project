// ===== VARIABLES =====
const popup = document.getElementById('popupForm');
const openBtn = document.getElementById('openPopup');
const closeBtn = document.getElementById('closePopup');
const colorBtn = document.getElementById('colorBtn'); // Было использовано до объявления — исправлено
const subscribeForm = document.getElementById('subscribeForm');
const accHeaders = document.querySelectorAll('.accordion-header');

// 🎵 Звук при открытии popup
const clickSound = new Audio('mixkit-camera-shutter-click-1133.wav');

// ===== POPUP OPEN / CLOSE =====
openBtn.addEventListener('click', () => {
    clickSound.play(); // проигрываем звук
    popup.style.display = 'flex'; // открываем popup
});

// Close popup by close button
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Close popup by clicking outside popup content
popup.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

// ===== FORM VALIDATION =====
subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        alert('Email field is required!');
        return;
    }
    
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    alert('Thank you for subscribing!');
    this.reset();
    popup.style.display = 'none';
});

// ===== ACCORDION =====
accHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        // Toggle display
        if (body.style.display === 'block') {
            body.style.display = 'none';
        } else {
            body.style.display = 'block';
        }
    });
});

// ===== CHANGE BACKGROUND COLOR / DARK MODE =====
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

// Update every second
setInterval(updateDateTime, 1000);
updateDateTime();

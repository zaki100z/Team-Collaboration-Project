// ===== POPUP FORM =====
const popup = document.getElementById('popupForm');
const openBtn = document.getElementById('popupBtn');
const closeBtn = document.getElementById('closePopup');

openBtn.addEventListener('click', () => popup.style.display = 'flex');
closeBtn.addEventListener('click', () => popup.style.display = 'none');
window.addEventListener('click', e => {
    if (e.target === popup) popup.style.display = 'none';
});

// ===== FORM VALIDATION =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
    popup.style.display = 'none';
});

// ===== ACCORDION =====
const accHeaders = document.querySelectorAll('.accordion-header');
accHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        body.style.display = body.style.display === 'block' ? 'none' : 'block';
    });
});

// ===== CHANGE BACKGROUND COLOR =====
const colorBtn = document.getElementById('colorBtn');
colorBtn.addEventListener('click', () => {
    const colors = ['#FFD700', '#8B0000', '#006400', '#1E90FF', '#8A2BE2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
});

// ===== DISPLAY DATE AND TIME =====
function updateDateTime() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

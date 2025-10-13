// ===== POPUP FORM =====
const popup = document.getElementById('popupForm');
const openBtn = document.getElementById('openPopup');
const closeBtn = document.getElementById('closePopup');

openBtn.addEventListener('click', () => popup.style.display = 'flex');
closeBtn.addEventListener('click', () => popup.style.display = 'none');
window.addEventListener('click', e => {
    if (e.target === popup) popup.style.display = 'none';
});

// ===== FORM VALIDATION =====
document.getElementById('subscribeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }

    alert('Thank you for subscribing!');
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

// ===== BACKGROUND COLOR CHANGER =====
const colorBtn = document.getElementById('colorBtn');
colorBtn.addEventListener('click', () => {
    const colors = ['#FFD700', '#8B0000', '#006400', '#1E90FF', '#8A2BE2'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
});

// ===== CURRENT DATE & TIME =====
function updateDateTime() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('dateTime').textContent = now.toLocaleDateString('en-US', options);
}
setInterval(updateDateTime, 1000);
updateDateTime();

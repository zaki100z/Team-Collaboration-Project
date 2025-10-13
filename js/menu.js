// ===== POPUP FORM =====
const popup = document.getElementById('popupForm');
const openBtn = document.getElementById('openPopup');
const closeBtn = document.getElementById('closePopup');

// Open popup
openBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
});

// Close popup by close button
closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Close popup by clicking outside
window.addEventListener('click', (e) => {
    if (e.target === popup) {
        popup.style.display = 'none';
    }
});

// ===== FORM VALIDATION =====
const subscribeForm = document.getElementById('subscribeForm');

subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === '') {
        alert('Email field is required!');
        return;
    }
    
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    
    // Success
    alert('Thank you for subscribing!');
    this.reset();
    popup.style.display = 'none';
});

// ===== ACCORDION =====
const accHeaders = document.querySelectorAll('.accordion-header');

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

// ===== CHANGE BACKGROUND COLOR =====
const colorBtn = document.getElementById('colorBtn');

colorBtn.addEventListener('click', () => {
    const colors = ['#FFD700', '#8B0000', '#006400', '#1E90FF', '#8A2BE2', '#F8F8F8'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
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
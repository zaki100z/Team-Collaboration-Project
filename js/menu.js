// ===== POPUP FORM =====
const popup = document.getElementById('popupForm');
const openBtn = document.getElementById('openPopup');
const closeBtn = document.getElementById('closePopup');

// Open popup with fade-in effect
openBtn.addEventListener('click', () => {
    popup.style.display = 'flex';
    popup.style.opacity = '0';
    setTimeout(() => popup.style.opacity = '1', 10);
});

// Close popup
closeBtn.addEventListener('click', closePopup);

// Close popup when clicking outside
window.addEventListener('click', e => {
    if (e.target === popup) closePopup();
});

function closePopup() {
    popup.style.opacity = '0';
    setTimeout(() => popup.style.display = 'none', 300);
}

// Close popup with Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && popup.style.display === 'flex') {
        closePopup();
    }
});

// ===== FORM VALIDATION =====
const subscribeForm = document.getElementById('subscribeForm');
const emailInput = document.getElementById('email');

subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showMessage('Please enter a valid email address!', 'error');
        emailInput.focus();
        return;
    }

    // Success message
    showMessage('Thank you for subscribing! Check your email for updates.', 'success');
    this.reset();
    
    // Close popup after short delay
    setTimeout(closePopup, 1500);
});

// Show custom message instead of alert
function showMessage(message, type) {
    const existingMsg = document.querySelector('.custom-message');
    if (existingMsg) existingMsg.remove();

    const msgDiv = document.createElement('div');
    msgDiv.className = `custom-message ${type}`;
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Add keyframe animations for messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .popup { transition: opacity 0.3s ease; }
`;
document.head.appendChild(style);

// ===== ACCORDION (Enhanced) =====
const accHeaders = document.querySelectorAll('.accordion-header');

accHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        const isOpen = body.style.display === 'block';
        
        // Close all accordion items
        document.querySelectorAll('.accordion-body').forEach(item => {
            item.style.display = 'none';
        });
        
        // Remove active class from all headers
        accHeaders.forEach(h => h.classList.remove('active'));
        
        // Toggle current item
        if (!isOpen) {
            body.style.display = 'block';
            header.classList.add('active');
        }
    });
});

// ===== THEME CHANGER =====
const colorBtn = document.getElementById('colorBtn');
let currentTheme = 0;

const themes = [
    { bg: '#F8F8F8', primary: '#8B0000', name: 'Classic' },
    { bg: '#1a1a2e', primary: '#FFD700', name: 'Dark Gold' },
    { bg: '#f0e5d8', primary: '#006400', name: 'Natural' },
    { bg: '#e8f4f8', primary: '#1E90FF', name: 'Ocean' },
    { bg: '#2d1b4e', primary: '#8A2BE2', name: 'Royal Purple' }
];

colorBtn.addEventListener('click', () => {
    currentTheme = (currentTheme + 1) % themes.length;
    const theme = themes[currentTheme];
    
    // Apply theme with smooth transition
    document.body.style.transition = 'background-color 0.5s ease';
    document.body.style.backgroundColor = theme.bg;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', theme.primary);
    
    // Update button text
    colorBtn.textContent = `Theme: ${theme.name}`;
    
    // Show notification
    showThemeNotification(theme.name);
});

function showThemeNotification(themeName) {
    const notification = document.createElement('div');
    notification.textContent = `✨ ${themeName} Theme Applied`;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 25px;
        z-index: 10000;
        animation: fadeInOut 2s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Add fadeInOut animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(20px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(fadeStyle);

// ===== DATE & TIME (Enhanced) =====
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    const dateTimeElement = document.getElementById('dateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = `🕒 ${now.toLocaleDateString('en-US', options)}`;
    }
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== LAZY LOADING IMAGES =====
const images = document.querySelectorAll('.item-img img');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            // If image is already cached
            if (img.complete) {
                img.style.opacity = '1';
            }
            
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== SCROLL TO TOP BUTTON =====
const scrollBtn = document.createElement('button');
scrollBtn.innerHTML = '↑';
scrollBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-color);
    color: white;
    border: none;
    font-size: 24px;
    cursor: pointer;
    display: none;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
`;
scrollBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.transform = 'scale(1.1)';
});

scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.transform = 'scale(1)';
});

// ===== MENU ITEM ANIMATION ON SCROLL =====
const menuItems = document.querySelectorAll('.menu-item');
const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            itemObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

menuItems.forEach(item => {
    item.style.opacity = '0';
    itemObserver.observe(item);
});

// Add fadeInUp animation
const animStyle = document.createElement('style');
animStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(animStyle);

console.log('🍽️ Gourmet Haven Menu - All features loaded successfully!');
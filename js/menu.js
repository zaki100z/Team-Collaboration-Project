// Advanced JavaScript for Menu Page with Dark Mode, Cart and Local Storage
document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM SELECTION ==========
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeToggle = document.getElementById('themeToggle');
    const subscribeForm = document.getElementById('subscribeForm');
    const dateTimeElement = document.getElementById('dateTime');
    const cartToggle = document.getElementById('cartToggle');
    const cartPanel = document.getElementById('cartPanel');
    const cartList = document.getElementById('cartList');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const clearCart = document.getElementById('clearCart');
    const submitOrder = document.getElementById('submitOrder');

    // ========== MENU MANAGER ==========
    const menuManager = {
        subscriptions: JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [],
        cart: JSON.parse(localStorage.getItem('menuCart')) || [],
        userPreferences: JSON.parse(localStorage.getItem('userPreferences')) || { theme: 'light' },

        addSubscription(email) {
            const subscription = { email, date: new Date().toISOString(), id: this.generateId() };
            this.subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(this.subscriptions));
        },

        addToCart(item) {
            this.cart.push(item);
            localStorage.setItem('menuCart', JSON.stringify(this.cart));
        },

        generateId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        getCartTotal() {
            return this.cart.reduce((total, item) => total + (item.price || 0), 0);
        }
    };

    // ========== DARK MODE ==========
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) enableDarkMode();
        else disableDarkMode();
    }

    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateToggleButtons('☀️', 'Switch to Light Mode');
        body.style.transition = 'all 0.3s ease';
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateToggleButtons('🌙', 'Switch to Dark Mode');
        body.style.transition = 'all 0.3s ease';
    }

    function updateToggleButtons(icon, text) {
        if (darkModeToggle) { darkModeToggle.textContent = icon; darkModeToggle.title = text; }
        if (themeToggle) themeToggle.textContent = text;
    }

    function setupThemeToggles() {
        if (darkModeToggle) darkModeToggle.addEventListener('click', toggleTheme);
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    }

    function toggleTheme(e) {
        e.preventDefault();
        body.classList.contains('dark-mode') ? disableDarkMode() : enableDarkMode();
        playSound('toggle');
    }

    // ========== CART SYSTEM ==========
    function renderCart() {
        cartList.innerHTML = '';
        menuManager.cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = "list-group-item d-flex justify-content-between";
            li.innerHTML = `
                <span>${item.title} - $${item.price}</span>
                <button class="btn btn-sm btn-outline-danger" data-index="${index}">−</button>
            `;
            cartList.appendChild(li);
        });
        cartCount.textContent = menuManager.cart.length;
        cartTotal.textContent = menuManager.getCartTotal();
    }

    function setupCartSystem() {
        cartToggle.addEventListener('click', () => cartPanel.classList.toggle('open'));

        // Add to cart
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.card');
                const title = card.querySelector('.card-title').innerText;
                const price = parseFloat(card.querySelector('.fw-bold').innerText.replace('$',''));
                menuManager.addToCart({ title, price });
                renderCart();
                showNotification(`${title} added to cart!`, 'info');
                playSound('click');
            });
        });

        // Remove from cart
        cartList.addEventListener('click', e => {
            if (e.target.dataset.index !== undefined) {
                menuManager.cart.splice(e.target.dataset.index, 1);
                localStorage.setItem('menuCart', JSON.stringify(menuManager.cart));
                renderCart();
            }
        });

        // Clear cart
        clearCart.addEventListener('click', () => {
            menuManager.cart = [];
            localStorage.setItem('menuCart', '[]');
            renderCart();
        });

        // Submit order
        submitOrder.addEventListener('click', () => {
            if (menuManager.cart.length === 0) {
                showNotification('Cart is empty.', 'warning');
                return;
            }
            cartPanel.classList.remove('open');
            const wait = Math.floor(Math.random() * 6) + 10;
            showNotification(`Order sent! Estimated wait time: ${wait}s`, 'success');
            setTimeout(() => showNotification('Your order is ready!', 'success'), wait*1000);
            menuManager.cart = [];
            localStorage.setItem('menuCart', '[]');
            renderCart();
        });
        const closeCartBtn = document.getElementById('closeCartBtn');
        if (closeCartBtn) {
            closeCartBtn.addEventListener('click', () => {
                cartPanel.classList.remove('open');
            });
        }


        renderCart();
    }

    // ========== MENU INTERACTIVITY ==========
    function setupMenuInteractivity() {
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px)';
                card.style.boxShadow = '0 12px 30px var(--shadow-color)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
            });
        });
    }

    // ========== SUBSCRIPTION FORM ==========
    function setupSubscribeForm() {
        if (!subscribeForm) return;
        const emailInput = document.getElementById('subscribeEmail');

        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                menuManager.addSubscription(email);
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
                const modal = bootstrap.Modal.getInstance(document.getElementById('subscribeModal'));
                if (modal) modal.hide();
                playSound('success');
            } else {
                emailInput.classList.add('is-invalid');
                playSound('error');
            }
        });

        emailInput.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            if (this.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value)) this.classList.add('is-valid');
            else this.classList.remove('is-valid');
        });
    }

    // ========== DATE & TIME ==========
    function updateDateTime() {
        if (!dateTimeElement) return;
        const now = new Date();
        dateTimeElement.textContent = now.toLocaleDateString('en-US', {
            weekday:'long', year:'numeric', month:'long', day:'numeric',
            hour:'2-digit', minute:'2-digit', second:'2-digit', timeZoneName:'short'
        });
    }

    // ========== NOTIFICATIONS ==========
    function showNotification(message, type) {
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `top:20px; right:20px; z-index:9999; min-width:300px; animation: slideInRight 0.5s ease;`;
        notification.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    function playSound(type) {
        try {
            const audioContext = new (window.AudioContext||window.webkitAudioContext)();
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain); gain.connect(audioContext.destination);
            switch(type){
                case 'success': osc.frequency.setValueAtTime(523, audioContext.currentTime); break;
                case 'error': osc.frequency.setValueAtTime(783, audioContext.currentTime); break;
                case 'toggle': osc.frequency.setValueAtTime(600, audioContext.currentTime); break;
                case 'click': osc.frequency.setValueAtTime(800, audioContext.currentTime); break;
            }
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime+0.3);
            osc.start(audioContext.currentTime); osc.stop(audioContext.currentTime+0.3);
        } catch(e){ console.log('Audio not supported'); }
    }

    // ========== INIT ==========
    function init() {
        initializeTheme();
        setupThemeToggles();
        setupSubscribeForm();
        setupMenuInteractivity();
        setupCartSystem();
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    init();
});

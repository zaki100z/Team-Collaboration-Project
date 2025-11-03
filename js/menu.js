// Advanced JavaScript for Menu Page with Dark Mode and Local Storage
document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM SELECTION ==========
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeToggle = document.getElementById('themeToggle');
    const subscribeForm = document.getElementById('subscribeForm');
    const dateTimeElement = document.getElementById('dateTime');
    const body = document.body;

    // ========== DARK MODE WITH LOCAL STORAGE ==========
    
    // Initialize theme from localStorage or system preference
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        console.log('Initializing theme...');
        console.log('Saved theme:', savedTheme);
        console.log('Prefers dark:', prefersDark);
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    function enableDarkMode() {
        console.log('Enabling dark mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateToggleButtons('☀️', 'Switch to Light Mode');
        
        // Add animation class for smooth transition
        body.style.transition = 'all 0.3s ease';
        
        console.log('Dark mode enabled. Body classes:', body.classList.toString());
    }

    function disableDarkMode() {
        console.log('Disabling dark mode');
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateToggleButtons('🌙', 'Switch to Dark Mode');
        
        // Add animation class for smooth transition
        body.style.transition = 'all 0.3s ease';
        
        console.log('Dark mode disabled. Body classes:', body.classList.toString());
    }

    function updateToggleButtons(icon, text) {
        if (darkModeToggle) {
            darkModeToggle.textContent = icon;
            darkModeToggle.title = text;
            console.log('Updated darkModeToggle:', icon, text);
        }
        if (themeToggle) {
            themeToggle.textContent = text;
            console.log('Updated themeToggle:', text);
        }
    }

    // Theme toggle functionality
    function setupThemeToggles() {
        // Toggle from navbar button
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navbar toggle clicked');
                
                if (body.classList.contains('dark-mode')) {
                    disableDarkMode();
                } else {
                    enableDarkMode();
                }
                playSound('toggle');
            });
        }

        // Toggle from main button
        if (themeToggle) {
            themeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Main toggle clicked');
                
                if (body.classList.contains('dark-mode')) {
                    disableDarkMode();
                } else {
                    enableDarkMode();
                }
                playSound('toggle');
            });
        }

        console.log('Theme toggles setup complete');
    }

    // ========== FORM VALIDATION AND SUBMISSION ==========
    
    function setupSubscribeForm() {
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Subscribe form submitted');
                
                const emailInput = document.getElementById('subscribeEmail');
                const email = emailInput.value.trim();
                
                if (validateEmail(email)) {
                    // Store subscription in localStorage
                    storeSubscription(email);
                    
                    // Show success message
                    showNotification('Thank you for subscribing to our newsletter!', 'success');
                    
                    // Reset form and close modal
                    this.reset();
                    const modal = bootstrap.Modal.getInstance(document.getElementById('subscribeModal'));
                    if (modal) modal.hide();
                    
                    playSound('success');
                } else {
                    emailInput.classList.add('is-invalid');
                    playSound('error');
                }
            });

            // Real-time validation
            const emailInput = document.getElementById('subscribeEmail');
            if (emailInput) {
                emailInput.addEventListener('input', function() {
                    if (this.classList.contains('is-invalid')) {
                        this.classList.remove('is-invalid');
                    }
                    
                    // Real-time email validation
                    if (this.value && isValidEmail(this.value)) {
                        this.classList.add('is-valid');
                    } else {
                        this.classList.remove('is-valid');
                    }
                });
            }
        }
    }

    // ========== TIME AND DATE DISPLAY ==========
    
    function updateDateTime() {
        if (dateTimeElement) {
            const now = new Date();
            const options = { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    // ========== MENU INTERACTIVITY ==========
    
    function setupMenuInteractivity() {
        // Add hover effects to menu cards
        const menuCards = document.querySelectorAll('.card');
        menuCards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 30px var(--shadow-color)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });

            // Add click event for menu items
            card.addEventListener('click', function() {
                const title = this.querySelector('.card-title').textContent;
                const price = this.querySelector('.text-primary').textContent;
                showNotification(`Added ${title} ${price} to cart!`, 'info');
                playSound('click');
            });
        });

        // Dietary information tooltips
        const dietaryInfo = document.querySelectorAll('.text-muted');
        dietaryInfo.forEach(info => {
            info.addEventListener('mouseenter', function() {
                this.style.cursor = 'help';
                this.title = 'Dietary Information';
            });
        });

        console.log('Menu interactivity setup complete');
    }

    // ========== ADVANCED JAVASCRIPT CONCEPTS ==========
    
    // Objects and Methods for Menu Management
    const menuManager = {
        subscriptions: JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [],
        cart: JSON.parse(localStorage.getItem('menuCart')) || [],
        userPreferences: JSON.parse(localStorage.getItem('userPreferences')) || { theme: 'light' },
        
        addSubscription: function(email) {
            const subscription = {
                email: email,
                date: new Date().toISOString(),
                id: this.generateId()
            };
            this.subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(this.subscriptions));
            console.log('Subscription added:', email);
        },
        
        addToCart: function(item) {
            this.cart.push(item);
            localStorage.setItem('menuCart', JSON.stringify(this.cart));
            console.log('Item added to cart:', item);
        },
        
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        getSubscriptionCount: function() {
            return this.subscriptions.length;
        },
        
        getCartTotal: function() {
            return this.cart.reduce((total, item) => total + (item.price || 0), 0);
        },
        
        // Higher-order function for filtering
        filterSubscriptionsByDate: function(startDate, endDate) {
            return this.subscriptions.filter(sub => {
                const subDate = new Date(sub.date);
                return subDate >= new Date(startDate) && subDate <= new Date(endDate);
            });
        }
    };

    // Arrays and Higher-Order Functions
    const menuCategories = ['Appetizers', 'Main Courses', 'Desserts'];
    
    // Using map to create category statistics
    const getCategoryStats = () => {
        return menuCategories.map(category => {
            const items = document.querySelectorAll(`.menu-category h2:contains("${category}")`);
            const itemCount = items.length > 0 ? items[0].closest('.menu-category').querySelectorAll('.card').length : 0;
            
            return {
                category: category,
                itemCount: itemCount,
                hasVegetarian: hasVegetarianOptions(category)
            };
        });
    };

    function hasVegetarianOptions(category) {
        const categoryElement = Array.from(document.querySelectorAll('.menu-category h2'))
            .find(h2 => h2.textContent.includes(category));
        
        if (categoryElement) {
            const cards = categoryElement.closest('.menu-category').querySelectorAll('.card');
            return Array.from(cards).some(card => 
                card.querySelector('.text-muted')?.textContent.includes('Vegetarian')
            );
        }
        return false;
    }

    // ========== SWITCH STATEMENTS ==========
    
    function getMenuRecommendation() {
        const hour = new Date().getHours();
        let recommendation;
        
        switch(true) {
            case hour < 11:
                recommendation = "🌅 Try our breakfast specials! Perfect start to your day.";
                break;
            case hour < 15:
                recommendation = "🌞 Perfect time for our lunch menu! Fresh and satisfying.";
                break;
            case hour < 18:
                recommendation = "☕ Afternoon tea and light bites available!";
                break;
            case hour < 22:
                recommendation = "🌙 Enjoy our dinner specialties! Romantic ambiance.";
                break;
            default:
                recommendation = "🌜 Late night desserts and drinks! Cozy atmosphere.";
        }
        
        return recommendation;
    }

    // Display recommendation
    function displayRecommendation() {
        const recommendation = getMenuRecommendation();
        const recommendationElement = document.createElement('div');
        recommendationElement.className = 'alert alert-info text-center mt-3 fade-in-up';
        recommendationElement.innerHTML = `
            <i class="fas fa-utensils me-2"></i>
            ${recommendation}
        `;
        
        const heroSection = document.querySelector('.menu-hero .container');
        if (heroSection) {
            heroSection.appendChild(recommendationElement);
        }
        
        console.log('Menu recommendation displayed:', recommendation);
    }

    // ========== EVENT HANDLING ==========
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + D to toggle dark mode
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
            console.log('Keyboard shortcut: Alt+D pressed');
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
            playSound('toggle');
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                    console.log('Modal closed with Escape key');
                }
            });
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        }
    });

    // ========== SOUND EFFECTS ==========
    
    function playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'success':
                    // Success sound (ascending tone)
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
                    break;
                case 'error':
                    // Error sound (descending tone)
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.2);
                    break;
                case 'toggle':
                    // Toggle sound
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    break;
                case 'click':
                    // Click sound
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio context not supported:', error);
        }
    }

    // ========== HELPER FUNCTIONS ==========
    
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function storeSubscription(email) {
        menuManager.addSubscription(email);
        console.log('Total subscriptions:', menuManager.getSubscriptionCount());
    }

    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `custom-notification alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = `
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.5s ease;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Add CSS for animations
    function addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .custom-notification {
                box-shadow: 0 4px 15px var(--shadow-color);
                border: none;
            }
            
            .fade-in-up {
                animation: fadeInUp 0.6s ease-out;
            }
            
            /* Smooth transitions for all theme changes */
            body * {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease,
                           box-shadow 0.3s ease !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ========== INITIALIZATION ==========
    
    function init() {
        console.log('Initializing menu page...');
        
        initializeTheme();
        setupThemeToggles();
        setupSubscribeForm();
        setupMenuInteractivity();
        displayRecommendation();
        addCustomStyles();
        
        // Start clock
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        // Log initialization details
        const stats = getCategoryStats();
        console.log('Menu categories statistics:', stats);
        console.log('Total subscriptions:', menuManager.getSubscriptionCount());
        console.log('Current theme:', localStorage.getItem('theme'));
        console.log('Body classes:', body.classList.toString());
        
        console.log('Menu page initialized successfully!');
    }

    // Start the application
    init();
});
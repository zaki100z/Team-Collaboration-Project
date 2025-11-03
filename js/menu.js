// Advanced JavaScript for Menu Page with Dark Mode and Local Storage
document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM SELECTION ==========
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeToggle = document.getElementById('themeToggle');
    const subscribeForm = document.getElementById('subscribeForm');
    const dateTimeElement = document.getElementById('dateTime');
    const body = document.body;

    // ========== DARK MODE WITH LOCAL STORAGE ==========
    
    // Check for saved theme preference or respect OS preference
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        updateToggleButtons('☀️', 'Switch to Light Mode');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateToggleButtons('🌙', 'Switch to Dark Mode');
    }

    function updateToggleButtons(icon, text) {
        if (darkModeToggle) {
            darkModeToggle.textContent = icon;
            darkModeToggle.title = text;
        }
        if (themeToggle) {
            themeToggle.textContent = text;
        }
    }

    // Theme toggle functionality
    function setupThemeToggles() {
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', function() {
                if (body.classList.contains('dark-mode')) {
                    disableDarkMode();
                } else {
                    enableDarkMode();
                }
                playSound('toggle');
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                if (body.classList.contains('dark-mode')) {
                    disableDarkMode();
                } else {
                    enableDarkMode();
                }
                playSound('toggle');
            });
        }
    }

    // ========== FORM VALIDATION AND SUBMISSION ==========
    
    function setupSubscribeForm() {
        if (subscribeForm) {
            subscribeForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
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
                second: '2-digit'
            };
            dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    // ========== MENU INTERACTIVITY ==========
    
    function setupMenuInteractivity() {
        // Add hover effects to menu cards
        const menuCards = document.querySelectorAll('.card');
        menuCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
                this.style.boxShadow = '0 12px 30px var(--shadow-color)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 4px 15px var(--shadow-color)';
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
    }

    // ========== ADVANCED JAVASCRIPT CONCEPTS ==========
    
    // Objects and Methods for Menu Management
    const menuManager = {
        subscriptions: JSON.parse(localStorage.getItem('newsletterSubscriptions')) || [],
        userPreferences: JSON.parse(localStorage.getItem('userPreferences')) || { theme: 'light' },
        
        addSubscription: function(email) {
            const subscription = {
                email: email,
                date: new Date().toISOString(),
                id: this.generateId()
            };
            this.subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(this.subscriptions));
        },
        
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        getSubscriptionCount: function() {
            return this.subscriptions.length;
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
    const menuCategories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
    
    // Using map to create category statistics
    const categoryStats = menuCategories.map(category => {
        const items = document.querySelectorAll(`.menu-category:contains("${category}") .card`);
        return {
            category: category,
            itemCount: items.length,
            averagePrice: calculateAveragePrice(items)
        };
    });

    function calculateAveragePrice(items) {
        if (items.length === 0) return 0;
        
        const prices = Array.from(items).map(item => {
            const priceElement = item.querySelector('.text-primary');
            if (priceElement) {
                const priceText = priceElement.textContent.replace('$', '');
                return parseFloat(priceText) || 0;
            }
            return 0;
        });
        
        const total = prices.reduce((sum, price) => sum + price, 0);
        return (total / prices.length).toFixed(2);
    }

    // ========== SWITCH STATEMENTS ==========
    
    function getMenuRecommendation() {
        const hour = new Date().getHours();
        let recommendation;
        
        switch(true) {
            case hour < 11:
                recommendation = "Try our breakfast specials!";
                break;
            case hour < 15:
                recommendation = "Perfect time for our lunch menu!";
                break;
            case hour < 18:
                recommendation = "Afternoon tea and light bites available!";
                break;
            case hour < 22:
                recommendation = "Enjoy our dinner specialties!";
                break;
            default:
                recommendation = "Late night desserts and drinks!";
        }
        
        return recommendation;
    }

    // Display recommendation
    function displayRecommendation() {
        const recommendation = getMenuRecommendation();
        const recommendationElement = document.createElement('div');
        recommendationElement.className = 'alert alert-info text-center mt-3';
        recommendationElement.innerHTML = `
            <i class="fas fa-utensils me-2"></i>
            ${recommendation}
        `;
        
        const heroSection = document.querySelector('.menu-hero .container');
        if (heroSection) {
            heroSection.appendChild(recommendationElement);
        }
    }

    // ========== EVENT HANDLING ==========
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + D to toggle dark mode
        if (e.altKey && e.key === 'd') {
            e.preventDefault();
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
                if (modalInstance) modalInstance.hide();
            });
        }
    });

    // ========== SOUND EFFECTS ==========
    
    function playSound(type) {
        // Simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'success':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
                    break;
                case 'error':
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.2);
                    break;
                case 'toggle':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio context not supported');
        }
    }

    // ========== HELPER FUNCTIONS ==========
    
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function storeSubscription(email) {
        menuManager.addSubscription(email);
        console.log('Subscription stored for:', email);
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
            }
            
            .card {
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    
    // ========== INITIALIZATION ==========
    
    function init() {
        initializeTheme();
        setupThemeToggles();
        setupSubscribeForm();
        setupMenuInteractivity();
        displayRecommendation();
        addCustomStyles();
        
        // Start clock
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        console.log('Menu page initialized successfully');
        console.log('Menu categories statistics:', categoryStats);
        console.log('Total subscriptions:', menuManager.getSubscriptionCount());
    }

    // Start the application
    init();
});
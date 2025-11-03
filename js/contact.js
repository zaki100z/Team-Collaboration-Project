// Advanced JavaScript for Contact Page with Dark Mode and Local Storage
document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM SELECTION ==========
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeToggle = document.getElementById('themeToggle');
    const mainContactForm = document.getElementById('mainContactForm');
    const modalContactForm = document.getElementById('modalContactForm');
    const submitModalForm = document.getElementById('submitModalForm');
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
        updateMapTheme('dark');
    }

    function disableDarkMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        updateToggleButtons('🌙', 'Switch to Dark Mode');
        updateMapTheme('light');
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

    function updateMapTheme(theme) {
        // This would typically update an actual map theme
        console.log(`Map theme updated to: ${theme}`);
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
    
    function setupContactForms() {
        // Main contact form
        if (mainContactForm) {
            mainContactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (validateForm(this)) {
                    const formData = collectFormData(this);
                    storeContactInquiry(formData, 'main');
                    showNotification('Thank you for your message! We will get back to you within 24 hours.', 'success');
                    this.reset();
                    playSound('success');
                } else {
                    playSound('error');
                }
            });
        }

        // Modal contact form
        if (submitModalForm) {
            submitModalForm.addEventListener('click', function() {
                if (validateModalForm()) {
                    const formData = collectModalFormData();
                    storeContactInquiry(formData, 'modal');
                    showNotification('Message sent successfully! We will contact you soon.', 'success');
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                    if (modal) modal.hide();
                    
                    // Reset form
                    modalContactForm.reset();
                    playSound('success');
                } else {
                    playSound('error');
                }
            });
        }

        // Real-time validation
        setupRealTimeValidation();
    }

    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                
                // Specific validations
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    function validateModalForm() {
        let isValid = true;
        const name = document.getElementById('modalName');
        const email = document.getElementById('modalEmail');
        const message = document.getElementById('modalMessage');
        
        [name, email, message].forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('is-invalid');
                isValid = false;
            } else {
                field.classList.remove('is-invalid');
                
                if (field.type === 'email' && !isValidEmail(field.value)) {
                    field.classList.add('is-invalid');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    function setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
                
                // Real-time email validation
                if (this.type === 'email' && this.value) {
                    if (isValidEmail(this.value)) {
                        this.classList.add('is-valid');
                    } else {
                        this.classList.remove('is-valid');
                    }
                }
            });
        });
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

    // ========== CONTACT MANAGEMENT SYSTEM ==========
    
    const contactManager = {
        inquiries: JSON.parse(localStorage.getItem('contactInquiries')) || [],
        userPreferences: JSON.parse(localStorage.getItem('userPreferences')) || { theme: 'light' },
        
        addInquiry: function(inquiry) {
            inquiry.id = this.generateId();
            inquiry.timestamp = new Date().toISOString();
            inquiry.status = 'new';
            this.inquiries.push(inquiry);
            localStorage.setItem('contactInquiries', JSON.stringify(this.inquiries));
        },
        
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        getInquiriesByType: function(type) {
            return this.inquiries.filter(inquiry => inquiry.type === type);
        },
        
        getInquiryCount: function() {
            return this.inquiries.length;
        },
        
        // Higher-order function for filtering inquiries
        filterInquiries: function(criteria) {
            return this.inquiries.filter(inquiry => {
                return Object.keys(criteria).every(key => {
                    return inquiry[key] === criteria[key];
                });
            });
        },
        
        // Method using array methods
        getInquiryStats: function() {
            const stats = {
                total: this.inquiries.length,
                byType: {},
                byStatus: {},
                recent: this.inquiries.filter(inq => {
                    const inquiryDate = new Date(inq.timestamp);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return inquiryDate > weekAgo;
                }).length
            };
            
            // Count by type
            this.inquiries.forEach(inq => {
                stats.byType[inq.type] = (stats.byType[inq.type] || 0) + 1;
                stats.byStatus[inq.status] = (stats.byStatus[inq.status] || 0) + 1;
            });
            
            return stats;
        }
    };

    // ========== INTERACTIVE FEATURES ==========
    
    function setupInteractiveFeatures() {
        // Info card animations
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Accordion enhancements
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            item.addEventListener('show.bs.collapse', function() {
                this.classList.add('active');
                playSound('toggle');
            });
            
            item.addEventListener('hide.bs.collapse', function() {
                this.classList.remove('active');
            });
        });

        // Social media links animation
        const socialLinks = document.querySelectorAll('.social-links a');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    // ========== SWITCH STATEMENTS ==========
    
    function getContactResponseTime(subject) {
        let responseTime;
        
        switch(subject) {
            case 'reservation':
                responseTime = 'within 2 hours';
                break;
            case 'event':
                responseTime = 'within 4 hours';
                break;
            case 'feedback':
                responseTime = 'within 24 hours';
                break;
            case 'complaint':
                responseTime = 'within 6 hours';
                break;
            default:
                responseTime = 'within 24 hours';
        }
        
        return responseTime;
    }

    function displayResponseTime() {
        const subjectSelect = document.getElementById('subject');
        const responseTimeElement = document.createElement('small');
        responseTimeElement.className = 'form-text text-muted mt-1';
        responseTimeElement.id = 'responseTime';
        
        if (subjectSelect) {
            subjectSelect.addEventListener('change', function() {
                const responseTime = getContactResponseTime(this.value);
                responseTimeElement.textContent = `Expected response: ${responseTime}`;
                
                if (!responseTimeElement.parentNode) {
                    this.parentNode.appendChild(responseTimeElement);
                }
            });
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
        
        // Ctrl + Enter to submit main form
        if (e.ctrlKey && e.key === 'Enter' && mainContactForm) {
            e.preventDefault();
            mainContactForm.dispatchEvent(new Event('submit'));
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
    
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        data.type = 'main';
        return data;
    }

    function collectModalFormData() {
        return {
            name: document.getElementById('modalName').value,
            email: document.getElementById('modalEmail').value,
            message: document.getElementById('modalMessage').value,
            type: 'modal'
        };
    }

    function storeContactInquiry(data, source) {
        contactManager.addInquiry(data);
        console.log(`Contact inquiry stored from ${source}:`, data);
        
        // Log statistics
        const stats = contactManager.getInquiryStats();
        console.log('Contact inquiry statistics:', stats);
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

    // Directions function
    window.openDirections = function() {
        const address = "123 Culinary Street, Foodville, FH 54321";
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
        window.open(mapsUrl, '_blank');
    };

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
            
            .accordion-item.active {
                border-color: var(--primary-color);
            }
            
            .info-card {
                transition: all 0.3s ease;
            }
            
            .social-links a {
                display: inline-block;
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ========== INITIALIZATION ==========

    function init() {
        initializeTheme();
        setupThemeToggles();
        setupContactForms();
        setupInteractiveFeatures();
        displayResponseTime();
        addCustomStyles();
        
        // Start clock
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        console.log('Contact page initialized successfully');
        console.log('Total contact inquiries:', contactManager.getInquiryCount());
    }

    // Start the application
    init();
});
// Gallery JavaScript for Advanced DOM Manipulation and Event Handling

document.addEventListener('DOMContentLoaded', function() {
    // ====================
    // 1. DOM MANIPULATION & STYLING
    // ====================

    // Image Gallery Filtering with Arrays and Loops
    const filterButtons = document.querySelectorAll('.btn-group button[data-filter]');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Filter gallery items
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons and add to current
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter items using array methods
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    // Add animation
                    item.style.animation = 'fadeIn 0.5s ease-in';
                } else {
                    item.style.display = 'none';
                }
            });

            // Play filter sound
            playSound('filter');
        });
    });

    // Dynamic Image Modal Viewer
    const galleryImages = document.querySelectorAll('.gallery-grid .card-img-top');
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            createImageModal(this.src, this.alt);
            playSound('click');
        });
    });

    function createImageModal(src, alt) {
        // Remove existing modal if any
        const existingModal = document.querySelector('.image-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease-in;
        `;

        const modalImg = document.createElement('img');
        modalImg.src = src;
        modalImg.alt = alt;
        modalImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 10px;
            transform: scale(0.8);
            animation: zoomIn 0.3s ease-out forwards;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 30px;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 10000;
        `;

        modal.appendChild(modalImg);
        modal.appendChild(closeBtn);
        document.body.appendChild(modal);

        // Close modal events
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => modal.remove(), 300);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    // ====================
    // 2. EVENT HANDLING
    // ====================

    // Card hover effects with animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.transition = 'all 0.3s ease';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });

    // Button click effects with sound
    const allButtons = document.querySelectorAll('button, .btn');
    allButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Play click sound for interactive buttons
            if (this.textContent.includes('Book') || 
                this.textContent.includes('Details') || 
                this.classList.contains('btn-danger')) {
                playSound('click');
            }
        });
    });

    // ====================
    // 3. ADVANCED JS CONCEPTS
    // ====================

    // Objects and Methods for Gallery Data
    const galleryData = {
        items: [
            { category: 'food', title: 'Signature Grilled Salmon', description: 'Perfectly grilled salmon with seasonal vegetables' },
            { category: 'restaurant', title: 'Main Dining Room', description: 'Elegant dining atmosphere' },
            { category: 'events', title: 'Wine Tasting', description: 'Monthly wine tasting events' }
        ],
        
        // Method to get items by category using filter (Higher-Order Function)
        getItemsByCategory: function(category) {
            return this.items.filter(item => 
                category === 'all' || item.category === category
            );
        },
        
        // Method to display filtered items using map (Higher-Order Function)
        displayFilteredItems: function(category) {
            const filtered = this.getItemsByCategory(category);
            console.log('Filtered items:', filtered);
            return filtered.map(item => item.title);
        }
    };

    // Array methods demonstration
    const allCategories = [...new Set(galleryData.items.map(item => item.category))];
    console.log('Available categories:', allCategories);

    // ====================
    // 4. SOUND EFFECTS
    // ====================

    function playSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        if (type === 'click') {
            // Create click sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
        else if (type === 'filter') {
            // Create filter sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 600;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    }

    // ====================
    // 5. DARK MODE TOGGLE
    // ====================

    const darkModeToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            this.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            this.textContent = '🌙';
        }
        
        playSound('click');
    });

    // ====================
    // 6. ANIMATIONS
    // ====================

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes zoomIn {
            from { transform: scale(0.8); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        
        .dark-mode {
            background-color: #1a1a1a;
            color: #ffffff;
        }
        
        .dark-mode .card {
            background-color: #2d2d2d;
            color: #ffffff;
            border-color: #444;
        }
        
        .dark-mode .bg-light {
            background-color: #2d2d2d !important;
        }
        
        .gallery-item {
            animation: fadeIn 0.5s ease-in;
        }
    `;
    document.head.appendChild(style);

    // Initialize gallery with animation
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    console.log('Gallery JavaScript loaded successfully!');
});
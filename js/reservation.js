// Advanced JavaScript for Reservation Page
document.addEventListener('DOMContentLoaded', function() {
    // ========== DOM SELECTION ==========
    const reservationForm = document.getElementById('reservationForm');
    const privateEventsForm = document.getElementById('privateEventsForm');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const currentTimeElement = document.getElementById('currentTime');
    const currentDateElement = document.getElementById('currentDate');
    const successAlert = document.getElementById('successAlert');
    const submitEventForm = document.getElementById('submitEventForm');
    
    // Hide success alert initially
    successAlert.style.display = 'none';
    
    // ========== DYNAMIC STYLE CHANGES ==========
    
    // Day/Night Theme Toggle
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Play sound effect
        playSound('toggle');
    });
    
    // ========== EVENT HANDLING ==========
    
    // Real-time Clock Update
    function updateClock() {
        const now = new Date();
        currentTimeElement.textContent = now.toLocaleTimeString();
        currentDateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    setInterval(updateClock, 1000);
    updateClock();
    
    // ========== FORM VALIDATION AND SUBMISSION ==========
    
    // Reservation Form Handling
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            // Create reservation object
            const reservationData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                guests: document.getElementById('guests').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                specialRequests: document.getElementById('special-requests').value,
                timestamp: new Date().toISOString()
            };
            
            // Store reservation in localStorage (simulating database)
            storeReservation(reservationData);
            
            // Show success message with animation
            showSuccessAlert();
            
            // Play success sound
            playSound('success');
            
            // Reset form
            this.reset();
        } else {
            playSound('error');
        }
    });
    
    // Private Events Form Submission
    submitEventForm.addEventListener('click', function() {
        if (validatePrivateEventsForm()) {
            const eventData = {
                name: document.getElementById('eventName').value,
                email: document.getElementById('eventEmail').value,
                phone: document.getElementById('eventPhone').value,
                eventType: document.getElementById('eventType').value,
                eventDate: document.getElementById('eventDate').value,
                guests: document.getElementById('eventGuests').value,
                details: document.getElementById('eventDetails').value,
                updates: document.getElementById('eventUpdates').checked
            };
            
            // Store event inquiry
            storeEventInquiry(eventData);
            
            // Show success message
            showNotification('Event inquiry submitted successfully! We will contact you within 24 hours.', 'success');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('privateEventsModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('privateEventsForm').reset();
            
            playSound('success');
        } else {
            playSound('error');
        }
    });
    
    // ========== FORM VALIDATION FUNCTIONS ==========
    
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
                
                // Specific validations
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    isValid = false;
                    input.classList.add('is-invalid');
                }
                
                if (input.type === 'date' && !isValidDate(input.value)) {
                    isValid = false;
                    input.classList.add('is-invalid');
                }
            }
        });
        
        return isValid;
    }
    
    function validatePrivateEventsForm() {
        let isValid = true;
        const form = document.getElementById('privateEventsForm');
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });
        
        return isValid;
    }
    
    // ========== ADVANCED JAVASCRIPT CONCEPTS ==========
    
    // Objects and Methods for Reservation Management
    const reservationManager = {
        reservations: JSON.parse(localStorage.getItem('reservations')) || [],
        events: JSON.parse(localStorage.getItem('eventInquiries')) || [],
        
        addReservation: function(reservation) {
            this.reservations.push(reservation);
            localStorage.setItem('reservations', JSON.stringify(this.reservations));
        },
        
        addEventInquiry: function(event) {
            this.events.push(event);
            localStorage.setItem('eventInquiries', JSON.stringify(this.events));
        },
        
        getReservationsByDate: function(date) {
            return this.reservations.filter(res => res.date === date);
        },
        
        getTotalReservations: function() {
            return this.reservations.length;
        }
    };
    
    // Arrays and Higher-Order Functions
    const availableTimeSlots = [
        '11:00', '12:00', '13:00', '14:00', '17:00', '18:00', 
        '19:00', '20:00', '21:00'
    ];
    
    // Filter available times based on date (simplified)
    function getAvailableTimes(date) {
        const day = new Date(date).getDay();
        
        // Different time slots for weekends
        if (day === 0 || day === 6) { // Sunday or Saturday
            return availableTimeSlots.filter(time => 
                !['11:00', '12:00'].includes(time) // Remove early times on weekends
            );
        }
        
        return availableTimeSlots;
    }
    
    // Update time slots based on selected date
    document.getElementById('date').addEventListener('change', function() {
        const times = getAvailableTimes(this.value);
        const timeSelect = document.getElementById('time');
        
        // Clear existing options
        timeSelect.innerHTML = '<option value="">Select time</option>';
        
        // Add new options using forEach (higher-order function)
        times.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = formatTimeDisplay(time);
            timeSelect.appendChild(option);
        });
    });
    
    // ========== SWITCH STATEMENTS ==========
    
    // Function to get greeting based on time of day
    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        let greeting;
        
        switch(true) {
            case hour < 12:
                greeting = "Good morning! Ready for breakfast?";
                break;
            case hour < 17:
                greeting = "Good afternoon! Perfect time for lunch.";
                break;
            case hour < 21:
                greeting = "Good evening! Dinner reservations available.";
                break;
            default:
                greeting = "Late night cravings? We're here for you!";
        }
        
        return greeting;
    }
    
    // Display greeting
    const greetingElement = document.createElement('div');
    greetingElement.className = 'alert alert-info text-center';
    greetingElement.textContent = getTimeBasedGreeting();
    document.querySelector('.reservations-hero .container').appendChild(greetingElement);
    
    // ========== KEYBOARD EVENT HANDLING ==========
    
    // Keyboard navigation for form
    document.addEventListener('keydown', function(e) {
        // Ctrl + R to reset form
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            reservationForm.reset();
            showNotification('Form reset!', 'info');
            playSound('toggle');
        }
        
        // Enter key to submit forms
        if (e.key === 'Enter' && e.target.form) {
            const form = e.target.form;
            if (form.id === 'reservationForm' || form.id === 'privateEventsForm') {
                e.preventDefault();
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
    
    // ========== ANIMATIONS ==========
    
    // Add animations to form elements
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // ========== SOUND EFFECTS ==========
    
    function playSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let oscillator = audioContext.createOscillator();
        let gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'success':
                // Success sound (ascending tone)
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
                break;
            case 'error':
                // Error sound (descending tone)
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.2); // C5
                break;
            case 'toggle':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
    
    // ========== HELPER FUNCTIONS ==========
    
    function storeReservation(data) {
        reservationManager.addReservation(data);
        console.log('Reservation stored:', data);
    }
    
    function storeEventInquiry(data) {
        reservationManager.addEventInquiry(data);
        console.log('Event inquiry stored:', data);
    }
    
    function showSuccessAlert() {
        successAlert.style.display = 'block';
        successAlert.style.animation = 'slideInDown 0.5s ease';
        
        setTimeout(() => {
            successAlert.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                successAlert.style.display = 'none';
            }, 500);
        }, 5000);
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function isValidDate(date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }
    
    function formatTimeDisplay(time) {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }
    
    // Initialize form date restrictions
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
});
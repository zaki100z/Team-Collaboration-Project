    
// Dark Mode Functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference
const isDarkMode = localStorage.getItem('darkMode') === 'true';

// Apply dark mode if previously set
if (isDarkMode) {
    body.classList.add('dark-mode');
    darkModeToggle.textContent = '☀️';
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update button icon and save preference
    if (body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = '☀️';
        localStorage.setItem('darkMode', 'true');
    } else {
        darkModeToggle.textContent = '🌙';
        localStorage.setItem('darkMode', 'false');
    }
});

// Set min date to today for both forms
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').setAttribute('min', today);
document.getElementById('eventDate').setAttribute('min', today);

// Function to update the current date and time
function updateDateTime() {
    const now = new Date();
    
    // Format time (HH:MM:SS AM/PM)
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    
    // Format date (Day, Month Date, Year)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Update the DOM elements
    document.getElementById('currentTime').textContent = timeString;
    document.getElementById('currentDate').textContent = dateString;
}

// Update time immediately and then every second
updateDateTime();
setInterval(updateDateTime, 1000);

// Form validation for main reservation form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const successAlert = document.getElementById('successAlert');
    
    // Add validation styles on input
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            successAlert.classList.remove('success-alert');
            successAlert.classList.add('show');
            
            // Reset form
            form.reset();
            
            // Remove validation classes
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Scroll to success message
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successAlert.classList.remove('show');
                successAlert.classList.add('success-alert');
            }, 5000);
        } else {
            // Scroll to first error
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Field validation function
    function validateField(field) {
        let isValid = true;
        let errorMessage = '';
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else {
            // Field-specific validation
            switch(field.id) {
                case 'name':
                    if (field.value.trim().length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long.';
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                    
                case 'phone':
                    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                    if (!phoneRegex.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;
                    
                case 'date':
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'Please select a date today or in the future.';
                    }
                    break;
                    
                case 'guests':
                case 'time':
                    if (field.value === '') {
                        isValid = false;
                        errorMessage = 'Please select an option.';
                    }
                    break;
            }
        }
        
        // Update UI based on validation result
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            
            // Update error message if custom one exists
            const feedbackElement = field.nextElementSibling;
            if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.textContent = errorMessage;
            }
        }
        
        return isValid;
    }
    
    // Private Events Form Handling
    const eventsForm = document.getElementById('privateEventsForm');
    const submitEventBtn = document.getElementById('submitEventForm');
    const privateEventsModal = document.getElementById('privateEventsModal');
    
    // Add validation to private events form
    const eventInputs = eventsForm.querySelectorAll('input, select');
    eventInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEventField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateEventField(this);
            }
        });
    });
    
    // Submit event form
    submitEventBtn.addEventListener('click', function() {
        let isValid = true;
        
        // Validate all fields
        eventInputs.forEach(input => {
            if (!validateEventField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Show success message
            alert('Thank you for your private event inquiry! Our events team will contact you within 24 hours.');
            
            // Reset form
            eventsForm.reset();
            
            // Remove validation classes
            eventInputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(privateEventsModal);
            modal.hide();
        } else {
            // Scroll to first error in modal
            const firstInvalid = eventsForm.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Field validation for private events form
    function validateEventField(field) {
        let isValid = true;
        let errorMessage = '';
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else {
            // Field-specific validation
            switch(field.id) {
                case 'eventName':
                    if (field.value.trim().length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long.';
                    }
                    break;
                    
                case 'eventEmail':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address.';
                    }
                    break;
                    
                case 'eventPhone':
                    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                    if (!phoneRegex.test(field.value.trim())) {
                        isValid = false;
                        errorMessage = 'Please enter a valid phone number.';
                    }
                    break;
                    
                case 'eventDate':
                    const selectedDate = new Date(field.value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'Please select a date today or in the future.';
                    }
                    break;
                    
                case 'eventType':
                case 'eventGuests':
                    if (field.value === '') {
                        isValid = false;
                        errorMessage = 'Please select an option.';
                    }
                    break;
            }
        }
        
        // Update UI based on validation result
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
            
            // Update error message if custom one exists
            const feedbackElement = field.nextElementSibling;
            if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.textContent = errorMessage;
            }
        }
        
        return isValid;
    }
});

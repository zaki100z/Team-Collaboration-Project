
     document.addEventListener('DOMContentLoaded', function() {
            const filterBtns = document.querySelectorAll('.btn-group .btn');
            const galleryItems = document.querySelectorAll('.gallery-item');
            
        
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    
                    filterBtns.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
        
                    galleryItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        });

// Form Validation Script for Gourmet Haven Contact Form
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s'-]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]{10,}$/
    };

    // Create error message element
    function createErrorElement(message) {
        const error = document.createElement('div');
        error.className = 'invalid-feedback d-block';
        error.style.fontSize = '0.875rem';
        error.style.color = '#dc3545';
        error.style.marginTop = '0.25rem';
        error.textContent = message;
        return error;
    }

    // Remove existing error message
    function removeError(input) {
        const parent = input.parentElement;
        const existingError = parent.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    // Show error message
    function showError(input, message) {
        const parent = input.parentElement;
        const existingError = parent.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        parent.appendChild(createErrorElement(message));
    }

    // Validate first name
    function validateFirstName() {
        const value = firstName.value.trim();
        if (value === '') {
            showError(firstName, 'First name is required');
            return false;
        } else if (!patterns.name.test(value)) {
            showError(firstName, 'Please enter a valid first name (2-50 characters, letters only)');
            return false;
        } else {
            removeError(firstName);
            return true;
        }
    }

    // Validate last name
    function validateLastName() {
        const value = lastName.value.trim();
        if (value === '') {
            showError(lastName, 'Last name is required');
            return false;
        } else if (!patterns.name.test(value)) {
            showError(lastName, 'Please enter a valid last name (2-50 characters, letters only)');
            return false;
        } else {
            removeError(lastName);
            return true;
        }
    }

    // Validate email
    function validateEmail() {
        const value = email.value.trim();
        if (value === '') {
            showError(email, 'Email is required');
            return false;
        } else if (!patterns.email.test(value)) {
            showError(email, 'Please enter a valid email address');
            return false;
        } else {
            removeError(email);
            return true;
        }
    }

    // Validate phone (optional but must be valid if provided)
    function validatePhone() {
        const value = phone.value.trim();
        if (value !== '' && !patterns.phone.test(value)) {
            showError(phone, 'Please enter a valid phone number (at least 10 digits)');
            return false;
        } else {
            removeError(phone);
            return true;
        }
    }

    // Validate subject
    function validateSubject() {
        if (subject.value === '' || subject.value === 'Choose...') {
            showError(subject, 'Please select a subject');
            return false;
        } else {
            removeError(subject);
            return true;
        }
    }

    // Validate message
    function validateMessage() {
        const value = message.value.trim();
        if (value === '') {
            showError(message, 'Message is required');
            return false;
        } else if (value.length < 10) {
            showError(message, 'Message must be at least 10 characters long');
            return false;
        } else if (value.length > 1000) {
            showError(message, 'Message must not exceed 1000 characters');
            return false;
        } else {
            removeError(message);
            return true;
        }
    }

    // Real-time validation listeners
    firstName.addEventListener('blur', validateFirstName);
    firstName.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateFirstName();
        }
    });

    lastName.addEventListener('blur', validateLastName);
    lastName.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateLastName();
        }
    });

    email.addEventListener('blur', validateEmail);
    email.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateEmail();
        }
    });

    phone.addEventListener('blur', validatePhone);
    phone.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validatePhone();
        }
    });

    subject.addEventListener('change', validateSubject);

    message.addEventListener('blur', validateMessage);
    message.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
            validateMessage();
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate all fields
        const isFirstNameValid = validateFirstName();
        const isLastNameValid = validateLastName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        // Check if all validations pass
        if (isFirstNameValid && isLastNameValid && isEmailValid && 
            isPhoneValid && isSubjectValid && isMessageValid) {
            
            // Create success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show';
            successAlert.role = 'alert';
            successAlert.innerHTML = `
                <strong>Success!</strong> Your message has been sent successfully. We'll get back to you soon.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            
            // Insert success message before the form
            form.parentElement.insertBefore(successAlert, form);
            
            // Reset form
            form.reset();
            
            // Remove all validation classes
            const inputs = form.querySelectorAll('.is-valid, .is-invalid');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            // Scroll to success message
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-remove success message after 5 seconds
            setTimeout(() => {
                successAlert.remove();
            }, 5000);
        } else {
            // Scroll to first invalid field
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
        }
    });
});
 // Dark mode functionality
        document.addEventListener('DOMContentLoaded', function() {
            const darkModeToggle = document.getElementById('darkModeToggle');
            const body = document.body;
            
            // Check for saved theme preference or default to light
            const currentTheme = localStorage.getItem('theme') || 'light';
            
            // Apply the saved theme
            if (currentTheme === 'dark') {
                body.classList.add('dark-mode');
                darkModeToggle.textContent = '☀️';
            } else {
                body.classList.remove('dark-mode');
                darkModeToggle.textContent = '🌙';
            }
            
            // Toggle dark mode
            darkModeToggle.addEventListener('click', function() {
                if (body.classList.contains('dark-mode')) {
                    body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                    darkModeToggle.textContent = '🌙';
                } else {
                    body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                    darkModeToggle.textContent = '☀️';
                }
            });
        });



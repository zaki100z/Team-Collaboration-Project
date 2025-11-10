$(document).ready(function() {
    console.log("Auth JavaScript loaded!");

    // ====================
    // AUTHENTICATION SYSTEM
    // ====================

    const AuthSystem = {
        currentUser: null,
        users: [],

        init: function() {
            this.loadUsers();
            this.checkAuthentication();
            this.setupEventListeners();
            this.setupDarkMode();
        },

        loadUsers: function() {
            const storedUsers = localStorage.getItem('gourmetHaven_users');
            this.users = storedUsers ? JSON.parse(storedUsers) : [];
            
            // Load current user from session
            const storedUser = sessionStorage.getItem('gourmetHaven_currentUser');
            this.currentUser = storedUser ? JSON.parse(storedUser) : null;
        },

        checkAuthentication: function() {
            const currentPath = window.location.pathname;
            const isAuthPage = currentPath.includes('login.html') || currentPath.includes('signup.html');
            const isProtectedPage = !isAuthPage && !currentPath.includes('index.html');

            if (!this.currentUser && isProtectedPage) {
                // Redirect to login if not authenticated and trying to access protected pages
                this.redirectToLogin();
                return;
            }

            if (this.currentUser && isAuthPage) {
                // Redirect to home if already authenticated and trying to access auth pages
                window.location.href = 'index.html';
                return;
            }

            this.updateNavigation();
        },

        redirectToLogin: function() {
            const currentPath = window.location.pathname;
            sessionStorage.setItem('gourmetHaven_returnUrl', currentPath);
            window.location.href = 'login.html';
        },

        updateNavigation: function() {
            const authNav = $('.auth-nav');
            
            if (this.currentUser) {
                authNav.html(`
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle text-warning" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user me-1"></i>${this.currentUser.firstName}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="profile.html"><i class="fas fa-user-circle me-2"></i>My Profile</a></li>
                            <li><a class="dropdown-item" href="reservation.html"><i class="fas fa-calendar me-2"></i>My Reservations</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                        </ul>
                    </li>
                `);
            } else {
                authNav.html(`
                    <li class="nav-item">
                        <a class="btn btn-outline-warning ms-lg-2 mt-2 mt-lg-0" href="login.html">
                            <i class="fas fa-sign-in-alt me-1"></i>Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-warning ms-lg-2 mt-2 mt-lg-0" href="signup.html">
                            <i class="fas fa-user-plus me-1"></i>Sign Up
                        </a>
                    </li>
                `);
            }
        },

        setupEventListeners: function() {
            // Signup form
            $(document).on('submit', '#signupForm', (e) => this.handleSignup(e));
            
            // Login form
            $(document).on('submit', '#loginForm', (e) => this.handleLogin(e));
            
            // Logout button
            $(document).on('click', '#logoutBtn', (e) => this.handleLogout(e));
            
            // Password validation
            $(document).on('keyup', '#signupPassword, #confirmPassword', () => this.validatePasswords());
            $(document).on('keyup', '#signupPassword', () => this.updatePasswordStrength());
            
            // Password toggle
            $(document).on('click', '.password-toggle', function() {
                const input = $(this).closest('.input-group').find('input');
                const type = input.attr('type') === 'password' ? 'text' : 'password';
                const icon = $(this).find('i');
                
                input.attr('type', type);
                icon.toggleClass('fa-eye fa-eye-slash');
            });
        },

        handleSignup: function(e) {
            e.preventDefault();
            const $form = $(e.target);
            const $submitBtn = $form.find('.auth-submit-btn');
            
            if (!this.validateSignupForm()) {
                this.showNotification('Please fix the form errors before submitting.', 'error');
                return;
            }

            this.setLoadingState($submitBtn, true);

            const userData = {
                id: this.generateId(),
                firstName: $('#firstName').val().trim(),
                lastName: $('#lastName').val().trim(),
                email: $('#signupEmail').val().trim().toLowerCase(),
                password: $('#signupPassword').val(),
                phone: $('#phone').val().trim() || '',
                newsletter: $('#newsletter').is(':checked'),
                joinDate: new Date().toISOString(),
                points: 100,
                tier: 'Bronze',
                preferences: {
                    cuisine: '',
                    dietary: []
                }
            };

            // Check for existing user
            if (this.users.find(user => user.email === userData.email)) {
                this.showNotification('An account with this email already exists.', 'error');
                this.setLoadingState($submitBtn, false);
                return;
            }

            // Simulate API call
            setTimeout(() => {
                this.users.push(userData);
                localStorage.setItem('gourmetHaven_users', JSON.stringify(this.users));
                
                this.currentUser = userData;
                sessionStorage.setItem('gourmetHaven_currentUser', JSON.stringify(userData));
                
                this.showNotification(`Welcome to Gourmet Haven, ${userData.firstName}! You've earned 100 bonus points.`, 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            }, 1000);
        },

        handleLogin: function(e) {
            e.preventDefault();
            const $form = $(e.target);
            const $submitBtn = $form.find('.auth-submit-btn');
            
            if (!this.validateLoginForm()) {
                this.showNotification('Please check your email and password.', 'error');
                return;
            }

            this.setLoadingState($submitBtn, true);

            const email = $('#loginEmail').val().trim().toLowerCase();
            const password = $('#loginPassword').val();
            const rememberMe = $('#rememberMe').is(':checked');

            // Simulate API call
            setTimeout(() => {
                const user = this.users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    this.currentUser = user;
                    sessionStorage.setItem('gourmetHaven_currentUser', JSON.stringify(user));
                    
                    if (rememberMe) {
                        localStorage.setItem('gourmetHaven_rememberMe', 'true');
                    }
                    
                    this.showNotification(`Welcome back, ${user.firstName}!`, 'success');
                    
                    // Redirect to return URL or home page
                    const returnUrl = sessionStorage.getItem('gourmetHaven_returnUrl') || 'index.html';
                    sessionStorage.removeItem('gourmetHaven_returnUrl');
                    
                    setTimeout(() => {
                        window.location.href = returnUrl;
                    }, 1000);
                    
                } else {
                    this.showNotification('Invalid email or password. Please try again.', 'error');
                    this.setLoadingState($submitBtn, false);
                }
            }, 1000);
        },

        handleLogout: function(e) {
            e.preventDefault();
            
            this.currentUser = null;
            sessionStorage.removeItem('gourmetHaven_currentUser');
            localStorage.removeItem('gourmetHaven_rememberMe');
            
            this.showNotification('You have been logged out successfully.', 'info');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        },

        validateSignupForm: function() {
            let isValid = true;
            
            // Required fields
            $('.auth-form input[required]').each(function() {
                if (!$(this).val().trim()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            
            // Email validation
            const email = $('#signupEmail').val();
            if (email && !this.isValidEmail(email)) {
                $('#signupEmail').addClass('is-invalid');
                isValid = false;
            }
            
            // Password strength
            const password = $('#signupPassword').val();
            if (password && password.length < 8) {
                $('#signupPassword').addClass('is-invalid');
                isValid = false;
            }
            
            // Password match
            if (!this.validatePasswords()) {
                isValid = false;
            }
            
            // Terms agreement
            if (!$('#terms').is(':checked')) {
                $('#terms').addClass('is-invalid');
                isValid = false;
            } else {
                $('#terms').removeClass('is-invalid');
            }
            
            return isValid;
        },

        validateLoginForm: function() {
            let isValid = true;
            
            $('.auth-form input[required]').each(function() {
                if (!$(this).val().trim()) {
                    $(this).addClass('is-invalid');
                    isValid = false;
                } else {
                    $(this).removeClass('is-invalid');
                }
            });
            
            return isValid;
        },

        validatePasswords: function() {
            const password = $('#signupPassword').val();
            const confirmPassword = $('#confirmPassword').val();
            const $matchText = $('#passwordMatchText');
            
            if (confirmPassword && password !== confirmPassword) {
                $('#confirmPassword').addClass('is-invalid');
                $matchText.text('Passwords do not match').addClass('text-danger').removeClass('text-success');
                return false;
            } else if (confirmPassword) {
                $('#confirmPassword').removeClass('is-invalid');
                $matchText.text('Passwords match').addClass('text-success').removeClass('text-danger');
                return true;
            }
            
            return true;
        },

        updatePasswordStrength: function() {
            const password = $('#signupPassword').val();
            const strength = this.calculatePasswordStrength(password);
            const $bar = $('#passwordStrengthBar');
            const $text = $('#passwordStrengthText');
            
            const levels = [
                { width: '20%', class: 'bg-danger', text: 'Very Weak' },
                { width: '40%', class: 'bg-danger', text: 'Weak' },
                { width: '60%', class: 'bg-warning', text: 'Fair' },
                { width: '80%', class: 'bg-info', text: 'Good' },
                { width: '100%', class: 'bg-success', text: 'Strong' }
            ];
            
            const level = levels[strength];
            $bar.width(level.width).removeClass('bg-danger bg-warning bg-info bg-success').addClass(level.class);
            $text.text(level.text);
        },

        calculatePasswordStrength: function(password) {
            let strength = 0;
            
            if (password.length >= 8) strength += 1;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 1;
            if (password.match(/\d/)) strength += 1;
            if (password.match(/[^a-zA-Z\d]/)) strength += 1;
            
            return strength;
        },

        setLoadingState: function($button, isLoading) {
            const $text = $button.find('.btn-text');
            const $loading = $button.find('.btn-loading');
            
            if (isLoading) {
                $text.addClass('d-none');
                $loading.removeClass('d-none');
                $button.prop('disabled', true);
            } else {
                $text.removeClass('d-none');
                $loading.addClass('d-none');
                $button.prop('disabled', false);
            }
        },

        isValidEmail: function(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },

        showNotification: function(message, type = 'info') {
            // Use existing notification system or create a simple one
            if (typeof showNotification === 'function') {
                showNotification(message, type);
            } else {
                // Simple notification fallback
                const alertClass = {
                    'success': 'alert-success',
                    'error': 'alert-danger',
                    'info': 'alert-info',
                    'warning': 'alert-warning'
                }[type] || 'alert-info';
                
                const $alert = $(`
                    <div class="alert ${alertClass} alert-dismissible fade show position-fixed" 
                         style="top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                `);
                
                $('body').append($alert);
                
                setTimeout(() => {
                    $alert.alert('close');
                }, 4000);
            }
        },

        setupDarkMode: function() {
            const darkModeToggle = $('#darkModeToggle');
            const savedTheme = localStorage.getItem('theme') || 'light';
            
            // Apply saved theme
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                darkModeToggle.text('☀️');
            }

            darkModeToggle.on('click', function() {
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('theme', 'dark');
                    $(this).text('☀️');
                } else {
                    localStorage.setItem('theme', 'light');
                    $(this).text('🌙');
                }
            });
        }
    };

    // Initialize authentication system
    AuthSystem.init();
});
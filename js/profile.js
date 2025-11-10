$(document).ready(function() {
    console.log("Profile JavaScript loaded!");

    const ProfileSystem = {
        init: function() {
            this.loadUserData();
            this.setupEventListeners();
        },

        loadUserData: function() {
            const currentUser = JSON.parse(sessionStorage.getItem('gourmetHaven_currentUser'));
            
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }

            // Populate profile data
            $('#avatarInitials').text(currentUser.firstName[0] + currentUser.lastName[0]);
            $('#profileName').text(currentUser.firstName + ' ' + currentUser.lastName);
            $('#memberTier').text(currentUser.tier + ' Member');
            $('#memberPoints').text(currentUser.points.toLocaleString());
            $('#memberSince').text(new Date(currentUser.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
            }));

            // Populate form fields
            $('#profileFirstName').val(currentUser.firstName);
            $('#profileLastName').val(currentUser.lastName);
            $('#profileEmail').val(currentUser.email);
            $('#profilePhone').val(currentUser.phone || '');
        },

        setupEventListeners: function() {
            $('#profileForm').on('submit', (e) => this.handleProfileUpdate(e));
            $('#preferencesForm').on('submit', (e) => this.handlePreferencesUpdate(e));
        },

        handleProfileUpdate: function(e) {
            e.preventDefault();
            
            const currentUser = JSON.parse(sessionStorage.getItem('gourmetHaven_currentUser'));
            const users = JSON.parse(localStorage.getItem('gourmetHaven_users'));
            
            // Update user data
            const updatedUser = {
                ...currentUser,
                firstName: $('#profileFirstName').val().trim(),
                lastName: $('#profileLastName').val().trim(),
                email: $('#profileEmail').val().trim(),
                phone: $('#profilePhone').val().trim()
            };
            
            // Update in storage
            sessionStorage.setItem('gourmetHaven_currentUser', JSON.stringify(updatedUser));
            
            const userIndex = users.findIndex(user => user.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = updatedUser;
                localStorage.setItem('gourmetHaven_users', JSON.stringify(users));
            }
            
            // Update UI
            $('#avatarInitials').text(updatedUser.firstName[0] + updatedUser.lastName[0]);
            $('#profileName').text(updatedUser.firstName + ' ' + updatedUser.lastName);
            
            this.showNotification('Profile updated successfully!', 'success');
        },

        handlePreferencesUpdate: function(e) {
            e.preventDefault();
            this.showNotification('Preferences saved successfully!', 'success');
        },

        showNotification: function(message, type) {
            // Use the same notification system as auth.js
            if (typeof AuthSystem !== 'undefined') {
                AuthSystem.showNotification(message, type);
            } else {
                alert(message);
            }
        }
    };

    ProfileSystem.init();
});
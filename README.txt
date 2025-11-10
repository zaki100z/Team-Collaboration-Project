🍽️ Gourmet Haven - Restaurant Website
A modern, responsive restaurant website built with pure frontend technologies featuring user authentication, interactive menu, online reservations, and real-time food API integration.

🌟 Live Demo
🌐 View Live Website
tubular-jelly-c11deb.netlify.app

📸 Preview
https://Images/resturant3.jpg

✨ Features
🔐 Authentication System
User Registration & Login with form validation

Profile Management with user dashboard

Session Management using localStorage

Protected Routes - automatic redirect to login

🎨 User Experience
Dark/Light Mode Toggle with persistent settings

Fully Responsive Design for all devices

Interactive Gallery with filtering and search

Smooth Animations and hover effects

🍕 Menu & Gallery
Dynamic Food Gallery with category filtering

Real-time Search with highlighting

Recipe Suggestions from Spoonacular API

Food Trivia and culinary facts

⭐ Rating System
Star-based Ratings for menu items

User Reviews with comments

Average Rating Calculation

Persistent Storage in localStorage

📅 Reservation System
Online Table Booking with date/time selection

Form Validation for all inputs

Confirmation Notifications

Booking Management

🔌 API Integration
Spoonacular Food API for recipes and trivia

Real-time Data Fetching

Caching System for performance

Fallback Content when offline

🛠️ Technologies Used
Frontend: HTML5, CSS3, JavaScript (ES6+)

Framework: Bootstrap 5.3.8

JavaScript Library: jQuery 3.7.1

Icons: Font Awesome 6.0

Fonts: Google Fonts (DM Sans, Dancing Script, Playfair Display, Poppins)

API: Spoonacular Food API

Storage: localStorage for data persistence

Deployment: GitHub Pages

📁 Project Structure
text
gourmet-haven-restaurant/
├── index.html              # Homepage
├── menu.html               # Menu page
├── about.html              # About us
├── gallery.html            # Photo gallery with ratings
├── contact.html            # Contact form
├── reservation.html        # Online reservation system
├── login.html              # User login
├── signup.html             # User registration
├── profile.html            # User profile dashboard
├── css/
│   ├── gallery.css         # Gallery page styles
│   ├── auth.css            # Authentication styles
│   ├── jquery-styles.css   # jQuery component styles
│   └── api-styles.css      # API integration styles
├── js/
│   ├── auth.js             # Authentication system
│   ├── gallery.js          # Gallery functionality
│   ├── reservation.js      # Reservation system
│   ├── api-integration.js  # Food API integration
│   ├── ratings.js          # Rating system
│   └── profile.js          # Profile management
├── Images/
│   ├── food2.jpg           # Gallery images
│   ├── food3.jpg
│   ├── food4.jpg
│   ├── resturant1.jpg
│   ├── resturant2.jpg
│   └── resturant3.jpg
└── README.md
🚀 Quick Start
Prerequisites
Modern web browser (Chrome, Firefox, Safari, Edge)

No server required - runs entirely in browser

Installation
Clone the repository

bash
git clone https://github.com/yourusername/gourmet-haven-restaurant.git
Navigate to project directory

bash
cd gourmet-haven-restaurant
Open in browser

bash
# Open index.html in your preferred browser
open index.html
# Or simply double-click index.html
Using GitHub Pages
Fork this repository

Go to repository Settings → Pages

Select "Deploy from branch" and choose main branch

Your site will be available at https://yourusername.github.io/gourmet-haven-restaurant

🎯 Key Functionality
User Authentication
javascript
// Example: User registration
const user = {
  firstName: "John",
  lastName: "Doe", 
  email: "john@example.com",
  password: "securepassword",
  joinDate: new Date().toISOString(),
  points: 100, // Welcome bonus
  tier: "Bronze"
};
API Integration
javascript
// Fetch food trivia from Spoonacular API
const api = new RestaurantAPI();
const trivia = await api.getFoodTrivia();
const recipes = await api.getRecipeSuggestions(3);
Rating System
javascript
// Rate a menu item
ratingSystem.rateItem("grilled-salmon", 5, "Amazing dish!");
// Updates localStorage and UI automatically
🔧 Customization
Adding New Menu Items
Edit gallery.html and add new cards with proper data attributes:

html
<div class="gallery-item" data-category="food" data-item-id="new-dish">
  <!-- Card content -->
  <div class="item-rating"></div>
  <button class="rate-btn" data-item-id="new-dish">Rate This Dish</button>
</div>
Modifying Colors
Update CSS variables in css/gallery.css:

css
:root {
  --primary-color: #ffc107;
  --secondary-color: #dc3545;
  --dark-bg: #1a1a1a;
}
API Configuration
Get your free API key from Spoonacular and update in js/api-integration.js:

javascript
this.apiKey = 'your_spoonacular_api_key_here';
📱 Responsive Design
The website is fully responsive and optimized for:

Desktop (1200px+)

Tablet (768px - 1199px)

Mobile (320px - 767px)

🌙 Dark Mode
Toggle between light and dark themes with persistent user preference stored in localStorage.

🔒 Security Features
Form validation for all user inputs

Password strength requirements

Email format validation

XSS protection through input sanitization

Secure localStorage data handling

📊 Performance
Lazy loading for images
API response caching (5-minute TTL)
Minimal external dependencies
Optimized asset loading

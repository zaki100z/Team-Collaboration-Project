// Gourmet Haven Restaurant API Integration System
class RestaurantAPI {
    constructor() {
        // Free API key from Spoonacular (you can get your own at https://spoonacular.com/food-api)
        this.apiKey = '6c2c7d7d90b54c5a8b4b7d7a7a8b4b7d'; // This is a demo key - replace with your own
        this.baseURL = 'https://api.spoonacular.com';
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes cache
    }

    // Get random food trivia
    async getFoodTrivia() {
        const cacheKey = 'foodTrivia';
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(`${this.baseURL}/food/trivia/random?apiKey=${this.apiKey}`);
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            this.cacheData(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error('Food Trivia API Error:', error);
            // Fallback trivia
            return this.getFallbackTrivia();
        }
    }

    // Get random recipe suggestions
    async getRecipeSuggestions(number = 3) {
        const cacheKey = `recipes_${number}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(
                `${this.baseURL}/recipes/random?number=${number}&apiKey=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            this.cacheData(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error('Recipe API Error:', error);
            // Fallback recipes
            return { recipes: this.getFallbackRecipes() };
        }
    }

    // Search for recipes by ingredients
    async searchRecipesByIngredients(ingredients, number = 5) {
        const cacheKey = `recipes_${ingredients}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(
                `${this.baseURL}/recipes/findByIngredients?ingredients=${ingredients}&number=${number}&apiKey=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            this.cacheData(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error('Recipe Search API Error:', error);
            return [];
        }
    }

    // Get recipe information
    async getRecipeInformation(recipeId) {
        const cacheKey = `recipe_${recipeId}`;
        const cached = this.getCachedData(cacheKey);
        
        if (cached) {
            return cached;
        }

        try {
            const response = await fetch(
                `${this.baseURL}/recipes/${recipeId}/information?apiKey=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            this.cacheData(cacheKey, data);
            return data;
            
        } catch (error) {
            console.error('Recipe Info API Error:', error);
            return null;
        }
    }

    // Cache management
    cacheData(key, data) {
        const cache = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(`api_cache_${key}`, JSON.stringify(cache));
    }

    getCachedData(key) {
        const cached = localStorage.getItem(`api_cache_${key}`);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > this.cacheDuration) {
            localStorage.removeItem(`api_cache_${key}`);
            return null;
        }

        return data;
    }

    // Fallback data when API fails
    getFallbackTrivia() {
        const fallbackTrivia = [
            "The world's most expensive pizza costs $12,000 and is topped with caviar and lobster!",
            "Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat.",
            "The fear of cooking is known as Mageirocophobia.",
            "Bananas are berries, but strawberries aren't!",
            "The first recorded recipe was written on a tablet in ancient Babylon around 1750 BC."
        ];
        
        return {
            text: fallbackTrivia[Math.floor(Math.random() * fallbackTrivia.length)]
        };
    }

    getFallbackRecipes() {
        return [
            {
                id: 1,
                title: "Mediterranean Grilled Salmon",
                image: "Images/food2.jpg",
                readyInMinutes: 25,
                summary: "Fresh salmon fillet grilled to perfection with herbs and lemon",
                extendedIngredients: [
                    { original: "2 salmon fillets" },
                    { original: "1 lemon, sliced" },
                    { original: "2 tbsp olive oil" },
                    { original: "Fresh dill and parsley" }
                ]
            },
            {
                id: 2,
                title: "Classic Beef Wellington",
                image: "Images/food3.jpg",
                readyInMinutes: 45,
                summary: "Tender beef wrapped in puff pastry with mushroom duxelles",
                extendedIngredients: [
                    { original: "500g beef tenderloin" },
                    { original: "200g mushrooms" },
                    { original: "1 sheet puff pastry" },
                    { original: "2 tbsp Dijon mustard" }
                ]
            },
            {
                id: 3,
                title: "Artisan Tiramisu",
                image: "Images/food4.jpg",
                readyInMinutes: 30,
                summary: "Classic Italian dessert with coffee-soaked ladyfingers",
                extendedIngredients: [
                    { original: "250g mascarpone cheese" },
                    { original: "3 eggs" },
                    { original: "200ml strong coffee" },
                    { original: "Ladyfinger biscuits" }
                ]
            }
        ];
    }
}

// API Integration Manager
class APIIntegrationManager {
    constructor() {
        this.api = new RestaurantAPI();
        this.currentRatingItem = null;
        this.currentRating = 0;
    }

    init() {
        this.loadFoodTrivia();
        this.loadRecipeSuggestions();
        this.setupEventListeners();
        this.initializeRatings();
    }

    // Load and display food trivia
    async loadFoodTrivia() {
        const triviaElement = $('#foodTrivia');
        
        try {
            const trivia = await this.api.getFoodTrivia();
            triviaElement.html(`"${trivia.text}"`);
        } catch (error) {
            triviaElement.html('"Experience the finest culinary delights at Gourmet Haven!"');
        }
    }

    // Load and display recipe suggestions
    async loadRecipeSuggestions() {
        const recipesContainer = $('#recipeSuggestions');
        
        try {
            const data = await this.api.getRecipeSuggestions(3);
            const recipes = data.recipes || this.api.getFallbackRecipes();
            
            this.displayRecipes(recipes, recipesContainer);
            
        } catch (error) {
            const fallbackRecipes = this.api.getFallbackRecipes();
            this.displayRecipes(fallbackRecipes, recipesContainer);
        }
    }

    // Display recipes in the UI
    displayRecipes(recipes, container) {
        const recipesHTML = recipes.map(recipe => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 border-0 shadow-sm recipe-card">
                    <img src="${recipe.image || 'Images/food2.jpg'}" 
                         class="card-img-top recipe-image" 
                         alt="${recipe.title}"
                         style="height: 200px; object-fit: cover;"
                         onerror="this.src='Images/food2.jpg'">
                    <div class="card-body">
                        <h5 class="card-title">${recipe.title}</h5>
                        <div class="recipe-meta mb-2">
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${recipe.readyInMinutes || 30} mins
                            </small>
                        </div>
                        <p class="card-text">${this.truncateText(recipe.summary || 'A delicious culinary creation from our kitchen.', 100)}</p>
                        <div class="recipe-actions">
                            <button class="btn btn-sm btn-outline-warning view-recipe" 
                                    data-recipe-id="${recipe.id}">
                                <i class="fas fa-utensils me-1"></i>View Recipe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        container.html(recipesHTML);
        this.setupRecipeEventListeners();
    }

    // Setup event listeners for API features
    setupEventListeners() {
        // Refresh trivia
        $('#refreshTrivia').on('click', () => {
            $('#foodTrivia').html(`
                <div class="spinner-border spinner-border-sm text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div> Loading...
            `);
            this.loadFoodTrivia();
        });

        // Rating system
        this.setupRatingSystem();
    }

    // Setup recipe event listeners
    setupRecipeEventListeners() {
        $('.view-recipe').on('click', (e) => {
            const recipeId = $(e.target).closest('.view-recipe').data('recipe-id');
            this.showRecipeDetails(recipeId);
        });
    }

    // Show recipe details modal
    async showRecipeDetails(recipeId) {
        try {
            const recipe = await this.api.getRecipeInformation(recipeId);
            this.displayRecipeModal(recipe);
        } catch (error) {
            this.showNotification('Recipe details unavailable at the moment.', 'error');
        }
    }

    // Display recipe in modal
    displayRecipeModal(recipe) {
        const ingredients = recipe.extendedIngredients?.map(ing => ing.original).join('\n• ') || 'Ingredients not available';
        
        const modalHTML = `
            <div class="modal fade" id="recipeModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${recipe.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src="${recipe.image}" class="img-fluid rounded mb-3" alt="${recipe.title}">
                                    <div class="recipe-info">
                                        <p><strong>Ready in:</strong> ${recipe.readyInMinutes} minutes</p>
                                        <p><strong>Servings:</strong> ${recipe.servings}</p>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6>Ingredients:</h6>
                                    <ul>
                                        ${recipe.extendedIngredients?.map(ing => 
                                            `<li>${ing.original}</li>`
                                        ).join('') || '<li>Ingredients not available</li>'}
                                    </ul>
                                </div>
                            </div>
                            ${recipe.instructions ? `
                                <div class="mt-3">
                                    <h6>Instructions:</h6>
                                    <p>${recipe.instructions}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        $('#recipeModal').remove();
        $('body').append(modalHTML);
        
        // Show modal
        const recipeModal = new bootstrap.Modal(document.getElementById('recipeModal'));
        recipeModal.show();
    }

    // Rating System
    setupRatingSystem() {
        const ratingSystem = new RatingSystem();
        
        // Rate button click
        $(document).on('click', '.rate-btn', (e) => {
            const itemId = $(e.target).closest('.rate-btn').data('item-id');
            const itemName = $(e.target).closest('.card').find('.card-title').text();
            this.showRatingModal(itemId, itemName);
        });

        // Star rating hover
        $(document).on('mouseenter', '.star', function() {
            const rating = $(this).data('rating');
            highlightStars(rating);
        });

        $(document).on('mouseleave', '.star-rating', function() {
            highlightStars(this.currentRating || 0);
        });

        // Star click
        $(document).on('click', '.star', function() {
            this.currentRating = $(this).data('rating');
            highlightStars(this.currentRating);
            $('#selectedRating').text(`You selected: ${this.currentRating} star${this.currentRating > 1 ? 's' : ''}`);
            $('#ratingText').addClass('d-none');
        });

        // Submit rating
        $('#submitRating').on('click', () => {
            if (this.currentRating === 0) {
                this.showNotification('Please select a rating', 'error');
                return;
            }

            const comment = $('#ratingComment').val();
            const success = ratingSystem.rateItem(
                this.currentRatingItem, 
                this.currentRating, 
                comment
            );

            if (success) {
                this.showNotification('Thank you for your rating!', 'success');
                $('#ratingModal').modal('hide');
                this.resetRatingModal();
            }
        });

        // Reset modal when hidden
        $('#ratingModal').on('hidden.bs.modal', () => {
            this.resetRatingModal();
        });

        function highlightStars(rating) {
            $('.star').each(function() {
                const starRating = $(this).data('rating');
                $(this).text(starRating <= rating ? '★' : '☆');
                $(this).toggleClass('text-warning', starRating <= rating);
            });
        }
    }

    showRatingModal(itemId, itemName) {
        this.currentRatingItem = itemId;
        this.currentRating = 0;
        
        $('#ratingItemName').text(itemName);
        $('#ratingModal').modal('show');
    }

    resetRatingModal() {
        this.currentRating = 0;
        $('.star').text('☆').removeClass('text-warning');
        $('#ratingComment').val('');
        $('#selectedRating').text('');
        $('#ratingText').removeClass('d-none');
    }

    initializeRatings() {
        const ratingSystem = new RatingSystem();
        
        // Update all item ratings on page load
        $('[data-item-id]').each(function() {
            const itemId = $(this).data('item-id');
            ratingSystem.updateItemRating(itemId);
        });
    }

    // Utility functions
    truncateText(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    showNotification(message, type = 'info') {
        // Use existing notification system or create simple alert
        if (typeof AuthSystem !== 'undefined' && AuthSystem.showNotification) {
            AuthSystem.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Rating System Class
class RatingSystem {
    constructor() {
        this.ratings = JSON.parse(localStorage.getItem('gourmetHaven_ratings')) || {};
    }

    rateItem(itemId, rating, comment = '') {
        const user = JSON.parse(sessionStorage.getItem('gourmetHaven_currentUser'));
        if (!user) {
            this.showNotification('Please log in to rate items', 'error');
            return false;
        }

        if (!this.ratings[itemId]) {
            this.ratings[itemId] = [];
        }

        // Check if user already rated this item
        const existingRatingIndex = this.ratings[itemId].findIndex(r => r.userId === user.id);
        
        if (existingRatingIndex !== -1) {
            this.ratings[itemId][existingRatingIndex] = {
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                rating: rating,
                comment: comment,
                timestamp: new Date().toISOString()
            };
        } else {
            this.ratings[itemId].push({
                userId: user.id,
                userName: `${user.firstName} ${user.lastName}`,
                rating: rating,
                comment: comment,
                timestamp: new Date().toISOString()
            });
        }

        localStorage.setItem('gourmetHaven_ratings', JSON.stringify(this.ratings));
        this.updateItemRating(itemId);
        return true;
    }

    getAverageRating(itemId) {
        if (!this.ratings[itemId] || this.ratings[itemId].length === 0) {
            return 0;
        }

        const sum = this.ratings[itemId].reduce((acc, curr) => acc + curr.rating, 0);
        return (sum / this.ratings[itemId].length).toFixed(1);
    }

    getRatingCount(itemId) {
        return this.ratings[itemId] ? this.ratings[itemId].length : 0;
    }

    updateItemRating(itemId) {
        const avgRating = this.getAverageRating(itemId);
        const ratingCount = this.getRatingCount(itemId);
        const $ratingElement = $(`[data-item-id="${itemId}"] .item-rating`);
        
        if ($ratingElement.length) {
            if (ratingCount > 0) {
                const stars = '★'.repeat(Math.round(avgRating)) + '☆'.repeat(5 - Math.round(avgRating));
                $ratingElement.html(`
                    <span class="text-warning">${stars}</span>
                    <small class="text-muted">(${avgRating} • ${ratingCount} review${ratingCount !== 1 ? 's' : ''})</small>
                `);
            } else {
                $ratingElement.html('<small class="text-muted">No ratings yet</small>');
            }
        }
    }

    showNotification(message, type) {
        if (typeof AuthSystem !== 'undefined' && AuthSystem.showNotification) {
            AuthSystem.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize API Integration when document is ready
$(document).ready(function() {
    const apiManager = new APIIntegrationManager();
    apiManager.init();
    
    console.log('API Integration System Initialized');
});
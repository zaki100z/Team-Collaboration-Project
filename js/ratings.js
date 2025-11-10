// Rating System Implementation
class RatingSystem {
    constructor() {
        this.ratings = JSON.parse(localStorage.getItem('gourmetHaven_ratings')) || {};
        this.currentUser = JSON.parse(sessionStorage.getItem('gourmetHaven_currentUser'));
    }

    init() {
        this.updateAllRatings();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Rate button clicks
        $(document).on('click', '.rate-btn', (e) => {
            if (!this.currentUser) {
                this.showNotification('Please log in to rate items', 'error');
                return;
            }
            
            const itemId = $(e.target).closest('.rate-btn').data('item-id');
            this.showRatingDialog(itemId);
        });
    }

    showRatingDialog(itemId) {
        // Simple rating prompt - you can enhance this with a modal
        const rating = prompt('Rate this item (1-5 stars):');
        if (rating && rating >= 1 && rating <= 5) {
            this.rateItem(itemId, parseInt(rating));
        }
    }

    rateItem(itemId, rating, comment = '') {
        if (!this.currentUser) {
            this.showNotification('Please log in to rate items', 'error');
            return false;
        }

        if (!this.ratings[itemId]) {
            this.ratings[itemId] = [];
        }

        // Update or add rating
        const existingIndex = this.ratings[itemId].findIndex(r => r.userId === this.currentUser.id);
        
        if (existingIndex !== -1) {
            this.ratings[itemId][existingIndex] = {
                ...this.ratings[itemId][existingIndex],
                rating: rating,
                comment: comment,
                timestamp: new Date().toISOString()
            };
        } else {
            this.ratings[itemId].push({
                userId: this.currentUser.id,
                userName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
                rating: rating,
                comment: comment,
                timestamp: new Date().toISOString()
            });
        }

        localStorage.setItem('gourmetHaven_ratings', JSON.stringify(this.ratings));
        this.updateItemRating(itemId);
        this.showNotification('Thank you for your rating!', 'success');
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
                    <small class="text-muted">(${avgRating}/5 • ${ratingCount} review${ratingCount !== 1 ? 's' : ''})</small>
                `);
            }
        }
    }

    updateAllRatings() {
        $('[data-item-id]').each((index, element) => {
            const itemId = $(element).data('item-id');
            this.updateItemRating(itemId);
        });
    }

    showNotification(message, type = 'info') {
        if (typeof AuthSystem !== 'undefined' && AuthSystem.showNotification) {
            AuthSystem.showNotification(message, type);
        } else {
            // Simple notification fallback
            const alertClass = type === 'error' ? 'alert-danger' : 
                             type === 'success' ? 'alert-success' : 'alert-info';
            
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
            }, 3000);
        }
    }
}

// Initialize rating system
$(document).ready(function() {
    const ratingSystem = new RatingSystem();
    ratingSystem.init();
});
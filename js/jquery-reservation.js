$(document).ready(function() {
    console.log("jQuery is ready!");
    
    // ====================
    // PART 2: UX ENGAGEMENT ELEMENTS
    // ====================
    
    // Task 4: Scroll Progress Bar
    function createScrollProgressBar() {
        $('body').prepend(`
            <div class="scroll-progress-container">
                <div class="scroll-progress-bar"></div>
            </div>
        `);
        
        $(window).on('scroll', function() {
            const windowHeight = $(window).height();
            const documentHeight = $(document).height();
            const scrollTop = $(window).scrollTop();
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            $('.scroll-progress-bar').css('width', progress + '%');
        });
    }
    createScrollProgressBar();
    
    // Task 5: Animated Number Counter
    function animateCounter() {
        $('.counter').each(function() {
            const $this = $(this);
            const target = $this.data('target');
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    $this.text(isDecimal ? target.toFixed(1) : target + (target > 10 ? '+' : ''));
                    clearInterval(timer);
                } else {
                    $this.text(isDecimal ? current.toFixed(1) : Math.floor(current));
                }
            }, 16);
        });
    }
    
    // Animate when section comes into view
    $(window).on('scroll', function() {
        const statsSection = $('.stats-section');
        const sectionTop = statsSection.offset().top;
        const windowBottom = $(window).scrollTop() + $(window).height();
        
        if (windowBottom > sectionTop && !statsSection.hasClass('animated')) {
            animateCounter();
            statsSection.addClass('animated');
        }
    });
    
    // Task 6: Loading spinner on Submit
    $('#reservationForm').on('submit', function(e) {
        e.preventDefault();
        
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.html();
        
        // Show loading state
        $submitBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...');
        $submitBtn.prop('disabled', true);
        
        // Simulate server call
        setTimeout(function() {
            // Show success notification (Task 7)
            showNotification('Reservation submitted successfully! We will confirm shortly.', 'success');
            
            // Reset button
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
            
            // Reset form
            $('#reservationForm')[0].reset();
        }, 3000);
    });
    
    // Private events form spinner
    $('#submitEventForm').on('click', function() {
        const $btn = $(this);
        const originalText = $btn.html();
        
        $btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...');
        $btn.prop('disabled', true);
        
        setTimeout(function() {
            showNotification('Event inquiry sent! We will contact you within 24 hours.', 'success');
            $btn.html(originalText);
            $btn.prop('disabled', false);
            $('#privateEventsModal').modal('hide');
        }, 2000);
    });
    
    // ====================
    // PART 3: WEB APP FUNCTIONALITY
    // ====================
    
    // Task 7: Notification System
    function showNotification(message, type = 'info') {
        const notification = $(`
            <div class="notification toast-${type}">
                <div class="notification-content">
                    <span class="notification-message">${message}</span>
                    <button class="notification-close">&times;</button>
                </div>
            </div>
        `);
        
        $('body').append(notification);
        
        notification.slideDown(300);
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            notification.slideUp(300, function() {
                $(this).remove();
            });
        }, 5000);
        
        // Close on click
        notification.find('.notification-close').on('click', function() {
            notification.slideUp(300, function() {
                $(this).remove();
            });
        });
    }
    
    // Task 8: Copied to Clipboard Button
    // Add copy buttons to contact info
    $('.bg-dark .col-md-4').each(function() {
        const $section = $(this);
        $section.find('p').each(function() {
            const $textElement = $(this);
            if ($textElement.text().trim().length > 0) {
                $textElement.css('position', 'relative').css('padding-right', '30px');
                $textElement.append(`
                    <button class="btn btn-sm btn-outline-light copy-btn" title="Copy to clipboard" style="position: absolute; right: 0; top: 0;">
                        📋
                    </button>
                `);
            }
        });
    });
    
    $(document).on('click', '.copy-btn', function() {
        const textToCopy = $(this).parent().clone().find('.copy-btn').remove().end().text().trim();
        
        navigator.clipboard.writeText(textToCopy).then(function() {
            const $btn = $(this);
            $btn.html('✓');
            $btn.removeClass('btn-outline-light').addClass('btn-success');
            
            showNotification('Copied to clipboard!', 'success');
            
            setTimeout(function() {
                $btn.html('📋');
                $btn.removeClass('btn-success').addClass('btn-outline-light');
            }, 2000);
        }.bind(this));
    });
    
    // Task 9: Image Lazy Loading
    function lazyLoadImages() {
        $('img[data-src]').each(function() {
            const $img = $(this);
            
            if (isElementInViewport($img[0])) {
                $img.attr('src', $img.data('src'));
                $img.removeAttr('data-src');
                $img.addClass('lazy-loaded');
            }
        });
    }
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Convert existing images to lazy load
    $('.card-img-top').each(function() {
        const $img = $(this);
        const src = $img.attr('src');
        $img.attr('data-src', src);
        $img.attr('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+');
    });
    
    $(window).on('scroll resize', lazyLoadImages);
    lazyLoadImages(); // Initial load
    
    // Enhanced form validation with jQuery
    $('#reservationForm input, #reservationForm select').on('blur', function() {
        const $field = $(this);
        
        if ($field.is(':invalid') || !$field.val().trim()) {
            $field.addClass('is-invalid');
        } else {
            $field.removeClass('is-invalid').addClass('is-valid');
        }
    });
    
    // Real-time character counter for special requests
    $('#special-requests').on('input', function() {
        const length = $(this).val().length;
        let $counter = $(this).next('.char-counter');
        
        if ($counter.length === 0) {
            $(this).after('<div class="char-counter form-text"></div>');
            $counter = $(this).next('.char-counter');
        }
        
        $counter.text(`${length} characters`);
        
        if (length > 200) {
            $counter.addClass('text-warning');
        } else {
            $counter.removeClass('text-warning');
        }
    });
});
$(document).ready(function() {
    console.log("jQuery is ready!");
    
    // ====================
    // PART 1: JQUERY SEARCH
    // ====================
    
    // Task 1: Real-time Search and Live Filter
    $('#searchInput').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.gallery-item').each(function() {
            const title = $(this).find('.card-title').text().toLowerCase();
            const description = $(this).find('.card-text').text().toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    
    // Task 2: Autocomplete Search Suggestions
    const galleryTitles = [];
    $('.gallery-item .card-title').each(function() {
        galleryTitles.push($(this).text());
    });
    
    $('#searchInput').autocomplete({
        source: galleryTitles,
        minLength: 2
    });
    
    // Task 3: Search Highlighting
    function highlightSearchTerms(term) {
        // Remove previous highlights
        $('.gallery-item').removeHighlight();
        
        if (term.length > 2) {
            $('.gallery-item .card-title, .gallery-item .card-text').highlight(term);
        }
    }
    
    $('#searchInput').on('keyup', function() {
        highlightSearchTerms($(this).val());
    });
    
    // ====================
    // PART 2: UX ENGAGEMENT ELEMENTS
    // ====================
    
    // Task 4: Colorful and Stylized Scroll Progress Bar
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
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        const $submitBtn = $(this).find('button[type="submit"]');
        const originalText = $submitBtn.html();
        
        // Show loading state
        $submitBtn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Please wait...');
        $submitBtn.prop('disabled', true);
        
        // Simulate server call
        setTimeout(function() {
            // Show success notification (Task 7)
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            
            // Reset button
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);
            
            // Reset form
            $('#contactForm')[0].reset();
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
    $('.card-text').each(function() {
        const $textElement = $(this);
        if ($textElement.text().length > 50) {
            $textElement.after(`
                <button class="btn btn-sm btn-outline-secondary copy-btn" title="Copy to clipboard">
                    📋
                </button>
            `);
        }
    });
    
    $('.copy-btn').on('click', function() {
        const textToCopy = $(this).prev('.card-text').text();
        
        navigator.clipboard.writeText(textToCopy).then(function() {
            const $btn = $(this);
            $btn.html('✓');
            $btn.removeClass('btn-outline-secondary').addClass('btn-success');
            
            showNotification('Copied to clipboard!', 'success');
            
            setTimeout(function() {
                $btn.html('📋');
                $btn.removeClass('btn-success').addClass('btn-outline-secondary');
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
    $('.gallery-grid img').each(function() {
        const $img = $(this);
        const src = $img.attr('src');
        $img.attr('data-src', src);
        $img.attr('src', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+');
    });
    
    $(window).on('scroll resize', lazyLoadImages);
    lazyLoadImages(); // Initial load
    
    // Enhanced existing functionality with jQuery
    $('.btn-group button[data-filter]').on('click', function() {
        const filter = $(this).data('filter');
        
        // Remove active class from all buttons and add to current
        $('.btn-group button[data-filter]').removeClass('active');
        $(this).addClass('active');
        
        // Filter items
        $('.gallery-item').each(function() {
            const category = $(this).data('category');
            if (filter === 'all' || category === filter) {
                $(this).fadeIn(500);
            } else {
                $(this).fadeOut(500);
            }
        });
        
        showNotification(`Showing ${filter} items`, 'info');
    });
    
    // Enhanced modal with jQuery
    $('.gallery-grid .card-img-top').on('click', function() {
        const src = $(this).attr('src');
        const alt = $(this).attr('alt');
        createImageModal(src, alt);
    });
});

// Enhanced modal function with jQuery
function createImageModal(src, alt) {
    // Remove existing modal if any
    $('.image-modal').remove();
    
    const modal = $(`
        <div class="image-modal">
            <img src="${src}" alt="${alt}">
            <button class="modal-close">&times;</button>
        </div>
    `);
    
    $('body').append(modal);
    
    modal.fadeIn(300);
    
    // Close modal events
    modal.find('.modal-close').on('click', function() {
        modal.fadeOut(300, function() {
            $(this).remove();
        });
    });
    
    modal.on('click', function(e) {
        if (e.target === this) {
            modal.fadeOut(300, function() {
                $(this).remove();
            });
        }
    });
}
// jQuery highlight plugin (if not using CDN)
if (typeof jQuery !== 'undefined') {
    (function($) {
        $.fn.highlight = function(pat) {
            function innerHighlight(node, pat) {
                var skip = 0;
                if (node.nodeType === 3) {
                    var pos = node.data.toUpperCase().indexOf(pat);
                    if (pos >= 0) {
                        var spannode = document.createElement('span');
                        spannode.className = 'highlight';
                        var middlebit = node.splitText(pos);
                        var endbit = middlebit.splitText(pat.length);
                        var middleclone = middlebit.cloneNode(true);
                        spannode.appendChild(middleclone);
                        middlebit.parentNode.replaceChild(spannode, middlebit);
                        skip = 1;
                    }
                } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
                    for (var i = 0; i < node.childNodes.length; ++i) {
                        i += innerHighlight(node.childNodes[i], pat);
                    }
                }
                return skip;
            }
            return this.each(function() {
                innerHighlight(this, pat.toUpperCase());
            });
        };
        
        $.fn.removeHighlight = function() {
            return this.find("span.highlight").each(function() {
                this.parentNode.firstChild.nodeName;
                with (this.parentNode) {
                    replaceChild(this.firstChild, this);
                    normalize();
                }
            }).end();
        };
    })(jQuery);
}
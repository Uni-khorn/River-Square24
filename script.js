// River Square 24 - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // ===== STICKY HEADER =====
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash or home link
            if (href === '#' || href === '#home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            // Handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ===== SCROLL TO TOP BUTTON =====
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== RESERVATION FORM =====
    // ===== GOOGLE FORMS RESERVATION SYSTEM =====
const reservationForm = document.getElementById('reservationForm');

if (reservationForm) {
    // === YOUR CONFIGURATION ===
    const GOOGLE_FORM_CONFIG = {
        formId: 'UYTSth6Z5YQscazx9', // From your URL
        entryIds: {
            name: 'entry.1275504584',     // Full Name
            email: 'entry.1759467184',    // Email Address
            phone: 'entry.1760490340',    // Phone Number
            date: 'entry.1751392484',     // Reservation Date
            time: 'entry.578753822',      // Reservation Time
            guests: 'entry.1007291271',   // Number of Guests
            requests: 'entry.992892117'   // Special Requests
        },
        formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSf93rH6S4P4rLz9StCCaQ7h9-ZiTPNMSnLLYqdN7LhQ-jZkPQ/formResponse'
    };
    // === END CONFIGURATION ===
    
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
    
    // Update form action
    reservationForm.action = GOOGLE_FORM_CONFIG.formAction;
    
    // Create hidden inputs for Google Forms
    Object.entries(GOOGLE_FORM_CONFIG.entryIds).forEach(([field, entryId]) => {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = entryId;
        hiddenInput.id = `entry-${field}`;
        reservationForm.appendChild(hiddenInput);
    });
    
    // Form submission handler
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const data = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            specialRequests: document.getElementById('special-requests').value.trim()
        };
        
        // Validate form
        if (!validateReservationForm(data)) {
            return;
        }
        
        // Update hidden fields with data
        document.getElementById('entry-name').value = data.name;
        document.getElementById('entry-email').value = data.email;
        document.getElementById('entry-phone').value = data.phone;
        document.getElementById('entry-date').value = data.date;
        document.getElementById('entry-time').value = data.time;
        document.getElementById('entry-guests').value = data.guests;
        document.getElementById('entry-requests').value = data.specialRequests;
        
        // Show loading state
        const submitBtn = this.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        // Format date for display
        const reservationDate = new Date(data.date);
        const formattedDate = reservationDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Format time for display
        const [hours, minutes] = data.time.split(':');
        const formattedTime = new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        });
        
        // Create hidden iframe for submission
        const hiddenIframe = document.createElement('iframe');
        hiddenIframe.name = 'hidden_iframe';
        hiddenIframe.id = 'hidden_iframe';
        hiddenIframe.style.display = 'none';
        document.body.appendChild(hiddenIframe);
        
        // Set form target to iframe
        this.target = 'hidden_iframe';
        
        // Add callback for iframe load
        hiddenIframe.onload = function() {
            // Remove iframe
            document.body.removeChild(hiddenIframe);
            
            // Show success message
            showNotification(`
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h4>Reservation Submitted Successfully!</h4>
                        <p><strong>Thank you, ${data.name}!</strong></p>
                        <p>Your table for ${data.guests} on <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong> has been reserved.</p>
                        <p>We will contact you shortly to confirm your booking.</p>
                    </div>
                </div>
            `, 'success');
            
            // Reset form
            reservationForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            
            // Reset form target
            reservationForm.target = '_self';
            
            // Log for debugging
            console.log('Reservation submitted to Google Forms:', data);
        };
        
        // Submit the form
        this.submit();
    });
    
    // Validation function
    function validateReservationForm(data) {
        // Check required fields
        if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.guests) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Phone validation (basic - accepts international formats)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
            showNotification('Please enter a valid phone number (minimum 8 digits)', 'error');
            return false;
        }
        
        // Date validation
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date', 'error');
            return false;
        }
        
        // Check if date is too far in future (optional)
        const maxFutureDate = new Date();
        maxFutureDate.setMonth(maxFutureDate.getMonth() + 6);
        if (selectedDate > maxFutureDate) {
            showNotification('Please select a date within the next 6 months', 'error');
            return false;
        }
        
        return true;
    }
}
    
    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            showNotification(`
                <div class="notification-content">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h4>Message Sent!</h4>
                        <p>Thank you for your message, ${data.name}. We'll get back to you soon.</p>
                    </div>
                </div>
            `, 'success');
            
            this.reset();
        });
    }
    
    // ===== NEWSLETTER FORM =====
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    });
    
    // ===== FORM VALIDATION =====
    function validateReservationForm(data) {
        if (!data.name || !data.email || !data.phone || !data.date || !data.time || !data.guests) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        if (!phoneRegex.test(data.phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return false;
        }
        
        // Date validation
        const selectedDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Please select a future date', 'error');
            return false;
        }
        
        return true;
    }
    
    // ===== NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Set content
        if (typeof message === 'string') {
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">&times;</button>
            `;
        } else {
            notification.innerHTML = message;
            const closeBtn = document.createElement('button');
            closeBtn.className = 'notification-close';
            closeBtn.innerHTML = '&times;';
            notification.appendChild(closeBtn);
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        // Style content
        const content = notification.querySelector('.notification-content');
        if (content) {
            content.style.display = 'flex';
            content.style.alignItems = 'center';
            content.style.gap = '15px';
            content.style.flex = '1';
            
            const icon = content.querySelector('i');
            if (icon) {
                icon.style.fontSize = '20px';
            }
            
            const h4 = content.querySelector('h4');
            if (h4) {
                h4.style.margin = '0 0 5px 0';
                h4.style.fontSize = '16px';
            }
            
            const p = content.querySelector('p');
            if (p) {
                p.style.margin = '0';
                p.style.fontSize = '14px';
                p.style.opacity = '0.8';
            }
        }
        
        // Style close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                color: inherit;
                cursor: pointer;
                margin-left: 15px;
                line-height: 1;
                opacity: 0.7;
                transition: opacity 0.2s ease;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.opacity = '1';
            });
            
            closeBtn.addEventListener('mouseleave', () => {
                closeBtn.style.opacity = '0.7';
            });
            
            closeBtn.addEventListener('click', () => {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            });
        }
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // ===== GOOGLE MAPS INTEGRATION =====
    function initializeMap() {
        const mapContainer = document.getElementById('map');
        
        if (!mapContainer) return;
        
        // Replace with your actual coordinates
        const restaurantLocation = { lat: 11.5564, lng: 104.9282 };
        
        // Create a simple embedded map as fallback
        mapContainer.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2116.5687958303934!2d103.85991345042065!3d13.362442361072898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311017007938c67d%3A0x9a63c0c2258596fe!2sRiver%20Square%2024%20Restaurant!5e0!3m2!1skm!2skh!4v1765642521906!5m2!1skm!2skh" width="750" height="500" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
    }
    
    // Initialize map when page loads
    initializeMap();
    
    // ===== ANIMATIONS ON SCROLL =====
    const animateElements = document.querySelectorAll('.menu-item, .special-card, .drinks-category');
    
    function checkAnimation() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    }
    
    // Initial check
    checkAnimation();
    
    // Check on scroll
    window.addEventListener('scroll', checkAnimation);
    
    // ===== ACTIVE NAV LINK =====
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (currentPage === 'index.html' || currentPage === '') {
                if (link.getAttribute('href') === '#home' || link.getAttribute('href') === 'index.html') {
                    link.classList.add('active');
                }
            } else if (currentPage === 'menu.html' && link.getAttribute('href') === 'menu.html') {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ===== INITIALIZE ALL =====
    console.log('River Square 24 website initialized successfully');
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .menu-item, .special-card, .drinks-category {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .menu-item.animated, .special-card.animated, .drinks-category.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Stagger animation delays */
    .menu-item:nth-child(1) { transition-delay: 0.1s; }
    .menu-item:nth-child(2) { transition-delay: 0.2s; }
    .menu-item:nth-child(3) { transition-delay: 0.3s; }
    .menu-item:nth-child(4) { transition-delay: 0.4s; }
    .menu-item:nth-child(5) { transition-delay: 0.5s; }
    .menu-item:nth-child(6) { transition-delay: 0.6s; }
    .menu-item:nth-child(7) { transition-delay: 0.7s; }
    .menu-item:nth-child(8) { transition-delay: 0.8s; }
`;
document.head.appendChild(style);

// Simple Full Image Ad
document.addEventListener('DOMContentLoaded', function() {
    const adOverlay = document.getElementById('adOverlay');
    const imageAd = document.getElementById('imageAd');
    const closeImageAd = document.getElementById('closeImageAd');
    
    // Show ad after 1 second
    setTimeout(() => {
        adOverlay.classList.add('show');
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (adOverlay.classList.contains('show')) {
                closeImageAdFunc();
            }
        }, 4000);
    }, 1000);
    
    // Close ad on button click
    closeImageAd.addEventListener('click', closeImageAdFunc);
    
    // Close ad on overlay click (outside image)
    adOverlay.addEventListener('click', function(e) {
        if (e.target === adOverlay) {
            closeImageAdFunc();
        }
    });
    
    // Close ad on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && adOverlay.classList.contains('show')) {
            closeImageAdFunc();
        }
    });
    
    // Close function
    function closeImageAdFunc() {
        imageAd.style.animation = 'scaleOut 0.3s ease forwards';
        
        setTimeout(() => {
            adOverlay.classList.remove('show');
            imageAd.style.animation = '';
            
            // Remove after animation complete
            setTimeout(() => {
                adOverlay.remove();
            }, 300);
        }, 300);
    }
});
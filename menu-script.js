// Menu Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MENU FILTERING =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuSections = document.querySelectorAll('.menu-section');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get target section ID
            const targetId = this.getAttribute('href').substring(1);
            
            // Scroll to target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== MENU ITEM HOVER EFFECTS =====
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('animated')) return;
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ===== PRICE FORMATTING =====
    function formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(price);
    }
    
    // Update all prices on the page
    document.querySelectorAll('.price').forEach(priceElement => {
        const priceText = priceElement.textContent;
        const priceValue = parseFloat(priceText.replace('$', ''));
        
        if (!isNaN(priceValue)) {
            priceElement.textContent = formatPrice(priceValue);
        }
    });
    
    // ===== SPECIALS COUNTDOWN =====
    function updateSpecialsCountdown() {
        const specialCards = document.querySelectorAll('.special-card');
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        specialCards.forEach(card => {
            const badge = card.querySelector('.special-badge');
            if (badge && badge.textContent.includes('Today')) {
                const timeRemaining = tomorrow - now;
                const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
                
                badge.innerHTML = `Today Only - ${hours}h ${minutes}m left`;
            }
        });
    }
    
    // Update countdown every minute
    updateSpecialsCountdown();
    setInterval(updateSpecialsCountdown, 60000);
    
    // ===== DIETARY FILTERS =====
    const dietaryTags = document.querySelectorAll('.tag');
    
    dietaryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const filterType = this.classList[1]; // vegetarian, vegan, gluten-free, etc.
            
            // Highlight all items with this tag
            menuItems.forEach(item => {
                const itemTags = item.querySelectorAll('.tag');
                const hasTag = Array.from(itemTags).some(t => t.classList.contains(filterType));
                
                if (hasTag) {
                    item.style.backgroundColor = 'rgba(26, 92, 2, 0.05)';
                    item.style.borderColor = 'var(--primary-color)';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        item.style.backgroundColor = '';
                        item.style.borderColor = '';
                    }, 3000);
                }
            });
            
            // Scroll to first highlighted item
            const firstHighlighted = document.querySelector('.menu-item[style*="background-color"]');
            if (firstHighlighted) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = firstHighlighted.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== PRINT MENU FUNCTIONALITY =====
    const printButton = document.createElement('button');
    printButton.className = 'btn-secondary print-menu-btn';
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Menu';
    printButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        z-index: 998;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 24px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        font-weight: 600;
        cursor: pointer;
        box-shadow: var(--shadow);
        transition: var(--transition);
    `;
    
    printButton.addEventListener('mouseenter', () => {
        printButton.style.transform = 'translateY(-3px)';
        printButton.style.boxShadow = 'var(--shadow-hover)';
    });
    
    printButton.addEventListener('mouseleave', () => {
        printButton.style.transform = 'translateY(0)';
        printButton.style.boxShadow = 'var(--shadow)';
    });
    
    printButton.addEventListener('click', () => {
        // Create print-friendly version
        const printContent = document.createElement('div');
        printContent.innerHTML = `
            <div style="padding: 40px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #1a5c02; font-size: 36px; margin-bottom: 10px;">River Square 24</h1>
                    <p style="color: #666; font-size: 18px;">Complete Menu</p>
                    <p style="color: #999; font-size: 14px;">Printed on ${new Date().toLocaleDateString()}</p>
                </div>
                ${document.querySelector('.menu-container').outerHTML}
            </div>
        `;
        
        // Open print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>River Square 24 - Complete Menu</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #333; }
                        .menu-section { margin-bottom: 40px; page-break-inside: avoid; }
                        .menu-section-header { border-bottom: 2px solid #1a5c02; padding-bottom: 10px; margin-bottom: 20px; }
                        .menu-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed #ddd; }
                        .menu-item-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
                        .price { font-weight: bold; color: #1a5c02; }
                        .tags { margin-top: 10px; }
                        .tag { display: inline-block; padding: 2px 8px; margin-right: 5px; font-size: 11px; border-radius: 10px; }
                        @media print {
                            .print-menu-btn { display: none !important; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.innerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    });
    
    // Add print button to page
    document.body.appendChild(printButton);
    
    // ===== MENU SEARCH =====
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search menu items...';
    searchInput.className = 'menu-search';
    searchInput.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        z-index: 997;
        padding: 12px 20px;
        width: 300px;
        border: 2px solid var(--border-color);
        border-radius: var(--border-radius);
        font-family: var(--font-body);
        font-size: 15px;
        transition: var(--transition);
        box-shadow: var(--shadow);
    `;
    
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = 'var(--primary-color)';
        searchInput.style.boxShadow = 'var(--shadow-hover)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = 'var(--border-color)';
        searchInput.style.boxShadow = 'var(--shadow)';
    });
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            // Reset all items
            menuItems.forEach(item => {
                item.style.display = '';
                item.style.opacity = '1';
            });
            return;
        }
        
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDescription = item.querySelector('.description').textContent.toLowerCase();
            const itemTags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = itemName.includes(searchTerm) || 
                           itemDescription.includes(searchTerm) || 
                           itemTags.some(tag => tag.includes(searchTerm));
            
            if (matches) {
                item.style.display = '';
                item.style.opacity = '1';
                item.style.backgroundColor = 'rgba(26, 92, 2, 0.05)';
                item.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Add search input to page
    document.body.appendChild(searchInput);
    
    // ===== RESPONSIVE ADJUSTMENTS =====
    function adjustForMobile() {
        if (window.innerWidth < 768) {
            searchInput.style.width = 'calc(100% - 60px)';
            searchInput.style.left = '30px';
            searchInput.style.right = '30px';
            printButton.style.left = '30px';
            printButton.style.bottom = '90px';
        } else {
            searchInput.style.width = '300px';
            searchInput.style.left = '';
            printButton.style.left = '30px';
            printButton.style.bottom = '30px';
        }
    }
    
    adjustForMobile();
    window.addEventListener('resize', adjustForMobile);
    
    // ===== INITIALIZE ANIMATIONS =====
    const animatedElements = document.querySelectorAll('.menu-item, .special-card, .drinks-category');
    
    function checkAnimation() {
        animatedElements.forEach(element => {
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
    
    console.log('Menu page initialized successfully');
});
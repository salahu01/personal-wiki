// Wikipedia-themed Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initializeNavigation();
    initializeSmoothScrolling();
    initializeActiveSection();
    initializeSearchFunctionality();
    initializeTooltips();
    initializeTypingEffect();

    console.log('Portfolio loaded successfully!');
});

// Navigation functionality
function initializeNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('section[id]');

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Smooth scrolling for all internal links
function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Active section highlighting
function initializeActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.contents-list a, .tab');

    function updateActiveSection() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop &&
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Update navigation highlighting
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Throttled scroll event
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial check
    updateActiveSection();
}

// Search functionality (Wikipedia-style)
function initializeSearchFunctionality() {
    // Create search box
    const header = document.querySelector('.header-content');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="portfolio-search" placeholder="Search portfolio..." class="search-input">
        <div id="search-results" class="search-results"></div>
    `;

    header.appendChild(searchContainer);

    const searchInput = document.getElementById('portfolio-search');
    const searchResults = document.getElementById('search-results');

    // Search functionality
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = searchContent(query);
        displaySearchResults(results, query);
    });

    // Hide results when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function searchContent(query) {
    const results = [];
    const sections = document.querySelectorAll('section[id], .project-card, .skill-category');

    sections.forEach(section => {
        const text = section.textContent.toLowerCase();
        const title = section.querySelector('h2, h3, h4')?.textContent || 'Content';

        if (text.includes(query)) {
            results.push({
                title: title,
                element: section,
                id: section.id || section.closest('section[id]')?.id || 'content'
            });
        }
    });

    return results.slice(0, 5); // Limit to 5 results
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('search-results');

    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-item">No results found</div>';
    } else {
        searchResults.innerHTML = results.map(result => `
            <div class="search-item" onclick="scrollToElement('${result.id}')">
                <strong>${highlightText(result.title, query)}</strong>
            </div>
        `).join('');
    }

    searchResults.style.display = 'block';
}

function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    document.getElementById('search-results').style.display = 'none';
    document.getElementById('portfolio-search').value = '';
}

// Tooltips for technology tags
function initializeTooltips() {
    const techTags = document.querySelectorAll('.tech-tag');

    techTags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            const tooltip = createTooltip(this.textContent);
            this.appendChild(tooltip);
        });

        tag.addEventListener('mouseleave', function () {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

function createTooltip(technology) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';

    const descriptions = {
        'React': 'A JavaScript library for building user interfaces',
        'Node.js': 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        'MongoDB': 'Document-oriented NoSQL database',
        'Vue.js': 'Progressive JavaScript framework for building UIs',
        'Express': 'Fast, unopinionated web framework for Node.js',
        'Socket.io': 'Real-time bidirectional event-based communication',
        'Flutter': 'Google\'s UI toolkit for cross-platform development',
        'Firebase': 'Google\'s mobile and web application development platform',
        'Dart': 'Programming language optimized for building UIs',
        'React Native': 'Framework for building native apps using React',
        'Redux': 'Predictable state container for JavaScript apps',
        'TypeScript': 'Typed superset of JavaScript',
        'Python': 'High-level programming language',
        'Java': 'Object-oriented programming language'
    };

    tooltip.textContent = descriptions[technology] || `${technology} technology`;
    return tooltip;
}

// Typing effect for the main title
function initializeTypingEffect() {
    const title = document.querySelector('.article-title');
    if (!title) return;

    const originalText = title.textContent;
    title.textContent = '';

    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            title.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all project cards and skill categories
    document.querySelectorAll('.project-card, .skill-category').forEach(el => {
        observer.observe(el);
    });
}

// Theme toggle functionality (bonus feature)
function initializeThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.title = 'Toggle dark mode';

    document.querySelector('.header-content').appendChild(themeToggle);

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');
        this.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';

        // Save preference
        localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
    });

    // Load saved preference
    if (localStorage.getItem('darkTheme') === 'true') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️';
    }
}

// Back to top functionality
function initializeBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = 'Back to top';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function () {
    initializeAnimations();
    initializeThemeToggle();
    initializeBackToTop();
});

// External link handling
document.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && e.target.href && !e.target.href.startsWith('#')) {
        if (e.target.hostname !== window.location.hostname) {
            e.target.setAttribute('target', '_blank');
            e.target.setAttribute('rel', 'noopener noreferrer');
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', function (e) {
    // Press 'S' to focus search
    if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        const searchInput = document.getElementById('portfolio-search');
        if (searchInput && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    }

    // Press 'Escape' to close search results
    if (e.key === 'Escape') {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
});

// Print functionality
function printPortfolio() {
    window.print();
}

// Add print button
document.addEventListener('DOMContentLoaded', function () {
    const printButton = document.createElement('button');
    printButton.className = 'print-button';
    printButton.innerHTML = '🖨️';
    printButton.title = 'Print portfolio';
    printButton.onclick = printPortfolio;

    document.querySelector('.header-content').appendChild(printButton);
});



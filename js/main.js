
// Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else if (prefersDarkScheme) {
        document.body.classList.remove('light-theme');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.add('light-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Theme toggle with smooth transition
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Spatial Tooltip System
    const spatialTooltip = document.getElementById('spatialTooltip');
    const toolbarAnchors = document.querySelectorAll('.toolbar-item');
    let tooltipTimeout;
    let currentTooltipTarget = null;

    function showSpatialTooltip(element, text, mouseX, mouseY) {
        if (currentTooltipTarget === element) return;
        
        currentTooltipTarget = element;
        spatialTooltip.textContent = text;
        spatialTooltip.classList.add('visible');
        
        // Calculate optimal position with spatial awareness
        const rect = element.getBoundingClientRect();
        const tooltipRect = spatialTooltip.getBoundingClientRect();
        
        // Default position: below the element, centered
        let x = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let y = rect.bottom + 12;
        
        // Spatial adjustments based on viewport constraints
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 16;
        
        // Horizontal positioning with mouse influence
        const mouseInfluence = 0.3;
        const mouseDelta = mouseX - (rect.left + rect.width / 2);
        x += mouseDelta * mouseInfluence;
        
        // Boundary checks and adjustments
        if (x < margin) {
            x = margin;
        } else if (x + tooltipRect.width > viewportWidth - margin) {
            x = viewportWidth - tooltipRect.width - margin;
        }
        
        // Always position tooltip below the element with a fixed offset
        // This ensures consistent positioning that matches our CSS arrow
        y = rect.bottom + 12;
        
        // If too close to bottom, adjust only as much as necessary
        if (y + tooltipRect.height > viewportHeight - margin) {
            y = viewportHeight - tooltipRect.height - margin;
        }
        
        spatialTooltip.style.left = `${x}px`;
        spatialTooltip.style.top = `${y}px`;
    }

    function hideSpatialTooltip() {
        spatialTooltip.classList.remove('visible');
        currentTooltipTarget = null;
    }

    // Mobile Menu Functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

    function toggleMobileMenu() {
        const isActive = mobileMenuToggle.classList.contains('active');
        
        if (isActive) {
            // Close menu
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            // Open menu
            mobileMenuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Mobile menu item clicks
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all mobile items
            mobileMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Close mobile menu
            toggleMobileMenu();
            
            // Navigate to section
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = Math.max(0, elementPosition - headerOffset);
                
                setTimeout(() => {
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });

    // Enhanced smooth scrolling for navigation with spatial tooltips
    toolbarAnchors.forEach(anchor => {
        anchor.addEventListener('mouseenter', function(e) {
            clearTimeout(tooltipTimeout);
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                tooltipTimeout = setTimeout(() => {
                    showSpatialTooltip(this, tooltipText, e.clientX, e.clientY);
                }, 300);
            }
        });

        anchor.addEventListener('mousemove', function(e) {
            if (currentTooltipTarget === this) {
                const tooltipText = this.getAttribute('data-tooltip');
                showSpatialTooltip(this, tooltipText, e.clientX, e.clientY);
            }
        });

        anchor.addEventListener('mouseleave', function() {
            clearTimeout(tooltipTimeout);
            hideSpatialTooltip();
        });
        
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide tooltip on click
            hideSpatialTooltip();
            
            // Remove active class from all items
            toolbarAnchors.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = Math.max(0, elementPosition - headerOffset);
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hide tooltip when scrolling or clicking elsewhere
    window.addEventListener('scroll', hideSpatialTooltip);
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.floating-menu')) {
            hideSpatialTooltip();
        }
    });

    // Enhanced scroll animations with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '-50px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Animate timeline items sequentially
                if (entry.target.classList.contains('timeline-item')) {
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animationDelay = `${index * 0.2}s`;
                            item.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
                
                // Animate project cards
                if (entry.target.classList.contains('project-card')) {
                    const projectCards = document.querySelectorAll('.project-card');
                    projectCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animationDelay = `${index * 0.15}s`;
                            card.classList.add('fade-in-up');
                        }, index * 100);
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const sections = document.querySelectorAll('section');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const projectCards = document.querySelectorAll('.project-card');
    
    [...sections, ...timelineItems, ...projectCards].forEach(el => {
        observer.observe(el);
    });

    // Active toolbar item based on scroll position
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                updateActiveNavItem();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function updateActiveNavItem() {
        const scrollPosition = window.scrollY + 150;
        let activeSection = null;
        
        // Find the current section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = sectionId;
            }
        });
        
        // Handle edge case for the last section
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            const lastSection = sections[sections.length - 1];
            if (lastSection) {
                activeSection = lastSection.getAttribute('id');
            }
        }
        
        // Update active state for both desktop and mobile
        if (activeSection) {
            // Update desktop toolbar
            toolbarAnchors.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${activeSection}`) {
                    item.classList.add('active');
                }
            });
            
            // Update mobile menu
            mobileMenuItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${activeSection}`) {
                    item.classList.add('active');
                }
            });
        }
    }

    // Enhanced typing animation for job titles
    const jobTitlesList = [
        'Frontend Developer',
        'Web Developer', 
        'Web Designer',
        'System Automation Engineer',
        'RAG Engineer'
    ];
    
    const typedSpan = document.getElementById('job-title-typed');
    const cursorSpan = document.querySelector('.typed-cursor');
    
    let typingSpeed = 100;
    let erasingSpeed = 50;
    let newTitleDelay = 2000;
    let titleIndex = 0;
    let charIndex = 0;
    let isErasing = false;

    function typeEffect() {
        const currentTitle = jobTitlesList[titleIndex];
        
        if (!isErasing && charIndex < currentTitle.length) {
            // Typing
            typedSpan.textContent += currentTitle.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } else if (isErasing && charIndex > 0) {
            // Erasing
            typedSpan.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeEffect, erasingSpeed);
        } else {
            // Switch between typing and erasing
            isErasing = !isErasing;
            
            if (!isErasing) {
                titleIndex = (titleIndex + 1) % jobTitlesList.length;
                setTimeout(typeEffect, typingSpeed);
            } else {
                setTimeout(typeEffect, newTitleDelay);
            }
        }
    }

    if (typedSpan) {
        setTimeout(typeEffect, 1000);
    }

    // Enhanced word animation for About section
    function createWordAnimations() {
        const aboutParagraphs = document.querySelectorAll('.about-text p');
        
        aboutParagraphs.forEach(paragraph => {
            const text = paragraph.textContent;
            const words = text.split(' ');
            
            const wrappedContent = words.map(word => 
                `<span class="animated-word">${word}</span>`
            ).join(' ');
            
            paragraph.innerHTML = wrappedContent;
        });
        
        // Add enhanced hover effects
        const animatedWords = document.querySelectorAll('.animated-word');
        
        animatedWords.forEach(word => {
            word.addEventListener('mouseenter', () => {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(99, 102, 241, 0.2)';
                ripple.style.pointerEvents = 'none';
                ripple.style.animation = 'ripple 0.6s linear';
                
                word.style.position = 'relative';
                word.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Parallax effect for background elements
    function addParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            document.body.style.transform = `translateY(${rate}px)`;
        });
    }

    // Smooth reveal animations for skills
    function animateSkills() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-up');
        });
    }

    // Enhanced floating menu interactions with scroll behavior
    function enhanceFloatingMenu() {
        const floatingMenu = document.querySelector('.floating-menu');
        let lastScrollY = window.scrollY;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Clear existing timeout
            clearTimeout(scrollTimeout);

            // Add scrolled class when scrolling
            if (currentScrollY > 50) {
                floatingMenu.classList.add('scrolled');
            } else {
                floatingMenu.classList.remove('scrolled');
            }

            // Hide on fast scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                floatingMenu.style.transform = 'translateX(-50%) translateY(-20px)';
                floatingMenu.style.opacity = '0.7';
            } else {
                floatingMenu.style.transform = 'translateX(-50%) translateY(0)';
                floatingMenu.style.opacity = '1';
            }

            lastScrollY = currentScrollY;

            // Reset after scroll ends
            scrollTimeout = setTimeout(() => {
                floatingMenu.style.transform = 'translateX(-50%) translateY(0)';
                floatingMenu.style.opacity = '1';
            }, 150);
        });
    }

    // Add CSS animations for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize all enhancements
    createWordAnimations();
    enhanceFloatingMenu();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Performance optimization for scroll events
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavItem);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', () => {
        requestTick();
        ticking = false;
    });
});

// Handle website preview on timeline item hover
document.addEventListener('DOMContentLoaded', function() {
    // Get all timeline items with links
    const timelineItems = document.querySelectorAll('.timeline-item');
    const previewContainer = document.getElementById('websitePreviewContainer');
    const previewFrame = document.getElementById('websitePreviewFrame');
    const previewLoading = document.getElementById('websitePreviewLoading');
    
    let hoverTimer;
    let activeItem = null;
    
    // Add event listeners to timeline items
    timelineItems.forEach(item => {
        const link = item.querySelector('a');
        if (!link) return;
        
        const url = link.getAttribute('href');
        
        // Show preview on hover after a short delay
        item.addEventListener('mouseenter', function() {
            if (activeItem === item) return;
            
            hoverTimer = setTimeout(() => {
                // Show loading indicator
                previewLoading.style.display = 'block';
                previewFrame.style.opacity = '0';
                
                // Set the iframe src
                previewFrame.src = url;
                
                // Show the preview container
                previewContainer.classList.add('show');
                
                activeItem = item;
                
                // When iframe loads, hide loading indicator
                previewFrame.onload = function() {
                    previewLoading.style.display = 'none';
                    previewFrame.style.opacity = '1';
                };
            }, 500); // 500ms delay before showing preview
        });
        
        item.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimer);
            
            // If this was the active item, hide the preview after a delay
            if (activeItem === item) {
                setTimeout(() => {
                    if (activeItem === item) {
                        previewContainer.classList.remove('show');
                        activeItem = null;
                        
                        // Reset iframe src after animation completes
                        setTimeout(() => {
                            previewFrame.src = '';
                        }, 300);
                    }
                }, 300); // 300ms delay before hiding
            }
        });
    });
    
    // Hide preview when clicking outside
    previewContainer.addEventListener('click', function() {
        previewContainer.classList.remove('show');
        activeItem = null;
        
        // Reset iframe src after animation completes
        setTimeout(() => {
            previewFrame.src = '';
        }, 300);
    });
});

// Typing animation
let phrases = [
    "Something 3D is on its way",
    "A Redefined Look",
    "Simple and Catchy",
    "Stay Tuned!"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100; // Typing speed
let deletingDelay = 50; // Deleting speed
let newPhraseDelay = 2000; // Delay before typing a new phrase

function typeAnimation() {
    const typedElement = document.getElementById('typedPhrases');
    const currentPhrase = phrases[phraseIndex];
    
    if (!isDeleting && charIndex < currentPhrase.length) {
        // Typing
        typedElement.textContent += currentPhrase.charAt(charIndex);
        charIndex++;
        setTimeout(typeAnimation, typingDelay);
    } else if (isDeleting && charIndex > 0) {
        // Deleting
        typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        setTimeout(typeAnimation, deletingDelay);
    } else {
        // Switch between typing and deleting
        isDeleting = !isDeleting;
        
        if (!isDeleting) {
            // Move to next phrase when done deleting
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeAnimation, typingDelay);
        } else {
            // Pause before deleting
            setTimeout(typeAnimation, newPhraseDelay);
        }
    }
    
    // Trigger countdown after first phrase is fully typed
    if (phraseIndex === 0 && charIndex === currentPhrase.length && !isDeleting) {
        setTimeout(() => {
            // Show the countdown container
            document.getElementById('countdownContainer').classList.add('show');
            startCountdown();
        }, 500);
        
        // Show subtitle after countdown appears
        setTimeout(() => {
            document.getElementById('countdownSubtitle').classList.add('show');
        }, 1000);
        
        // Trigger resume button animation
        setTimeout(() => {
            document.getElementById('resumeButton').classList.add('show');
        }, 1500);
    }
}

// Countdown timer
function startCountdown() {
    // Make sure countdown container is visible
    const countdownContainer = document.getElementById('countdownContainer');
    if (countdownContainer) {
        countdownContainer.classList.add('show');
    }
    
    // Show loading bar container
    const loadingBarContainer = document.getElementById('loadingBarContainer');
    if (loadingBarContainer) {
        loadingBarContainer.classList.add('show');
    }
    
    // Get loading bar elements
    const loadingBarProgress = document.getElementById('loadingBarProgress');
    const loadingPercentage = document.getElementById('loadingPercentage');

    // Set fixed target date (100 days from June 9, 2025)
    const targetDate = new Date('2025-09-17T13:28:31-05:00'); // 100 days from current time
    
    // Calculate total time period for loading bar (100 days in milliseconds)
    const totalTime = 100 * 24 * 60 * 60 * 1000; // 100 days in milliseconds
    const startDate = new Date('2025-06-09T13:28:31-05:00'); // Starting date
    
    // Get DOM elements
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    function updateCountdown() {
        // Get current time
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;

        if (distance < 0) {
            // Countdown finished
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        // Calculate time units
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const msInDay = msInHour * 24;
        
        // Calculate each time unit precisely
        const days = Math.floor(distance / msInDay);
        const hours = Math.floor((distance % msInDay) / msInHour);
        const minutes = Math.floor((distance % msInHour) / msInMinute);
        const seconds = Math.floor((distance % msInMinute) / msInSecond);

        // Update the display with leading zeros for proper formatting
        daysEl.textContent = days.toString().padStart(2, '0');
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Calculate loading bar progress percentage
        const timeElapsed = now - startDate.getTime();
        const percentComplete = Math.min(Math.floor((timeElapsed / totalTime) * 100), 100);
        
        // Update loading bar width and percentage text
        if (loadingBarProgress && loadingPercentage) {
            loadingBarProgress.style.width = percentComplete + '%';
            loadingPercentage.textContent = percentComplete + '%';
        }
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        typeAnimation();
    }, 500);
});

// Add some interactive effects
document.addEventListener('mousemove', (e) => {
    const chars = document.querySelectorAll('.staggered-text .char');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    chars.forEach((char, index) => {
        const delay = index * 50;
        setTimeout(() => {
            const xOffset = (mouseX - 0.5) * 20;
            const yOffset = (mouseY - 0.5) * 20;
            char.style.transform = `translateY(0) translateX(${xOffset * 0.1}px)`;
        }, delay);
    });
});
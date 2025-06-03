
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

    // Enhanced smooth scrolling for navigation
    const toolbarAnchors = document.querySelectorAll('.toolbar-item');
    
    toolbarAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
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
        
        // Update active state
        if (activeSection) {
            toolbarAnchors.forEach(item => {
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
        'System Auto',
        'UI/UX Designer',
        'Full Stack Developer'
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

    // Enhanced floating menu interactions
    function enhanceFloatingMenu() {
        const floatingMenu = document.querySelector('.floating-menu');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                floatingMenu.style.transform = 'translateX(-50%) translateY(100px)';
            } else {
                // Scrolling up
                floatingMenu.style.transform = 'translateX(-50%) translateY(0)';
            }
            
            lastScrollY = currentScrollY;
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

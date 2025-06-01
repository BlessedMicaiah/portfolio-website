// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme based on saved preference or device preference
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
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        // Update icon based on current theme
        if (document.body.classList.contains('light-theme')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Smooth scrolling for toolbar links
    const toolbarAnchors = document.querySelectorAll('.toolbar-item');
    
    toolbarAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Scroll-triggered animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add active class to toolbar items based on scroll position
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelector(`.toolbar-item[href="#${sectionId}"]`)?.classList.add('active');
            } else {
                document.querySelector(`.toolbar-item[href="#${sectionId}"]`)?.classList.remove('active');
            }
        });
    });

    // Job Title Typing Animation
    const jobTitlesList = [
        'Frontend Developer',
        'Web Developer',
        'Web Designer',
        'System Auto'
    ];
    const typedSpan = document.getElementById('job-title-typed');
    const cursorSpan = document.querySelector('.typed-cursor');
    let typingDelay = 80;
    let erasingDelay = 50;
    let newTitleDelay = 1200; // Delay before typing next job title
    let titleIndex = 0;
    let charIndex = 0;
    function typeJobTitle() {
        if (charIndex < jobTitlesList[titleIndex].length) {
            typedSpan.textContent += jobTitlesList[titleIndex].charAt(charIndex);
            charIndex++;
            setTimeout(typeJobTitle, typingDelay);
        } else {
            setTimeout(eraseJobTitle, newTitleDelay);
        }
    }
    function eraseJobTitle() {
        if (charIndex > 0) {
            typedSpan.textContent = jobTitlesList[titleIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(eraseJobTitle, erasingDelay);
        } else {
            titleIndex = (titleIndex + 1) % jobTitlesList.length;
            setTimeout(typeJobTitle, typingDelay + 200);
        }
    }
    if (typedSpan) {
        setTimeout(typeJobTitle, 800);
    }

    // Word animation for About section
    function wrapWordsInSpans() {
        const aboutParagraphs = document.querySelectorAll('.about-text p');
        
        aboutParagraphs.forEach(paragraph => {
            const text = paragraph.textContent;
            const words = text.split(' ');
            
            // Create spans for each word
            const wrappedContent = words.map(word => 
                `<span class="animated-word">${word}</span>`
            ).join(' ');
            
            // Replace paragraph content with wrapped words
            paragraph.innerHTML = wrappedContent;
        });
        
        // Add hover effect to individual words
        const animatedWords = document.querySelectorAll('.animated-word');
        
        animatedWords.forEach(word => {
            word.addEventListener('mouseover', () => {
                word.style.opacity = '1';
                word.style.transform = 'translateY(-2px)';
                word.style.color = 'var(--gold-medium)';
            });
            
            word.addEventListener('mouseout', () => {
                word.style.opacity = '';
                word.style.transform = '';
                word.style.color = '';
            });
        });
    }

    // Initialize word animation
    wrapWordsInSpans();
});

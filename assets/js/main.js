// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    body.appendChild(overlay);

    function toggleMobileMenu() {
        navLinks.classList.toggle('mobile-active');
        setTimeout(() => {
            navLinks.classList.toggle('show');
            overlay.classList.toggle('show');
        }, 50);
        body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            toggleMobileMenu();
        }
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-active')) {
                    toggleMobileMenu();
                }
                
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;

            // Simple email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Thank you for subscribing!', 'success');
            emailInput.value = '';
        });
    }

    // Lazy Loading Images
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.region-card, .landmark-category, .experience-card, .advisor-card');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Video Slider Functionality
    const slides = document.querySelectorAll('.hero-slide');
    const videos = [
        document.getElementById('hero-video-1'),
        document.getElementById('hero-video-2')
    ];
    let currentSlide = 0;
    let isTransitioning = false;
    const slideDuration = 5000; // 5 seconds per slide

    console.log('Initializing video slider...');

    // Initialize videos
    videos.forEach((video, index) => {
        if (video) {
            video.addEventListener('loadedmetadata', function() {
                console.log(`Video ${index + 1} loaded`);
                video.currentTime = 0;
                if (index === 0) {
                    console.log('Starting first video');
                    video.play();
                }
            });

            video.addEventListener('timeupdate', function() {
                if (video.currentTime >= 5 && !isTransitioning) {
                    console.log(`Video ${index + 1} reached 5 seconds`);
                    nextSlide();
                }
            });

            video.addEventListener('error', function(error) {
                console.error(`Error with video ${index + 1}:`, error);
            });
        }
    });

    // Function to transition to next slide
    function nextSlide() {
        if (isTransitioning) {
            console.log('Transition already in progress');
            return;
        }
        isTransitioning = true;
        console.log(`Transitioning from slide ${currentSlide + 1}`);

        const nextIndex = (currentSlide + 1) % slides.length;
        console.log(`Transitioning to slide ${nextIndex + 1}`);
        
        // Fade out current slide
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].classList.add('fade-out');
        
        // Stop current video
        videos[currentSlide].pause();
        videos[currentSlide].currentTime = 0;
        
        // Fade in next slide
        slides[nextIndex].classList.add('active');
        slides[nextIndex].classList.remove('fade-out');
        
        // Play next video
        videos[nextIndex].currentTime = 0;
        videos[nextIndex].play().then(() => {
            console.log(`Video ${nextIndex + 1} started playing`);
            currentSlide = nextIndex;
            isTransitioning = false;
        }).catch(error => {
            console.error('Error playing video:', error);
            isTransitioning = false;
        });
    }

    // Start the carousel after first video is loaded
    videos[0].addEventListener('play', function() {
        console.log('First video started playing, setting up transition');
    });

    // Utility Functions
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    const video1 = document.getElementById('hero-video-1');
    const video2 = document.getElementById('hero-video-2');
    const slide1 = document.getElementById('slide-1');
    const slide2 = document.getElementById('slide-2');

    if (video1 && video2 && slide1 && slide2) {
        video1.addEventListener('ended', function () {
            slide1.style.display = 'none';
            slide2.style.display = 'block';
            video2.play();
        });
    }
}); 
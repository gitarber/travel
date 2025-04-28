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

    // Video Slider Functionality for 3 looping videos
    const video1 = document.getElementById('hero-video-1');
    const video2 = document.getElementById('hero-video-2');
    const video3 = document.getElementById('hero-video-3');
    const slide1 = document.getElementById('slide-1');
    const slide2 = document.getElementById('slide-2');
    const slide3 = document.getElementById('slide-3');

    // Preload all videos
    video1.load();
    video2.load();
    video3.load();

    // Helper to instantly show one slide and hide the others
    function showSlide(slideToShow, ...slidesToHide) {
        slideToShow.style.display = 'block';
        slidesToHide.forEach(slide => slide.style.display = 'none');
    }

    // When video1 ends, show video2 instantly
    video1.addEventListener('ended', function () {
        showSlide(slide2, slide1, slide3);
        video2.currentTime = 0;
        video2.play();
    });

    // When video2 ends, show video3 instantly
    video2.addEventListener('ended', function () {
        showSlide(slide3, slide1, slide2);
        video3.currentTime = 0;
        video3.play();
    });

    // When video3 ends, show video1 instantly (loop)
    video3.addEventListener('ended', function () {
        showSlide(slide1, slide2, slide3);
        video1.currentTime = 0;
        video1.play();
    });

    // Start with video1
    showSlide(slide1, slide2, slide3);
    video1.currentTime = 0;
    video1.play();

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
}); 
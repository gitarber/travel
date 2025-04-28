document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const videos = document.querySelectorAll('.hero-video');
    let currentSlide = 0;
    
    // Function to handle video playback
    function handleVideoPlayback() {
        videos.forEach((video, index) => {
            if (index === currentSlide) {
                video.currentTime = 0;
                video.play();
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide
        slides[currentSlide].classList.add('active');
        
        // Handle video playback
        handleVideoPlayback();
    }
    
    // Initialize first video
    handleVideoPlayback();
    
    // Change slide every 4 seconds
    setInterval(nextSlide, 4000);
}); 
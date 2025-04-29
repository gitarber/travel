document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.hero-slide');
    const videos = document.querySelectorAll('video');
    let currentSlide = 0;
    
    // Preload all videos
    function preloadVideos() {
        videos.forEach(video => {
            video.load();
            video.addEventListener('loadeddata', () => {
                console.log(`Video ${video.id} loaded successfully`);
            });
            video.addEventListener('error', (e) => {
                console.error(`Error loading video ${video.id}:`, e);
            });
        });
    }

    // Function to handle video playback
    function handleVideoPlayback() {
        videos.forEach((video, index) => {
            if (index === currentSlide) {
                video.currentTime = 0;
                video.play().catch(error => {
                    console.error(`Error playing video ${video.id}:`, error);
                });
            } else {
                video.pause();
                video.currentTime = 0;
            }
        });
    }
    
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');
        slides[currentSlide].style.display = 'none';
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Add active class to new slide and show it
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.display = 'block';
        
        // Handle video playback
        handleVideoPlayback();
    }
    
    // Initialize
    preloadVideos();
    handleVideoPlayback();
    
    // Change slide every 5 seconds (increased from 4 to 5 for smoother transitions)
    setInterval(nextSlide, 5000);
}); 
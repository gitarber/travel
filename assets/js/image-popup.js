class ImagePopup {
    constructor() {
        this.popup = document.getElementById('imagePopup');
        this.currentIndex = 0;
        this.images = [];
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close popup
        document.querySelector('.close-popup').addEventListener('click', () => this.closePopup());
        
        // Navigation buttons
        document.querySelector('.prev-btn').addEventListener('click', () => this.navigate(-1));
        document.querySelector('.next-btn').addEventListener('click', () => this.navigate(1));
        
        // Setup view gallery button clicks instead of entire card
        document.querySelectorAll('.view-gallery').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                const card = button.closest('.attraction-card');
                this.openPopup(card);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.popup.style.display !== 'block') return;
            
            if (e.key === 'Escape') this.closePopup();
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    }

    openPopup(card) {
        try {
            this.images = JSON.parse(card.dataset.gallery);
            this.currentIndex = 0;
            this.updatePopup();
            this.popup.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.createThumbnails();
        } catch (e) {
            console.error('Error opening popup:', e);
        }
    }

    closePopup() {
        this.popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    navigate(direction) {
        this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        this.updatePopup();
    }

    updatePopup() {
        const image = this.images[this.currentIndex];
        const popupImage = this.popup.querySelector('.popup-image');
        const popupTitle = this.popup.querySelector('.popup-header h3');
        
        popupImage.src = image.url;
        popupTitle.textContent = image.caption;
        
        // Update thumbnails
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === this.currentIndex);
        });
    }

    createThumbnails() {
        const thumbnailsContainer = this.popup.querySelector('.popup-thumbnails');
        thumbnailsContainer.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const thumb = document.createElement('img');
            thumb.src = image.url;
            thumb.classList.add('thumbnail');
            if (index === this.currentIndex) thumb.classList.add('active');
            thumb.addEventListener('click', () => {
                this.currentIndex = index;
                this.updatePopup();
            });
            thumbnailsContainer.appendChild(thumb);
        });
    }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', () => {
    new ImagePopup();
}); 
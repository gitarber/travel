document.addEventListener('DOMContentLoaded', function() {
    const galleryStack = document.querySelector('.gallery-stack');
    const stackItems = document.querySelectorAll('.stack-item');
    
    // Store rotation and translation values for each card
    const cardStates = [
        { rotation: -5, translate: 0 },
        { rotation: 8, translate: 20 },
        { rotation: -12, translate: 40 },
        { rotation: 15, translate: 60 },
        { rotation: -8, translate: 80 },
        { rotation: 5, translate: 100 }
    ];
    
    // Possible exit directions
    const exitDirections = [
        { x: '100%', y: '-100%', rotation: 45 },  // Top-right
        { x: '-100%', y: '-100%', rotation: -45 }, // Top-left
        { x: '100%', y: '100%', rotation: 45 },   // Bottom-right
        { x: '-100%', y: '100%', rotation: -45 },  // Bottom-left
        { x: '100%', y: '0', rotation: 90 },      // Right
        { x: '-100%', y: '0', rotation: -90 }     // Left
    ];
    
    // Initialize the stack
    function initializeStack() {
        stackItems.forEach((item, index) => {
            const state = cardStates[index];
            item.style.setProperty('--current-rotation', `${state.rotation}deg`);
            item.style.setProperty('--current-translate', `${state.translate}px`);
            item.style.setProperty('--next-rotation', `${state.rotation}deg`);
            item.style.setProperty('--next-translate', `${state.translate}px`);
        });
    }
    
    // Get random exit direction
    function getRandomExitDirection() {
        return exitDirections[Math.floor(Math.random() * exitDirections.length)];
    }
    
    // Handle card interaction
    function handleCardInteraction(card) {
        // Only allow interaction with the top card
        if (card.style.zIndex !== '6') return;
        
        // Prevent multiple rapid interactions
        if (card.classList.contains('slide-out') || card.classList.contains('slide-in')) {
            return;
        }

        const currentIndex = Array.from(stackItems).indexOf(card);
        const nextIndex = (currentIndex + 1) % stackItems.length;
        
        // Get random exit direction
        const exitDir = getRandomExitDirection();
        
        // Set current and next states
        card.style.setProperty('--current-rotation', `${cardStates[currentIndex].rotation}deg`);
        card.style.setProperty('--current-translate', `${cardStates[currentIndex].translate}px`);
        card.style.setProperty('--exit-rotation', `${exitDir.rotation}deg`);
        card.style.setProperty('--exit-x', exitDir.x);
        card.style.setProperty('--exit-y', exitDir.y);
        
        const nextCard = stackItems[nextIndex];
        nextCard.style.setProperty('--next-rotation', `${cardStates[nextIndex].rotation}deg`);
        nextCard.style.setProperty('--next-translate', `${cardStates[nextIndex].translate}px`);
        nextCard.style.setProperty('--exit-x', exitDir.x);
        nextCard.style.setProperty('--exit-y', exitDir.y);
        
        // Add animation classes
        card.classList.add('slide-out');
        nextCard.classList.add('slide-in');
        
        // Update z-index
        stackItems.forEach((item, index) => {
            item.style.zIndex = (stackItems.length - index) % stackItems.length;
        });
        
        // Reset classes after animation
        setTimeout(() => {
            card.classList.remove('slide-out');
            nextCard.classList.remove('slide-in');
            
            // Move the tapped card to the bottom of the stack
            galleryStack.appendChild(card);
            
            // Reset transform for the moved card
            setTimeout(() => {
                const newIndex = Array.from(stackItems).indexOf(card);
                const state = cardStates[newIndex];
                card.style.setProperty('--current-rotation', `${state.rotation}deg`);
                card.style.setProperty('--current-translate', `${state.translate}px`);
                card.style.setProperty('--next-rotation', `${state.rotation}deg`);
                card.style.setProperty('--next-translate', `${state.translate}px`);
            }, 50);
        }, 800);
    }
    
    // Add event listeners for both desktop and mobile
    stackItems.forEach(card => {
        // Click event for desktop
        card.addEventListener('click', (e) => {
            e.preventDefault();
            handleCardInteraction(card);
        });
        
        // Touch events for mobile
        card.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleCardInteraction(card);
        });
    });
    
    // Initialize the gallery
    initializeStack();
}); 
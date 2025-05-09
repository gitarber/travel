document.addEventListener('DOMContentLoaded', function() {
    const galleryStack = document.querySelector('.gallery-stack');
    const stackItems = Array.from(document.querySelectorAll('.stack-item'));
    const touchIndicator = document.querySelector('.touch-indicator');
    const touchText = document.querySelector('.touch-text');
    let isAnimating = false;
    let interactionOccurred = false;
    
    // Card positions and rotations
    const cardStates = [
        { rotation: -5, translate: 0, zIndex: 6 },
        { rotation: 8, translate: 20, zIndex: 5 },
        { rotation: -12, translate: 40, zIndex: 4 },
        { rotation: 15, translate: 60, zIndex: 3 },
        { rotation: -8, translate: 80, zIndex: 2 },
        { rotation: 5, translate: 100, zIndex: 1 }
    ];
    
    // Possible exit directions - more extreme values with focus on sliding
    const exitDirections = [
        { x: '200%', y: '-100%', rotation: 30 },   // Right-up
        { x: '-200%', y: '-100%', rotation: -30 }, // Left-up
        { x: '200%', y: '100%', rotation: 30 },    // Right-down
        { x: '-200%', y: '100%', rotation: -30 },  // Left-down
        { x: '300%', y: '30%', rotation: 20 },     // Far right
        { x: '-300%', y: '30%', rotation: -20 },   // Far left
        { x: '50%', y: '-250%', rotation: 10 },    // Mostly up
        { x: '50%', y: '250%', rotation: -10 }     // Mostly down
    ];
    
    // Initialize the stack
    function initializeStack() {
        stackItems.forEach((item, index) => {
            const state = cardStates[index];
            
            // Apply styles without scale changes
            item.style.transform = `rotate(${state.rotation}deg) translateY(${state.translate}px) translateZ(0)`;
            item.style.zIndex = state.zIndex;
            item.style.willChange = "transform";
            
            // Also set the CSS variables for animations
            item.style.setProperty('--current-rotation', `${state.rotation}deg`);
            item.style.setProperty('--current-translate', `${state.translate}px`);
        });
        
        // Make only the top card interactive
        updateInteractivity();
        
        // Show touch indicator and text after a short delay
        setTimeout(showTouchElements, 1000);
    }
    
    // Show touch indicator and text
    function showTouchElements() {
        if (!interactionOccurred) {
            touchIndicator.style.opacity = "1";
            touchText.style.opacity = "1";
        }
    }
    
    // Hide touch indicator and text
    function hideTouchElements() {
        touchIndicator.style.opacity = "0";
        touchText.style.opacity = "0";
    }
    
    // Update which card is interactive
    function updateInteractivity() {
        stackItems.forEach((item, index) => {
            if (index === 0) {
                item.style.pointerEvents = 'auto';
                item.style.cursor = 'pointer';
            } else {
                item.style.pointerEvents = 'none';
            }
        });
    }
    
    // Get random exit direction
    function getRandomExitDirection() {
        return exitDirections[Math.floor(Math.random() * exitDirections.length)];
    }
    
    // Handle card interaction
    function handleCardInteraction(e) {
        // Prevent default behavior
        e.preventDefault();
        
        // If animation is in progress, don't allow another interaction
        if (isAnimating) return;
        
        // Mark that user has interacted with the gallery
        interactionOccurred = true;
        
        // Hide touch indicator and text
        hideTouchElements();
        
        // Get the card that was clicked/tapped
        const card = e.currentTarget;
        
        // Double check we're only interacting with the top card
        if (stackItems.indexOf(card) !== 0) return;
        
        // Set flag to prevent multiple animations
        isAnimating = true;
        
        // Get random exit direction
        const exitDir = getRandomExitDirection();
        
        // Set exit properties
        card.style.setProperty('--exit-rotation', exitDir.rotation);
        card.style.setProperty('--exit-x', exitDir.x);
        card.style.setProperty('--exit-y', exitDir.y);
        
        // Add exit animation class
        card.classList.add('slide-out');
        
        // Move card to bottom of stack after animation
        setTimeout(() => {
            // Remove animation class
            card.classList.remove('slide-out');
            
            // Move card to bottom of stack
            galleryStack.appendChild(card);
            
            // Update stackItems array after DOM change
            updateStackArray();
            
            // Apply new positions and z-indexes based on updated array
            stackItems.forEach((item, index) => {
                const state = cardStates[index];
                
                // Apply styles without scale changes
                item.style.transform = `rotate(${state.rotation}deg) translateY(${state.translate}px) translateZ(0)`;
                item.style.zIndex = state.zIndex;
                
                // Update CSS variables
                item.style.setProperty('--current-rotation', `${state.rotation}deg`);
                item.style.setProperty('--current-translate', `${state.translate}px`);
            });
            
            // Update which card is interactive
            updateInteractivity();
            
            // Allow new interactions
            isAnimating = false;
            
            // Show touch elements briefly after each interaction (after a delay)
            if (!isAnimating) {
                setTimeout(showTouchElements, 2000);
                
                // Hide them again after a few seconds
                setTimeout(hideTouchElements, 5000);
            }
        }, 450); // Match the CSS animation duration
    }
    
    // Update the stack array after DOM changes
    function updateStackArray() {
        stackItems.length = 0;
        document.querySelectorAll('.stack-item').forEach(item => {
            stackItems.push(item);
        });
    }
    
    // Add event listeners
    function addEventListeners() {
        stackItems.forEach(card => {
            // Remove any existing listeners to avoid duplicates
            card.removeEventListener('click', handleCardInteraction);
            card.removeEventListener('touchstart', handleCardInteraction);
            
            // Add fresh listeners
            card.addEventListener('click', handleCardInteraction);
            card.addEventListener('touchstart', handleCardInteraction);
        });
    }
    
    // Initialize
    initializeStack();
    addEventListeners();
}); 
// Smooth scroll function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Update card animation logic
const cards = document.querySelectorAll('.card');
const projectSection = document.querySelector('#projects');
const contactContent = document.querySelector('.contact-content');
const contactBox = document.querySelector('.contact-box');

function generatePlaceholderText() {
    let text = '';
    // Create more paragraphs for better scroll testing
    for(let i = 0; i < 30; i++) {
        text += `
            <div style="margin-bottom: 2rem;">
                <h2>Section ${i + 1}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        `;
    }
    return text;
}

// Handle card clicks
cards.forEach(card => {
    // Add placeholder text
    const content = card.querySelector('.card-content');
    content.innerHTML = generatePlaceholderText();

    card.addEventListener('click', (e) => {
        // Don't expand if clicking close button or if card is animating
        if (e.target.classList.contains('close-button') || 
            !card.style.opacity || 
            card.style.opacity === '0') {
            return;
        }
        
        // Reset any inline styles that might interfere with full-screen
        card.style.right = '';
        card.style.top = '';
        card.style.transform = '';
        
        card.classList.add('expanded');
        document.body.classList.add('card-expanded');
    });

    const closeButton = card.querySelector('.close-button');
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('expanded');
        document.body.classList.remove('card-expanded');
        
        // Re-trigger card positioning after closing
        requestAnimationFrame(() => {
            updateCardPositions();
        });
    });
});

// Modify updateCardPositions to ignore expanded cards
function updateCardPositions() {
    const projectRect = projectSection.getBoundingClientRect();
    const projectStart = projectRect.top;
    const projectHeight = projectRect.height;
    
    // Only animate cards when project section is in view
    if (projectStart > window.innerHeight || projectStart < -projectHeight) {
        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.right = '-350px';
        });
        return;
    }

    // Calculate progress through project section (0 to 1)
    const scrollProgress = -projectStart / (projectHeight - window.innerHeight);

    cards.forEach((card, index) => {
        if (card.classList.contains('expanded')) {
            return;
        }
        
        // Calculate when each card should animate
        const cardProgress = (scrollProgress - (index * 0.15)) * 2;
        
        if (cardProgress >= 0 && cardProgress <= 1) {
            // Card is in active animation phase
            const moveX = -350 + (window.innerWidth * cardProgress); // Move from right to left
            
            // Calculate scale based on position
            // Maximum scale (2.5) at center of screen, original scale (1.0) at edges
            const distanceFromCenter = Math.abs((window.innerWidth / 2) - moveX) / (window.innerWidth / 2);
            const scale = 2.5 - (1.5 * distanceFromCenter);
            
            card.style.opacity = 1;
            card.style.right = `${moveX}px`;
            card.style.top = '50%';
            card.style.transform = `translateY(-50%) scale(${scale})`;
        } else if (cardProgress > 1) {
            // Card has completed animation
            card.style.opacity = 0;
            card.style.right = `${window.innerWidth + 350}px`;
            card.style.transform = `translateY(-50%) scale(1)`;
        } else {
            // Card hasn't started animating yet
            card.style.opacity = 0;
            card.style.right = '-350px';
            card.style.transform = `translateY(-50%) scale(1)`;
        }
    });

    // Animate contact section after last card
    const lastCardProgress = (scrollProgress - (cards.length * 0.15)) * 2;
    if (lastCardProgress > 1) {
        contactContent.classList.add('visible');
    } else {
        contactContent.classList.remove('visible');
    }
}

// Replace checkScroll with updateCardPositions
window.addEventListener('scroll', updateCardPositions);
// Initial position check
updateCardPositions(); 
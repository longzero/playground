const slider = document.getElementById('slider');
const dotsContainer = document.getElementById('dotsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slides = document.querySelectorAll('.slide');

/**
 * 1. Helper to get dynamic metrics
 * Returns the width of one slide step (slide + gap)
 */
function getSlideMetrics() {
    if (!slides.length) return { gap: 0, slideWidth: 0 };

    const style = window.getComputedStyle(slider);
    const gap = parseInt(style.gap) || 0;

    // We use the first slide to determine the base width
    // OffsetWidth includes padding and border but not margin/gap
    const slideWidth = slides[0].offsetWidth + gap;

    return { gap, slideWidth };
}

/**
 * 2. Initialize Navigation Dots
 * Automatically creates dots based on the number of slides
 */
function initDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);

        dot.addEventListener('click', () => {
            const { slideWidth } = getSlideMetrics();
            slider.scrollTo({
                left: index * slideWidth,
                behavior: 'smooth'
            });
        });
        dotsContainer.appendChild(dot);
    });
}

/**
 * 3. Update Active Dot on Scroll
 * Calculates which slide is most visible and updates dot state
 */
function updateActiveDot() {
    const { slideWidth } = getSlideMetrics();
    if (!slideWidth) return;

    const scrollLeft = slider.scrollLeft;

    // Calculate index based on which slide is most visible in the viewport
    // (scrollLeft + half width of a step to find the center)
    const activeIndex = Math.round(scrollLeft / slideWidth);

    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
    });
}

/**
 * 4. Arrow Navigation Logic
 * Moves the slider by exactly one slide width (plus gap)
 */
function scrollSteps(direction) {
    const { slideWidth } = getSlideMetrics();
    const currentScroll = slider.scrollLeft;

    // Calculate target scroll point
    // We additive/subtract slideWidth and round to nearest step to avoid drift
    let targetScroll;
    if (direction === 'next') {
        targetScroll = Math.floor((currentScroll + slideWidth + 10) / slideWidth) * slideWidth;
    } else {
        targetScroll = Math.ceil((currentScroll - slideWidth - 10) / slideWidth) * slideWidth;
    }

    slider.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
}

/**
 * Event Listeners & Initialization
 */

// Click events for arrows
if (prevBtn) prevBtn.addEventListener('click', () => scrollSteps('prev'));
if (nextBtn) nextBtn.addEventListener('click', () => scrollSteps('next'));

// Scroll event for updating dots
// We use a light debounce/timeout to avoid excessive updates but keep it feeling responsive
let isScrolling;
slider.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(updateActiveDot, 50);
}, { passive: true });

// Initial build
initDots();

// Re-init/Update on resize
// Important for responsive layouts where slide widths change
window.addEventListener('resize', () => {
    updateActiveDot();
});

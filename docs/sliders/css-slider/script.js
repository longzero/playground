/**
 * Multi-Slider Support
 * Initializes all sliders on the page independently
 */
class HorizonSlider {
    constructor(wrapperElement) {
        this.wrapper = wrapperElement;
        this.slider = wrapperElement.querySelector('.slider-container');
        this.dotsContainer = wrapperElement.querySelector('.nav-dots');
        this.prevBtn = wrapperElement.querySelector('.nav-arrow.prev');
        this.nextBtn = wrapperElement.querySelector('.nav-arrow.next');
        this.slides = this.slider.querySelectorAll('.slide');
        this.isScrolling = null;

        this.init();
    }

    /**
     * Get dynamic metrics for this slider
     */
    getSlideMetrics() {
        if (!this.slides.length) return { gap: 0, slideWidth: 0 };

        const style = window.getComputedStyle(this.slider);
        const gap = parseInt(style.gap) || 0;
        const slideWidth = this.slides[0].offsetWidth + gap;

        return { gap, slideWidth };
    }

    /**
     * Initialize navigation dots adaptively
     */
    initDots() {
        if (!this.dotsContainer || !this.slides.length) return;

        this.dotsContainer.innerHTML = '';
        const { slideWidth } = this.getSlideMetrics();
        const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

        // Calculate how many dots we actually need
        const numDots = Math.max(1, Math.ceil(maxScroll / slideWidth) + 1);

        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to section ${i + 1}`);

            dot.addEventListener('click', () => {
                const targetLeft = Math.min(i * slideWidth, maxScroll);
                this.slider.scrollTo({
                    left: targetLeft,
                    behavior: 'smooth'
                });
            });
            this.dotsContainer.appendChild(dot);
        }
    }

    /**
     * Update active dot based on scroll position
     */
    updateActiveDot() {
        const { slideWidth } = this.getSlideMetrics();
        if (!slideWidth || !this.dotsContainer) return;

        const scrollLeft = this.slider.scrollLeft;
        const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

        // Calculate active index
        let activeIndex;
        if (scrollLeft >= maxScroll - 10) {
            activeIndex = this.dotsContainer.children.length - 1;
        } else {
            activeIndex = Math.round(scrollLeft / slideWidth);
        }

        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }

    /**
     * Update arrow visibility and state based on scroll position
     */
    updateArrows() {
        if (!this.prevBtn || !this.nextBtn) return;

        const scrollLeft = this.slider.scrollLeft;
        const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

        // Add disabled class if content fits in viewport (nothing to scroll)
        if (maxScroll <= 1) {
            this.prevBtn.classList.add('disabled');
            this.nextBtn.classList.add('disabled');
            this.prevBtn.disabled = true;
            this.nextBtn.disabled = true;
            return;
        }

        // Remove disabled class if content is scrollable
        this.prevBtn.classList.remove('disabled');
        this.nextBtn.classList.remove('disabled');

        // Disable prev arrow at the start
        if (scrollLeft <= 1) {
            this.prevBtn.disabled = true;
            this.prevBtn.classList.add('disabled');
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.classList.remove('disabled');
        }

        // Disable next arrow at the end
        if (scrollLeft >= maxScroll - 1) {
            this.nextBtn.disabled = true;
            this.nextBtn.classList.add('disabled');
        } else {
            this.nextBtn.disabled = false;
            this.nextBtn.classList.remove('disabled');
        }
    }

    /**
     * Arrow navigation logic
     */
    scrollSteps(direction) {
        const { slideWidth } = this.getSlideMetrics();
        const currentScroll = this.slider.scrollLeft;

        let targetScroll;
        if (direction === 'next') {
            targetScroll = Math.floor((currentScroll + slideWidth + 10) / slideWidth) * slideWidth;
        } else {
            targetScroll = Math.ceil((currentScroll - slideWidth - 10) / slideWidth) * slideWidth;
        }

        this.slider.scrollTo({
            left: targetScroll,
            behavior: 'smooth'
        });
    }

    /**
     * Initialize event listeners
     */
    init() {
        // Arrow click events
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scrollSteps('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scrollSteps('next'));
        }

        // Scroll event for updating dots and arrows
        this.slider.addEventListener('scroll', () => {
            window.clearTimeout(this.isScrolling);
            this.isScrolling = setTimeout(() => {
                this.updateActiveDot();
                this.updateArrows();
            }, 50);
        }, { passive: true });

        // Initial build
        this.initDots();
        this.updateArrows();
    }

    /**
     * Refresh slider (useful for resize events)
     */
    refresh() {
        this.initDots();
        this.updateActiveDot();
        this.updateArrows();
    }
}

/**
 * Initialize all sliders on the page
 */
const sliders = [];
document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
    sliders.push(new HorizonSlider(wrapper));
});

/**
 * Handle window resize for all sliders
 */
window.addEventListener('resize', () => {
    sliders.forEach(slider => slider.refresh());
});

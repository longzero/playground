/**
 * HorizonSlider - Universal Premium Slider
 * Supports Vanilla JS and Magento (RequireJS) environments.
 * Features: Auto-injection of controls, options support, and smooth scroll syncing.
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Magento/RequireJS)
        define([], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else {
        // Browser Global
        root.HorizonSlider = factory();
    }
}(this, function () {
    'use strict';

    class HorizonSlider {
        /**
         * Default configuration
         */
        static get defaults() {
            return {
                arrows: true,
                dots: true,
                nextLabel: 'Next slide',
                prevLabel: 'Previous slide',
                activationClass: 'js-horizon-slider',
                // Flexible selectors (supports Horizon defaults and Magento 2 standards)
                sliderSelector: '.slider-container, .product-items',
                slideSelector: '.slide, .product-item'
            };
        }

        constructor(container, options = {}) {
            this.container = typeof container === 'string' ? document.querySelector(container) : container;
            if (!this.container) return;

            this.options = { ...HorizonSlider.defaults, ...options };
            
            // Core elements with smart detection
            this.slider = this.container.querySelector(this.options.sliderSelector);
            if (!this.slider) {
                console.warn('HorizonSlider: Content container not found inside', this.container);
                return;
            }

            this.slides = this.slider.querySelectorAll(this.options.slideSelector);
            this.isScrolling = null;

            // Navigation elements (find or create)
            this.prevBtn = null;
            this.nextBtn = null;
            this.dotsContainer = null;

            this._init();
        }

        /**
         * Initialize the slider
         */
        _init() {
            this._setupElements();
            this._setupEvents();
            
            // Initial render
            if (this.options.dots) this.initDots();
            this.updateArrows();
            this.updateActiveDot();
        }

        /**
         * Find or inject navigation elements
         */
        _setupElements() {
            // Setup Arrows
            if (this.options.arrows) {
                this.prevBtn = this.container.querySelector('.nav-arrow.prev');
                this.nextBtn = this.container.querySelector('.nav-arrow.next');

                if (!this.prevBtn || !this.nextBtn) {
                    this._injectArrows();
                }
            }

            // Setup Dots
            if (this.options.dots) {
                this.dotsContainer = this.container.querySelector('.nav-dots');
                if (!this.dotsContainer) {
                    this._injectDots();
                }
            }
        }

        /**
         * Inject arrow buttons into the container
         */
        _injectArrows() {
            const prev = document.createElement('button');
            prev.className = 'nav-arrow prev';
            prev.setAttribute('aria-label', this.options.prevLabel);

            const next = document.createElement('button');
            next.className = 'nav-arrow next';
            next.setAttribute('aria-label', this.options.nextLabel);

            this.container.appendChild(prev);
            this.container.appendChild(next);
            
            this.prevBtn = prev;
            this.nextBtn = next;
        }

        /**
         * Inject dots container into the container
         */
        _injectDots() {
            const dots = document.createElement('div');
            dots.className = 'nav-dots';
            this.container.appendChild(dots);
            this.dotsContainer = dots;
        }

        /**
         * Attach all event listeners
         */
        _setupEvents() {
            // Arrow clicks
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.scrollSteps('prev'));
            }
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.scrollSteps('next'));
            }

            // Scroll syncing
            this.slider.addEventListener('scroll', () => {
                window.clearTimeout(this.isScrolling);
                this.isScrolling = setTimeout(() => {
                    this.updateActiveDot();
                    this.updateArrows();
                }, 50);
            }, { passive: true });

            // Accessibility: allow keyboard nav
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.scrollSteps('prev');
                if (e.key === 'ArrowRight') this.scrollSteps('next');
            });
        }

        /**
         * Calculate metrics dynamically
         */
        getSlideMetrics() {
            if (!this.slides.length || !this.slider) return { gap: 0, slideWidth: 0 };

            const style = window.getComputedStyle(this.slider);
            const gap = parseInt(style.gap) || 0;
            const slideWidth = this.slides[0].offsetWidth + gap;

            return { gap, slideWidth };
        }

        /**
         * Build/Update dots based on current layout
         */
        initDots() {
            if (!this.options.dots || !this.dotsContainer || !this.slides.length) return;

            this.dotsContainer.innerHTML = '';
            const { slideWidth } = this.getSlideMetrics();
            const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

            if (maxScroll <= 0) return;

            const numDots = Math.max(1, Math.ceil(maxScroll / slideWidth) + 1);

            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to section ${i + 1}`);

                dot.addEventListener('click', () => {
                    const targetLeft = Math.min(i * slideWidth, maxScroll);
                    this.slider.scrollTo({ left: targetLeft, behavior: 'smooth' });
                });
                this.dotsContainer.appendChild(dot);
            }
        }

        /**
         * Sync active dot state
         */
        updateActiveDot() {
            const { slideWidth } = this.getSlideMetrics();
            if (!slideWidth || !this.dotsContainer || !this.options.dots) return;

            const scrollLeft = this.slider.scrollLeft;
            const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

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
         * Sync arrow visibility/disabled state
         */
        updateArrows() {
            if (!this.options.arrows || !this.prevBtn || !this.nextBtn) return;

            const scrollLeft = this.slider.scrollLeft;
            const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

            if (maxScroll <= 1) {
                this.prevBtn.classList.add('disabled');
                this.nextBtn.classList.add('disabled');
                this.prevBtn.disabled = true;
                this.nextBtn.disabled = true;
                return;
            }

            this.prevBtn.disabled = scrollLeft <= 1;
            this.prevBtn.classList.toggle('disabled', this.prevBtn.disabled);

            this.nextBtn.disabled = scrollLeft >= maxScroll - 1;
            this.nextBtn.classList.toggle('disabled', this.nextBtn.disabled);
        }

        /**
         * Handle stepping between slides
         */
        scrollSteps(direction) {
            const { slideWidth } = this.getSlideMetrics();
            const currentScroll = this.slider.scrollLeft;
            const maxScroll = this.slider.scrollWidth - this.slider.clientWidth;

            let targetScroll;
            if (direction === 'next') {
                targetScroll = Math.floor((currentScroll + slideWidth + 10) / slideWidth) * slideWidth;
            } else {
                targetScroll = Math.ceil((currentScroll - slideWidth - 10) / slideWidth) * slideWidth;
            }

            this.slider.scrollTo({
                left: Math.max(0, Math.min(targetScroll, maxScroll)),
                behavior: 'smooth'
            });
        }

        /**
         * Re-initialize logic (useful for resize)
         */
        refresh() {
            if (this.options.dots) this.initDots();
            this.updateActiveDot();
            this.updateArrows();
        }

        /**
         * Static helper to initialize all sliders by selector
         */
        static initAll(selector = '.js-horizon-slider', options = {}) {
            const elements = document.querySelectorAll(selector);
            const instances = [];
            
            elements.forEach(el => {
                instances.push(new HorizonSlider(el, options));
            });

            // Global resize handler
            if (instances.length > 0) {
                window.addEventListener('resize', () => {
                    instances.forEach(ins => ins.refresh());
                });
            }

            return instances;
        }
    }

    return HorizonSlider;
}));

# Lumina Slider | Premium JS-Enhanced Navigation

A high-performance, premium slider built with **CSS Scroll-Snap** and enhanced with **JavaScript** for intelligent navigation. This project combines native browser performance with custom UI features like adaptive dots and smart arrows.

---

## 🚀 Quick Start

1.  Open `index.html` in your browser.
2.  Use the mouse wheel, swipe, arrows, or dots to navigate.

---

## 🛠 Customization Guide

### 1. Changing the Number of Slides
The slider is designed to be dynamic. To add or remove slides:
- Open `index.html`.
- Locate the `<div class="slider-container" id="slider">` section.
- Add or remove `<article class="slide">` blocks.
- **Note:** The JavaScript will automatically detect the new slide count and recalculate the navigation dots.

```html
<!-- Example of a single slide structure -->
<article class="slide" tabindex="0">
  <img src="your-image.jpg" alt="Description">
  <div class="slide-content">
    <span class="location">Location Name</span>
    <h3>Slide Title</h3>
    <p>Subtitle or Price</p>
    <a href="#" class="btn-primary">Action Button</a>
  </div>
</article>
```

### 2. Disabling/Enabling Navigation Dots
To remove the dots entirely:
- **HTML**: Delete or comment out `<div class="nav-dots" id="dotsContainer"></div>` in `index.html`.
- **JS**: The script is robust; if it doesn't find the `dotsContainer`, it will simply skip the dot initialization without throwing errors.

To change dot styling (colors, size):
- Modify the `--dot-size`, `--nav-color`, and `--nav-active` variables in the `:root` section of `style.css`.

### 3. Disabling/Enabling Arrows
To remove the arrows:
- **HTML**: Delete or comment out the `<button>` elements with IDs `prevBtn` and `nextBtn`.
- **CSS**: You can hide them on specific screen sizes by modifying the `.nav-arrow` class in `style.css`. By default, they are hidden on mobile using a media query:
  ```css
  @media (max-width: 768px) {
    .nav-arrow { display: none; }
  }
  ```

### 4. Adjusting Slides Per View
The slider uses CSS variables to determine how many slides are visible at different breakpoints. Locate these in the `:root` of `style.css`:

```css
:root {
  --slides-per-view: 1.2;  /* Default (Mobile) */
}

@media (min-width: 640px) {
  :root { --slides-per-view: 2.2; }
}

@media (min-width: 1024px) {
  :root { --slides-per-view: 3.5; }
}
```
*Tip: Using decimals (like `1.2`) helps indicate to users that there is more content to scroll to.*

### 5. Theming & Colors
Change the core look in the `:root` block of `style.css`:
- `--primary`: The main accent color (default: luxury purple/gold).
- `--bg-dark`: The background color.
- `--accent`: Secondary glow colors.
- `--glass`: The transparency/blur intensity of navigation cards.

---

## 🧠 Technical Overview

- **Native Scrolling**: Uses standard browser scrolling with `scroll-snap-type: x mandatory`.
- **Adaptive Dots**: The JS calculates `numDots = Math.ceil(maxScroll / slideWidth) + 1` so that dots only appear for reachable "pages" in the current viewport.
- **Hardware Acceleration**: Transitions use `transform` and `opacity` to maintain 60FPS.
- **Accessibility**: Arrows and dots include `aria-labels`, and slides are focusable via `tabindex`.

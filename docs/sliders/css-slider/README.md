# Horizon | Universal Premium Slider

A high-performance, autonomous slider built with **CSS Scroll-Snap** and enhanced with a **Universal JavaScript Module**. Optimized for both vanilla web projects and enterprise platforms like **Magento 2**.

---

## 🚀 One-Class Activation

The slider is now self-sufficient. You can activate it by simply adding a class and a container.

### Minimal HTML
You do not need to manually write arrows or dots; the JavaScript will inject them automatically if they are enabled in the options (enabled by default).

```html
<div class="js-horizon-slider">
  <div class="slider-container">
    <!-- Your Slides Here -->
    <article class="slide">...</article>
    <article class="slide">...</article>
  </div>
</div>
```

---

## 🛠 Usage Modes

### 1. Vanilla JavaScript
If you are using the slider in a standard HTML/JS project:

```html
<!-- 1. Include the Script -->
<script src="path/to/script.js"></script>

<!-- 2. Initialize All Sliders -->
<script>
  // Simple activation for all sliders with the default class
  HorizonSlider.initAll('.js-horizon-slider');

  // OR initialize a specific slider with custom options
  new HorizonSlider('#my-special-slider', {
    arrows: true,
    dots: false
  });
</script>
```

### 2. Magento 2 (RequireJS)
The script is [UMD-compliant](https://github.com/umdjs/umd), meaning it works perfectly with Magento's RequireJS system.

**Step 1: Map the component** (in `requirejs-config.js`):
```javascript
var config = {
    map: {
        '*': {
            'horizonSlider': 'Project_Module/js/horizon-slider'
        }
    }
};
```

**Step 2: Initialize in your template or JS file**:
```javascript
require(['horizonSlider'], function(HorizonSlider) {
    // Standard initialization
    HorizonSlider.initAll('.js-horizon-slider');
});
```

---

## ⚙️ Configuration Options

When initializing manually via `new HorizonSlider(element, options)`, you can pass the following:

| Option | Default | Description |
| :--- | :--- | :--- |
| `arrows` | `true` | Set to `false` to disable arrow navigation and injection. |
| `dots` | `true` | Set to `false` to disable dots navigation and injection. |
| `nextLabel` | `'Next slide'` | Accessibility label for the next arrow. |
| `prevLabel` | `'Previous slide'` | Accessibility label for the previous arrow. |
| `activationClass` | `'js-horizon-slider'` | The class used for automatic scanning. |
| `sliderSelector` | `'.slider-container, .product-items'` | Selector for the inner scrolling element. |
| `slideSelector` | `'.slide, .product-item'` | Selector for individual slides. |

---

## 🎨 Theming & Breakdown

### CSS Variables
The aesthetic is controlled via CSS variables in the `:root` of `style.css`:

```css
:root {
  --primary: #9d00ff;       /* Main accent color */
  --slides-per-view: 1.2;    /* How many slides visible (Mobile) */
  --gap: 24px;              /* Space between slides */
  --slider-padding: 5%;      /* Container horizontal padding */
}
```

### Breakpoints
Adjust visibility for different screens:
- **Mobile**: `1.2` slides
- **Tablet**: `2.2` slides
- **Desktop**: `3.5` slides
- **Wide**: `4.5` slides

---

## 🧠 Technical Highlights

- **Universal Export**: Compatible with CommonJS, AMD (RequireJS), and Browser Globals.
- **Auto-Injection**: Injects missing navigation controls into the DOM automatically.
- **Hardware Enhanced**: Uses native CSS Scroll-Snap for buttery-smooth mobile swiping.
- **Dynamic Metrics**: Recalculates dot counts and scroll offsets on window resize.
- **Focus Control**: Compatible with screen readers and keyboard navigation (Left/Right arrows).

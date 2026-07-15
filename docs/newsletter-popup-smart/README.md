# Newsletter popup, but discrete

## What

A newsletter signup popup that doesn't show up on someone's very first visit. Instead of interrupting a stranger before they've seen anything, it waits until they've been to the site a few times, then slides in from the corner instead of blocking the page.

## Why

Popping a "subscribe now" modal on a first-time visitor asks for an email address before they know anything about who's asking. There's no context yet to make that a reasonable ask. Waiting for a returning visitor is a much cheaper signal of actual interest, and a small corner card (no backdrop, doesn't block scrolling or reading) is a lot less annoying than a full-screen interruption.

## How

- **Visit counting** — each page load increments a counter in `localStorage`. No cookies, no server, no tracking beyond the browser's own storage.
- **Delayed reveal** — once a visitor has crossed the visit threshold, the popup waits a bit after load before sliding in, rather than appearing the instant the page renders.
- **Remembers dismissal** — closing the popup or submitting the form sets a flag so it won't show again on that browser.
- **CSS-only animation** — the slide-in/out is a CSS transition (`transform` + `opacity`); JavaScript only toggles a class.

Current settings (in [script.js](script.js)):
- Shows starting on the visitor's **3rd** visit (`MIN_VISITS_BEFORE_SHOW`)
- Appears **1 second** after the page loads, once eligible (`SHOW_DELAY_MS`)

### Files

| File | Purpose |
| --- | --- |
| [index.html](index.html) | Popup markup, plus placeholder page content to demo against |
| [style.css](style.css) | Popup appearance and slide-in animation |
| [script.js](script.js) | Visit counting, show/hide timing, dismissal |

### Trying it out

Open `index.html` in a browser and reload it a few times — nothing shows until you've crossed `MIN_VISITS_BEFORE_SHOW` reloads. To skip the wait while testing, load the page with `?resetPopup` in the URL to clear the stored visit count and dismissal flag, then reload normally to start counting again.

### Adapting it for a real project

Lines marked `/* Customisation */` (CSS) or `// Customisation` (JS) are safe to tweak or delete without breaking the core show/hide/remember logic — things like the visit threshold, delay, popup position, colors/shadow, and whether dismissal is remembered forever (`localStorage`) or just for the session (`sessionStorage`). The `?resetPopup` dev helper and the placeholder page content in `index.html` are demo-only and can be removed outright.

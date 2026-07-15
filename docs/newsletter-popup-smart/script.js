// Customisation: how many page visits before the popup is allowed to show (1 = show on the very first visit)
const MIN_VISITS_BEFORE_SHOW = 3;

// Customisation: how long to wait (ms) after the page loads before the popup appears, once eligible
const SHOW_DELAY_MS = 1000;

const STORAGE_KEY_VISITS = 'newsletterPopup:visits';
const STORAGE_KEY_DISMISSED = 'newsletterPopup:dismissed';

// Customisation: dev/testing helper — visit this page with ?resetPopup in the URL to clear
// stored state and start over. Safe to delete for production.
if (location.search.includes('resetPopup')) {
  localStorage.removeItem(STORAGE_KEY_VISITS);
  localStorage.removeItem(STORAGE_KEY_DISMISSED);
}

function getVisitCount() {
  const count = parseInt(localStorage.getItem(STORAGE_KEY_VISITS), 10) || 0;
  const next = count + 1;
  localStorage.setItem(STORAGE_KEY_VISITS, next);
  return next;
}

function isDismissed() {
  return localStorage.getItem(STORAGE_KEY_DISMISSED) === 'true';
}

function dismiss() {
  localStorage.setItem(STORAGE_KEY_DISMISSED, 'true'); // Customisation: use sessionStorage here to re-ask every session instead of remembering forever
  popup.classList.remove('is-visible');
}

const popup = document.getElementById('newsletter-popup');
const visits = getVisitCount();

if (!isDismissed() && visits >= MIN_VISITS_BEFORE_SHOW) {
  setTimeout(() => {
    popup.classList.add('is-visible');
  }, SHOW_DELAY_MS); // Customisation: remove the setTimeout wrapper to show immediately instead of after a delay
}

popup.querySelector('.newsletter-popup__close').addEventListener('click', dismiss);

popup.querySelector('.newsletter-popup__form').addEventListener('submit', (event) => {
  event.preventDefault(); // Customisation: remove once this is wired up to a real subscribe endpoint
  dismiss();
});

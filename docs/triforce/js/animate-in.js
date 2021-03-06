const classToAnimate = ".js-animate" // Add this class to elements that should animate.
const elementsToAnimate = document.querySelectorAll(classToAnimate) // Elements to animate.
const offset = 200 // Offset from the bottom of the viewport before element is considered visible.
const sequenceDelay = 200 // Sequential speed for elements that are already visible on load.

let requestedAnimation = false // Has requestAnimationFrame(setAnimate) been called? It should only be called once to activate, when user scrolls for the first time.


// Check if element is in the viewport.
// https://codepen.io/bfintal/pen/Ejvgrp?editors=1010
function isVisible(element) {
	const scroll = window.scrollY || window.pageYOffset
	const boundsTop = element.getBoundingClientRect().top + scroll
	const viewport = {
			top: scroll,
			bottom: scroll + window.innerHeight,
	}
	const bounds = {
			top: boundsTop + offset, // offset: let the element scroll X pixels in before it is considered in the viewport
			bottom: boundsTop + element.clientHeight,
	}
	return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom )
			|| ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );
}


if (elementsToAnimate) {
	// Check if there are elements already in the viewport without scrolling
	for (let i = 0; i < elementsToAnimate.length; i++) {
		if (isVisible(elementsToAnimate[i])) {
			// Sequentially animate elements
			setTimeout(function() {
				console.log("elementsToAnimate " + i)

				elementsToAnimate[i].classList.add('animate')
			}, sequenceDelay * i);
		}
	}

	// Check when elements get in the viewport when scrolling.
	// Recursive function, so it should be called only once.
	// The variable requestedAnimation is used to indicate if this has been called already.
	function setAnimate() {
		requestedAnimation = true // Indicate that this function has been called
		for (let i = 0; i < elementsToAnimate.length; i++) {
			if (isVisible(elementsToAnimate[i])) {
				elementsToAnimate[i].classList.add('animate')
			}
			else {
				// Optionally, do something when the element gets out of view.
				// e.g.: reverse the animation.
				// elementsToAnimate[i].classList.remove('animate')
			}
		}
		requestAnimationFrame(setAnimate)
	}

	window.addEventListener('scroll', function() {
		if (requestedAnimation == false) {
			requestAnimationFrame(setAnimate)
		}
	})
} // if (elementsToAnimate)





// const navigationToggle = document.querySelectorAll('.js-navigation-toggle')
// const navigation = document.querySelector('.js-navigation')
// const navigationItem = navigation.querySelectorAll('.js-navigation-item')

// if (navigationItem) {
// 	// Animation is activate due to animation code, so we are going to remove that,
// 	// because the navigation isn't visible yet.
// 	setTimeout(function() {
// 		for (let j = 0; j < navigationItem.length; j++) {
// 			navigationItem[j].classList.remove('animate')
// 		}
// 	}, sequenceDelay * elementsToAnimate.length)

// 	// Add a click listener to every navigation toggle there is.
// 	for (let i = 0; i < navigationToggle.length; i++) {
// 		navigationToggle[i].addEventListener('click', function() {
// 			// Using a class in the body to determine if navigation is open,
// 			// because this allows special styling to be simpler to apply to
// 			// any element on the page without much effort.
// 			document.body.classList.toggle('navigation-open');

// 			// If navigation is open, animate its items.
// 			if (document.body.classList.contains('navigation-open')) {
// 				for (let j = 0; j < navigationItem.length; j++) {
// 					setTimeout(function() {
// 						navigationItem[j].classList.add('animate')
// 					}, sequenceDelay * j);
// 				}
// 			}
// 			else {
// 				for (let j = 0; j < navigationItem.length; j++) {
// 					navigationItem[j].classList.remove('animate')
// 				}
// 			}
// 		})
// 	}
// } // if (navigation && navigationItem && navigationToggle)

"use strict";

const navigation = document.querySelector('.js-site-navigation');
const navigationToggle = document.querySelector('.js-navigation-toggle');

const navigationLink = document.querySelectorAll('.js-site-navigation > ul > li > a');
for (let i = 0; i < navigationLink.length; i++) {
  navigationLink[i].addEventListener('click', function(){
    if (this.nextSibling) {
      console.log('has a sibling')
      document.body.classList.toggle('open-sub-navigation')
      this.parentNode.classList.toggle('active');
      event.preventDefault();
      event.stopPropagation();
    }
  })
}

navigationToggle.addEventListener('click', function(){
  document.body.classList.toggle('open-navigation')
})

// --------------------------------------------------------------------------------------------
// FOR DEVELOPMENT ONLY
// --------------------------------------------------------------------------------------------
if (window.location.href.indexOf('.local') > -1) {
  console.log("readyState: " + document.readyState)
  console.log('Website is running locally')

  document.addEventListener('error', function (event) {
    if (event.target.tagName.toLowerCase() !== 'img') return;
    // https://townsquare.media/site/442/files/2019/11/baby-yoda-11.jpg?w=1603
    event.target.src = window.location.origin + '/images/unknown-species.png';
  }, true);
}

console.log("main.js loaded")

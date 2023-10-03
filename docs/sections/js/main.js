"use strict";


// --------------------------------------------------------------------------------------------
// FOR DEVELOPMENT ONLY
// --------------------------------------------------------------------------------------------
if (window.location.href.indexOf('.local') > -1) {
  console.log("readyState: " + document.readyState)
  console.log('Website is running locally')

  document.addEventListener('error', function (event) {
    if (event.target.tagName.toLowerCase() !== 'img') return;
    // https://townsquare.media/site/442/files/2019/11/baby-yoda-11.jpg?w=1603
    event.target.src = window.location.origin + '/images/baby-yoda-11.jpg';
  }, true);
}

console.log("main.js loaded")

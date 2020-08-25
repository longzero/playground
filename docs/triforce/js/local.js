 /*
  Live.js - One script closer to Designing in the Browser
  Written for Handcraft.com by Martin Kool (@mrtnkl).

  Version 4.
  Recent change: Made stylesheet and mimetype checks case insensitive.

  http://livejs.com
  http://livejs.com/license (MIT)
  @livejs

  Include live.js#css to monitor css changes only.
  Include live.js#js to monitor js changes only.
  Include live.js#html to monitor html changes only.
  Mix and match to monitor a preferred combination such as live.js#html,css

  By default, just include live.js to monitor all css, js and html changes.

  Live.js can also be loaded as a bookmarklet. It is best to only use it for CSS then,
  as a page reload due to a change in html or css would not re-include the bookmarklet.
  To monitor CSS and be notified that it has loaded, include it as: live.js#css,notify
*/
(function () {
  // UPDATE PAGE WITHOUT RELOADING WHEN CSS CHANGES ARE MADE
  require(['livejs'])

  // REPLACE IMAGES WITH BABY YODA ONLY IF THERE IS AN ERROR
  document.addEventListener('error', function (event) {
      if (event.target.tagName.toLowerCase() !== 'img') return;
      event.target.src = 'https://townsquare.media/site/442/files/2019/11/baby-yoda-11.jpg?w=400&q=75';
  }, true);

  // REPLACE ALL IMAGES
  // const imgReplace = document.querySelectorAll("img");
  // for (let i = 0; i < imgReplace.length; i++) {
  //     console.log("Replacing image: " + imgReplace[i].src)
  //     imgReplace[i].src = "https://picsum.photos/id/1025/4951/3301";
  //     imgReplace[i].src = "https://townsquare.media/site/442/files/2019/11/baby-yoda-11.jpg?w=400&q=75"
  // }

  // REPLACE BACKGROUND IMAGES
  // let img = document.querySelectorAll('.card__media');
  // for (let i = 0; i < img.length; i++) {
  //     let style = img[i].currentStyle || window.getComputedStyle(img[i], false);
  //     let bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
  //     // console.log("Replacing backgroundImage: " + img[i].style.backgroundImage)
  //     img[i].style.backgroundImage = "url(https://picsum.photos/id/1025/4951/3301)";
  //     img[i].style.backgroundImage = "url(https://townsquare.media/site/442/files/2019/11/baby-yoda-11.jpg?w=400&q=75)";
  // }

	console.log('local.js loaded')
})();

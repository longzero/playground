// "use strict";

// function displayConsole(message) {
//   console.log(message)
// }

function includeHTML(cb) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
            console.log(file)
          }
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          elmnt.removeAttribute("w3-include-html");
          includeHTML(cb);
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (cb) cb();
  // reloadScripts()
};
includeHTML()


function stripQueryString(inputString) {
  return inputString.split('?')[0];
}



// --------------------------------------------------------------------------------------------
// CAROUSEL FOR MODEL BANNER SLIDER
// --------------------------------------------------------------------------------------------
let modelBannerSliderSelector = ".model-banner-slider.owl-carousel";
$(modelBannerSliderSelector).owlCarousel({
    autoHeight: true,
    center: true,
    dots: true,
    items: 1,
    loop: true,
    margin: 10,
    nav: false,
    navText: [
        '<svg width="19" height="31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.968 14.563v-.118c-.235.235-.352.586-.352 1.055 0 .352.117.703.352 1.055l13.828 13.593c.234.235.586.352.937.352.469 0 .82-.117 1.055-.352l.82-.937c.235-.234.352-.586.352-.938 0-.468-.117-.82-.352-1.054L5.655 15.5 17.608 3.781c.352-.351.469-.703.469-1.054 0-.47-.117-.704-.469-.938l-.82-.82C16.553.617 16.202.5 15.733.5c-.351 0-.703.117-.937.469L.968 14.563z"/></svg>',
        '<svg width="18" height="31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.245 16.438v.117c.235-.235.352-.586.352-1.055 0-.352-.117-.703-.352-1.055L3.417.852C3.183.617 2.831.5 2.48.5c-.469 0-.82.117-1.055.352l-.82.937c-.235.234-.352.586-.352.938 0 .468.117.82.352 1.054L12.558 15.5.605 27.219c-.352.351-.469.703-.469 1.054 0 .47.117.704.469.938l.82.82c.234.352.586.469 1.055.469.351 0 .703-.117.937-.469l13.828-13.593z"/></svg>'
    ],
    responsive: {
        768: {
            autoHeight: false
        }
    }
});

$(modelBannerSliderSelector).find('img').removeAttr('loading');



// --------------------------------------------------------------------------------------------
// IMAGE TAB
// --------------------------------------------------------------------------------------------
let imageTabSelector = ".js-image-tab--ID .owl-carousel";
$(imageTabSelector).owlCarousel({
    autoHeight: true,
    center: true,
    dots: false,
    items: 1,
    loop: false,
    margin: 10,
    nav: false,
    navText: [
        '<svg width="19" height="31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.968 14.563v-.118c-.235.235-.352.586-.352 1.055 0 .352.117.703.352 1.055l13.828 13.593c.234.235.586.352.937.352.469 0 .82-.117 1.055-.352l.82-.937c.235-.234.352-.586.352-.938 0-.468-.117-.82-.352-1.054L5.655 15.5 17.608 3.781c.352-.351.469-.703.469-1.054 0-.47-.117-.704-.469-.938l-.82-.82C16.553.617 16.202.5 15.733.5c-.351 0-.703.117-.937.469L.968 14.563z"/></svg>',
        '<svg width="18" height="31" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.245 16.438v.117c.235-.235.352-.586.352-1.055 0-.352-.117-.703-.352-1.055L3.417.852C3.183.617 2.831.5 2.48.5c-.469 0-.82.117-1.055.352l-.82.937c-.235.234-.352.586-.352.938 0 .468.117.82.352 1.054L12.558 15.5.605 27.219c-.352.351-.469.703-.469 1.054 0 .47.117.704.469.938l.82.82c.234.352.586.469 1.055.469.351 0 .703-.117.937-.469l13.828-13.593z"/></svg>'
    ],
    responsive: {
        768: {
            autoHeight: false
        }
    }
});

$(imageTabSelector).find('img').removeAttr('loading');

$('.js-image-tab--ID .js-image-tab-navigation-item').click(function(){
  console.log($(this).index())
  $('.js-image-tab--ID .owl-carousel').trigger('to.owl.carousel', $(this).index())
});





// --------------------------------------------------------------------------------------------
// FOR DEVELOPMENT ONLY
// --------------------------------------------------------------------------------------------
if (window.location.href.indexOf('.local') > -1) {
  console.log("readyState: " + document.readyState)
  console.log('Website is running locally')

  // document.addEventListener('click', function (event) {
  //   console.log("click")
  //   reloadScripts()
  // })

  document.addEventListener('error', function (event) {
    if (event.target.tagName.toLowerCase() !== 'img') return;
    // https://townsquare.media/site/442/files/2019/11/baby-yoda-11.jpg?w=1603
    event.target.src = window.location.origin + '/images/baby-yoda-11.jpg';
  }, true);


  function reloadScripts() {
    console.log("reloadScripts()")
    let scripts = document.querySelectorAll('script');
    scripts.forEach(function(script) {
      // if (script.getAttribute('src') !== null && script.getAttribute('src').lastIndexOf('jquery') === -1) {
      if (script.getAttribute('src') !== null) {
        let oldSrc = stripQueryString(script.getAttribute('src'));
        let newSrc = oldSrc + '?' + new Date().getTime();

        // script.removeAttribute('src');
        script.remove()

        setTimeout(function() {
          // console.log("reload: " + newSrc)
          // script.setAttribute('src', newSrc);
          let scriptNew = document.createElement('script');
          scriptNew.src = newSrc
          scriptNew.onload = function() {
            console.log(scriptNew)
          };
          scriptNew.onerror = function() {
            // Handle errors if the script fails to load
            console.error(scriptNew)
          };
          document.body.appendChild(scriptNew);

        }, 250);
      }
    });
    console.log("END reloadScripts()")
  }

}

console.log("main.js loaded")

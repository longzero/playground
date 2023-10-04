"use strict";

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
};
includeHTML()


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

// set global namespace
var webApp = webApp || {};

webApp.functionName = function() {
    "use strict";
    var btn = $('.btn');

    btn.on({
      click: function(e) {
        e.preventDefault();
        /* Act on the event */
      }
    })
};








$(document).ready(function() {
  //webApp.functionName();
  // Do something.
});

$(window).on('scroll', function () {
    // Do something.
});

$(window).on('load', function () {
    // Do something.
});

$(window).on('resize', function () {
    // Do something.
});

// import bootstrap default modules/scripts
var $ = require('jquery');
window.$ = $;
window.Popper = require('popper.js').default;
require('bootstrap');

// optional for image placeholders
window.Holder = require('holderjs').default;

// handle the common bootstrap js
$(function () {

  $('[data-toggle="popover"]').popover({
    container: 'body'
  });
  $('[data-toggle="tooltip"]').tooltip();
})

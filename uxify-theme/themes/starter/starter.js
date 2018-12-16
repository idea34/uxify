// import bootstrap default modules/scripts
var $ = require('jquery');
window.$ = $;
window.Popper = require('popper.js').default;
require('bootstrap');

// optional for image placeholders
window.Holder = require('holderjs').default;

// for preview
var config = require('./_theme-config.json');
$('.navbar-brand-preview').html(config.name);

// handle the common bootstrap js prefs for this theme
$(function () {

  $('[data-toggle="popover"]').popover({
    container: 'body'
  });

  $('[data-toggle="tooltip"]').tooltip();

  $('.carousel').carousel({
      interval: false
    });

})

// import bootstrap default modules/scripts
var $ = require('jquery');
window.$ = $;
window.Popper = require('popper.js').default;
require('bootstrap');

// optional for image placeholders
window.Holder = require('holderjs').default;

// routing
Navigo = require('navigo');
router = new Navigo('/1.0.0/', false, false);
router
  .on('/user/:id/:action', function (params, query) {
    // If we have http://site.com/user/42/save?answer=42 as a url then
    // params.id = 42
    // params.action = save
    // query = answer=42
    console.log(params);
  })
  .resolve();

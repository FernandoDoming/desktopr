var ipc = require('ipc');
var $   = require('jquery');
var Masonry = require('masonry-layout');

var RPP = 50;

$(document).ready(function () {
  _500px.init({
    sdk_key: '93b63bb139a91188c29062455158bdf377ff9b75'
  });

  _500px.api('/photos', { feature: 'editors', page: 1, rpp: RPP, image_size: 20 }, function (response) {

    response.data.photos.forEach(function (photo) {
      $('.images').append("<img src='" + photo.image_url + "' width='50%'/>");
    });

    var container = document.querySelector('.images');
    var masonry = new Masonry(container, {
      itemSelector: 'img'
    });
  });

});

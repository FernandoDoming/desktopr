var ipc = require('ipc');
var $   = require('jquery');
var Masonry = require('masonry-layout');
var Handlebars = require('handlebars');
var imagesLoaded = require('imagesloaded');

var RPP = 50;

$(document).ready(function () {
  _500px.init({
    sdk_key: '93b63bb139a91188c29062455158bdf377ff9b75'
  });

  _500px.api('/photos', { feature: 'editors', page: 1, rpp: RPP, image_size: 20 }, function (response) {
    console.log(response.data.photos);

    var source   = $("#image-template").html();
    var template = Handlebars.compile(source);
    response.data.photos.forEach(function (photo) {
      var context = {
        title: photo.name,
        src: photo.image_url,
        id: photo.id
      };
      var html    = template(context);
      $('.images').append(html);
    });

    var container = document.querySelector('.images');
    imagesLoaded(container, function () {
      var masonry = new Masonry(container, {
        itemSelector: '.image-block'
      });
    });

    $(document).on('click', '.set-background', function () {
      var id = $(this).closest('.image-block').data('id');
      ipc.send('set-background', { id: id });
    });
  });

});

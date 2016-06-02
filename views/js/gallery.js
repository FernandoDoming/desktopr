const ipc = require('electron').ipcRenderer;
const $ = window.$ = window.jQuery = require('jquery');
const bootstrap = require('./../js/bootstrap.min.js');
const _   = require('jquery-inview');
const Masonry = require('masonry-layout');
const Handlebars = require('handlebars');
const imagesLoaded = require('imagesloaded');
const Snackbar = require('./../js/snackbar.js');

let snackbar = new Snackbar();

_500px.init({
  sdk_key: '93b63bb139a91188c29062455158bdf377ff9b75'
});

const RPP = 50;
let settings = null;
let page = 1;

ipc.on('init-settings', function (sender, opts) {
  settings = opts;
  request();
});

$(document).ready(function () {
  ipc.send('request-settings');
});

$(document).on('click', '#set-background', function () {
  let $imageBlock = $(this).closest('.image-block');
  let id = $imageBlock.data('id');
  let title = $imageBlock.data('title');

  snackbar.show(`Setting ${title} as the background`);
  ipc.send('set-background', { id: id });
});

$(document).on('click', '#open-image', function () {
  let $imageBlock = $(this).closest('.image-block');

  ipc.send('open-image', {
    id: $imageBlock.data('id'),
    width: $imageBlock.data('width'),
    height: $imageBlock.data('height')
  });
});

$('#end').on('inview', request);

function request() {
  _500px.api('/photos', { feature: 'editors', page: page, rpp: RPP, image_size: 20 }, appendImages);
  _500px.api('/photos', { feature: 'popular', page: page, rpp: RPP, image_size: 20 }, appendImages);
  page++;
  snackbar.show('Getting more images');
}

function appendImages(response) {
  $('#loading').hide();

  var source   = $("#image-template").html();
  var template = Handlebars.compile(source);
  response.data.photos.forEach(function (photo) {

    if (photo.nsfw && !settings.allow_nsfw) return;

    var context = {
      title: photo.name,
      src: photo.image_url,
      id: photo.id,
      author: photo.user.firstname,
      resolution: photo.width + 'x' + photo.height,
      nsfw: photo.nsfw,
      width: photo.width,
      height: photo.height
    };
    var html    = template(context);
    $appended = $('.images').append(html);
    $appended.find('[data-toggle="tooltip"]').tooltip();
  });

  var container = document.querySelector('.images');
  imagesLoaded(container, function () {
    var masonry = new Masonry(container, {
      itemSelector: '.image-block'
    });
  });
}

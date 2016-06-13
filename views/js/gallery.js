const ipc = require('electron').ipcRenderer;
const $ = window.$ = window.jQuery = require('jquery');
const bootstrap = require('./../js/bootstrap.min.js');
const _ = require('jquery-inview');
const Masonry = require('masonry-layout');
const Handlebars = require('handlebars');
const imagesLoaded = require('imagesloaded');
const Snackbar = require('./../js/snackbar.js');
const API500px = require('500px');
const api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');

let snackbar = new Snackbar();

const RPP = 10;
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
  for (let source of settings.sources) {
    api500px.photos[`get${source}`]({ page: page, rpp: RPP, image_size: 20 }, function(error, response) {
      appendImages(error, response, source);
    });
    page++;
  }
  snackbar.show('Getting more images');
}

function appendImages(error, response, feature) {
  if (error) { return; }
  $('#loading').hide();

  var source   = $("#image-template").html();
  var template = Handlebars.compile(source);
  response.photos.forEach(function (photo) {

    if (photo.nsfw && !settings.allow_nsfw) return;

    var context = {
      title: photo.name,
      src: photo.image_url,
      id: photo.id,
      author: photo.user.firstname,
      resolution: photo.width + 'x' + photo.height,
      nsfw: photo.nsfw,
      width: photo.width,
      height: photo.height,
      feature: feature
    };
    var html  = template(context);
    var $appended = $(html).appendTo('.images');
    $appended.find('[data-toggle="tooltip"]').tooltip();
  });

  var container = document.querySelector('.images');
  imagesLoaded(container, function () {
    var masonry = new Masonry(container, {
      itemSelector: '.image-block',
      isAnimated: false
    });
    $('.images .image-block.image-block').each(function() {
      $(this).addClass('animated zoomIn');
    });
  });
}

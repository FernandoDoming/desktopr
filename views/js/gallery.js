const ipc = require('electron').ipcRenderer;
const $ = window.$ = window.jQuery = require('jquery');
const bootstrap = require('./../js/bootstrap.min.js');
const _ = require('jquery-inview');
const Masonry = require('masonry-layout');
const Handlebars = require('handlebars');
const imagesLoaded = require('imagesloaded');
const Snackbar = require('./../js/snackbar.js');
const StringsHelper = require('./../js/helpers/strings_helper.js');
const API500px = require('500px');
const api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');

let snackbar = new Snackbar();

const RPP = 10;
let settings = null;
let page = 1;
let clickableClasses = ['[data-event="open-image"]', '[data-event="set-fav"]',
                        '[data-event="set-background"]'];

ipc.on('init-settings', function (sender, opts) {
  settings = opts;
  request();
});

$(document).ready(function () {
  ipc.send('request-settings');
});

$(document).on('click', clickableClasses.join(','), function () {
  let $imageBlock = $(this).closest('.image-block');
  let event = $(this).data('event');

  if (event === 'set-background') {
    snackbar.show(`Setting ${$imageBlock.data('title')} as the background`);
  }

  ipc.send(event, {
    id: $imageBlock.data('id'),
    width: $imageBlock.data('width'),
    height: $imageBlock.data('height'),
    url: $imageBlock.find('img').attr('src')
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
  if (error) {
    console.log(`ERROR: ${error.message}`);
    return;
  }
  $('#loading').hide();

  let source   = $(`#image-${settings.layout}-template`).html();
  let template = Handlebars.compile(source);
  let columnWidth = `${(100 / settings.n_columns).toFixed(2)}%`;

  let $newImages = [];
  response.photos.forEach(function (photo) {

    if (photo.nsfw && !settings.allow_nsfw) return;

    let context = {
      title: photo.name,
      src: photo.image_url,
      id: photo.id,
      author: photo.user.firstname,
      resolution: photo.width + 'x' + photo.height,
      nsfw: photo.nsfw,
      width: photo.width,
      height: photo.height,
      feature: StringsHelper.humanize(feature),
      columnWidth: columnWidth
    };
    let html  = template(context);
    let $appended = $(html).appendTo('.images');
    $newImages.push($appended);
    $appended.find('[data-toggle="tooltip"]').tooltip();
  });

  let container = document.querySelector('.images');
  imagesLoaded(container, function () {
    let masonry = new Masonry(container, {
      itemSelector: '.image-block',
      isAnimated: false
    });

    $newImages.forEach(function($image) {
      $image.addClass('animated fadeInUpBig');
      // Delete classes when animation ends
      // so masonry can reallocate images on grid
      $image.one('webkitAnimationEnd oanimationend animationend', function () {
        $image.removeClass('fadeInUpBig');
      });
    });
  });
}

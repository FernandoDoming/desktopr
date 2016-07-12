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

const StringsHelper = require('./../js/helpers/strings_helper.js');
const HandlebarsHelper = require('./../js/helpers/handlebars_helper.js');

let snackbar = new Snackbar();

const RPP = 10;
let settings = null;
let page = 1;
let favs = [];
let clickableClasses = '[data-event]';

ipc.on('init-settings', function (sender, opts) {
  settings = opts;
  request();
});

ipc.on('got-favs', function(event, _favs) {
  favs = _favs;
  initFavs($('#favs'));
});

ipc.on('fav-set', function (sender, image) {
  toggleFav(image.id);
  // Refresh favs
  requestFavs();
});

ipc.on('fav-removed', function (sender, image) {
  toggleFav(image.id);
  // Refresh favs
  requestFavs();
});

$(document).ready(function () {
  ipc.send('request-settings');
  requestFavs();
});

$(document).on('click', '[data-event]', function () {
  let $imageBlock = $(this).closest('.image-block');
  let event = $(this).attr('data-event');

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
    console.log(`500px returned error: ${error.message}`);
    return;
  }
  $('#loading').hide();

  let source   = $(`#image-${settings.layout}-template`).html();
  let template = Handlebars.compile(source);
  let columnWidth = `${(100 / settings.n_columns).toFixed(2)}%`;

  let $newImages = [];
  response.photos.forEach(function (photo) {

    if (photo.nsfw && !settings.allow_nsfw) return;

    let isFav = favs.some(function (e) { return e.photo_id == photo.id; });
    let context = {
      title: photo.name,
      src: photo.image_url,
      id: photo.id,
      nsfw: photo.nsfw,
      width: photo.width,
      height: photo.height,
      feature: StringsHelper.humanize(feature),
      columnWidth: columnWidth,
      fav: isFav
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

function toggleFav(id) {
  let $imageBlock = $('.images').find(`[data-id="${id}"]`);
  $imageBlock.toggleClass('fav');
  if ($imageBlock.find('[data-event="set-fav"]').length) {
    $imageBlock.find('[data-event="set-fav"]').attr('data-event', 'remove-fav');
  } else {
    $imageBlock.find('[data-event="remove-fav"]').attr('data-event', 'set-fav');
  }
}

function toggleFavsView() {
  let $container = $('#favs');
  let $footerWrapper = $('#footer-wrapper');
  let $favToggle = $footerWrapper.find('[data-event="toggle-favs-view"]');

  $container.toggleClass('hide');
  let height = $container.height();
  if ($container.hasClass('hide')) {
    $footerWrapper.css({ bottom: '40px' });
  } else {
    $footerWrapper.css({
      bottom: height + parseInt($('#footer-wrapper').css('bottom'))
    });
  }
  $footerWrapper.find('footer').toggleClass('opaque');
  $favToggle.toggleClass('active').find('.fa')
    .toggleClass('fa-heart-o').toggleClass('fa-heart');
  $('#fade').toggleClass('hide');
}

function initFavs($container) {
  $container.html('');
  favs.forEach(function(fav) {
    $container.append(`<img src="${fav.url}" />`);
  });
}

function requestFavs() {
  ipc.send('request-favs');
}

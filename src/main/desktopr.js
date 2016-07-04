var events = require('events');
const Logger = require.main.require('./src/main/logger.js');
var wallpaper = require('wallpaper');
var fs = require('fs');
var request = require('request');
var API500px = require('500px');
var api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');

const CONSTANTS = require.main.require('./src/constants/constants.js');

var _this;

function Desktopr(options) {
  options = typeof options !== 'undefined' ? options : {};
  _this = this;
  events.EventEmitter.call(_this);

  this.options = {
    images_path: options.images_path || __dirname + '/images/',
    allow_nsfw: options.allow_nsfw || false
  };

  _this.newBackground = function () {
    var feature = CONSTANTS.FEATURES[Math.floor(Math.random() * CONSTANTS.FEATURES.length)];
    Logger.info('[*] Getting image from ' + feature);
    _this['new' + feature + 'Background']();
  };

  _this.newPopularBackground = function () {
    api500px.photos.getPopular({
      sort: 'created_at',
      rpp: CONSTANTS.RPP,
      image_size: 2048,
    }, fetchImage);
  };

  _this.newEditorsBackground = function () {
    api500px.photos.getEditorsChoice({
      sort: 'created_at',
      rpp: CONSTANTS.RPP,
      image_size: 2048,
    }, fetchImage);
  };

  _this.newBackgroundById = function (id, callback = fetchImage) {
    api500px.photos.getById( id, { image_size: 2048 }, callback);
  };

  _this.setBackgroundById = function (id, callback = setBackground) {
    api500px.photos.getById( id, { image_size: 2048 }, callback);
  };

}

Desktopr.prototype.__proto__ = events.EventEmitter.prototype;

function fetchImage(error, results) {

  if (error) {
    Logger.error('[x] 500px returned error ' + error.code + ': ' + error.message);
    return;
  }

  var search = true;
  var background = null;
  if (results.photos != undefined) {
    while (search) {
      var photo = results.photos[getRandomInt(0, results.photos.length-1)];
      if (photo.nsfw && !options.allow_nsfw) continue;
      if (photo.width > photo.height) {
        search = false;
        background = photo;
      }
    }
  } else if (results.photo != undefined) {
    background = results.photo;
  }

  Logger.debug('[+] Got ' + background.id + '. Emitting fetch...');
  _this.emit('fetch', background);
}

function setBackground(error, results) {

  if (error) {
    Logger.error('[x] 500px returned error ' + error.code + ': ' + error.message);
    return;
  }

  var image = results.photo;
  Logger.info('[*] Got a picture: ' + image.id + '. Saving to disk...');

  const IMAGE_FILE = _this.options.images_path + image.id + '.' + image.image_format;
  var stream = fs.createWriteStream(IMAGE_FILE);
  request(image.image_url).pipe(stream).on('close', function () {
    Logger.info('[*] Saved ' + image.id + ' to disk')
    wallpaper.set(IMAGE_FILE).then(function () {

      //tray.setImage(ICONS_PATH + '/IconTemplate.png');
      Logger.info('[*] Set wallpaper ' + image.id);

      // Delete the file to comply with 500px API terms
      fs.unlink(image);
    });
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = Desktopr;

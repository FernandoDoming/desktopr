var events = require('events');
var winston = require('winston');
var API500px = require('500px');
var api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');

var RPP = 30;
var FEATURES = ['Editors', 'Popular'];
var _this;

function Desktopr() {
  _this = this;
  events.EventEmitter.call(this);

  this.newBackground = function () {
    var feature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
    winston.info('[*] Getting image from ' + feature);
    this['new' + feature + 'Background']();
  };

  this.newPopularBackground = function () {
    api500px.photos.getPopular({
      sort: 'created_at',
      rpp: RPP,
      image_size: 2048,
    }, fetchImage);
  };

  this.newEditorsBackground = function () {
    api500px.photos.getEditorsChoice({
      sort: 'created_at',
      rpp: RPP,
      image_size: 2048,
    }, fetchImage);
  };
}

Desktopr.prototype.__proto__ = events.EventEmitter.prototype;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fetchImage(error, results) {

  if (error) {
    winston.error('[x] 500px returned error ' + error.code + ': ' + error.message);
    return;
  }

  var search = true;
  var background = null;
  while (search) {
    var photo = results.photos[getRandomInt(0, RPP)];
    if (photo.width > photo.height) {
      search = false;
      background = photo;
    }
  }

  _this.emit('fetch', background);
}

module.exports = Desktopr;

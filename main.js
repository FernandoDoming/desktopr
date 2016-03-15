var menubar = require('menubar');
var locus = require('locus');
var Desktopr = require('./desktopr.js');
var fs = require('fs');
var request = require('request');
var winston = require('winston');
const wallpaper = require('wallpaper');

var IMAGES_PATH = __dirname + '/images/';
var PATH = __dirname;

var mb = menubar({
  height: 100,
  width: 200,
  index: null,
  tooltip: 'Alt click me for options',
});

mb.on('ready', function ready() {
  fs.exists(IMAGES_PATH, function (exists) {
    if (!exists) fs.mkdir(IMAGES_PATH);
  });
});

mb.on('show', function () {
  var service = new Desktopr();
  service.on('fetch', function (background) {

    winston.info('[*] Got a picture: ' + background.id + '. Saving to disk...');
    const IMAGE_FILE = IMAGES_PATH + background.id + '.' + background.image_format;
    var stream = fs.createWriteStream(IMAGE_FILE);
    request(background.image_url).pipe(stream).on('close', function () {
      wallpaper.set(IMAGE_FILE).then(function () {

        mb.setOption('icon', PATH + '/IconTemplate.png');
        winston.info('[*] Set wallpaper ' + IMAGE_FILE);

        // Delete the file to comply with 500px API terms
        //fs.unlink(IMAGE_FILE);
      });
    });
  });

  winston.info('[*] Getting images...');
  service.newBackground();
  mb.setOption('icon', PATH + '/IconDownload.png');
});

mb.on('after-show', function () {
  mb.hideWindow();
});

var electron = require('electron');
var app = electron.app;
var Menu = electron.Menu;
var Tray = electron.Tray;

var Desktopr = require('./desktopr.js');
var fs = require('fs');
var request = require('request');
var winston = require('winston');
var wallpaper = require('wallpaper');

var PATH = __dirname;
var IMAGES_PATH = PATH + '/images/';
var ICONS_PATH = PATH + '/icons/';

app.on('ready', function () {

  tray = new Tray(ICONS_PATH + 'IconTemplate.png');
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Quit', click: exit }
  ]);

  fs.exists(IMAGES_PATH, function (exists) {
    if (!exists) fs.mkdir(IMAGES_PATH);
  });

  tray.on('click', function (event) {

    if (event.altKey) {
      tray.popUpContextMenu(contextMenu);

    } else {
      var service = new Desktopr();
      service.on('fetch', function (background) {

        winston.info('[*] Got a picture: ' + background.id + '. Saving to disk...');
        const IMAGE_FILE = IMAGES_PATH + background.id + '.' + background.image_format;
        var stream = fs.createWriteStream(IMAGE_FILE);
        request(background.image_url).pipe(stream).on('close', function () {
          wallpaper.set(IMAGE_FILE).then(function () {

            tray.setImage(ICONS_PATH + '/IconTemplate.png');
            winston.info('[*] Set wallpaper ' + IMAGE_FILE);

            // Delete the file to comply with 500px API terms
            fs.unlink(IMAGE_FILE);
          });
        });
      });

      winston.info('[*] Getting images...');
      service.newBackground();
      tray.setImage(ICONS_PATH + '/IconDownload.png');
    }
  });
});

function exit() {
  app.quit();
};

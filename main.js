var electron = require('electron');
var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var BrowserWindow = require('browser-window');

var fs = require('fs');
var ipc = require('ipc');
var request = require('request');
var winston = require('winston');
var wallpaper = require('wallpaper');
var Desktopr = require('./desktopr.js');
var Settings = require('./settings.js');

var PATH = __dirname;
var IMAGES_PATH = PATH + '/images/';
var ICONS_PATH = PATH + '/icons/';

var tray = null;
var service = null;
var settings = null;

var contextMenu = Menu.buildFromTemplate([
  { label: 'Show gallery...', click: showGallery },
  {
    label: 'Change background each',
    submenu: [
      { label: '1 hour' },
      { label: '30 minutes' },
      { label: '15 minutes' },
      { label: '5 minutes' },
      { label: '1 minute' }
    ]
  },
  { type: 'separator' },
  { label: 'Options', click: showOptions },
  { type: 'separator' },
  { label: 'Quit', click: exit }
]);

app.on('ready', function () {

  settings = Settings.load();
  tray = new Tray(ICONS_PATH + 'IconTemplate.png');
  service = new Desktopr({
    images_path: IMAGES_PATH,
    allow_nsfw: settings.allow_nsfw
  });

  service.on('fetch', function (background) {
    winston.info('[*] Got a picture: ' + background.id + '. Saving to disk...');
    const IMAGE_FILE = IMAGES_PATH + background.id + '.' + background.image_format;
    var stream = fs.createWriteStream(IMAGE_FILE);
    request(background.image_url).pipe(stream).on('close', function () {
      setWallpaper(IMAGE_FILE);
    });
  });

  if (settings.open_gallery) showGallery();

  fs.exists(IMAGES_PATH, function (exists) {
    if (!exists) fs.mkdir(IMAGES_PATH);
  });

  tray.on('click', function (event) {

    if (event.altKey) {
      tray.popUpContextMenu(contextMenu);
    } else {
      winston.info('[*] Getting images...');
      service.newBackground();
      tray.setImage(ICONS_PATH + '/IconDownload.png');
    }
  });
});

// Do not quit when all windows are closed
app.on('window-all-closed', function () {});

// IPC events
ipc.on('set-background', function (event, data) {
  winston.info('[*] Requested to get ' + data.id);
  service.setBackgroundById(data.id);
});

/********************** Functions **********************/

function exit() {
  app.quit();
};

function showGallery() {
  galleryWindow = new BrowserWindow({
    height: 800,
    width: 600
  });

  galleryWindow.loadURL('file://' + __dirname + '/views/html/gallery.html');

  galleryWindow.on('closed', function () {
    galleryWindow = null;
  });
}

function showOptions() {
  optionsWindow = new BrowserWindow({
    height: 400,
    width: 400
  });

  optionsWindow.loadURL('file://' + __dirname + '/views/html/options.html');

  ipc.on('request-settings', function (event, data) {
    event.sender.send('init-settings', settings);
  });

  ipc.on('set-option', function (event, data) {
    settings[data.key] = data.value;
    Settings.save(settings);
  });

  optionsWindow.on('closed', function () {
    optionsWindow = null;
  });
}

function setWallpaper(image) {
  wallpaper.set(image).then(function () {

    tray.setImage(ICONS_PATH + '/IconTemplate.png');
    winston.info('[*] Set wallpaper ' + image);

    // Delete the file to comply with 500px API terms
    fs.unlink(image);
  });
}

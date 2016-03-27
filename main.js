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

var INTERVALS = {
  '1_hour': 60 * 60 * 1000,
  '30_min': 30 * 60 * 1000,
  '15_min': 15 * 60 * 1000,
  '5_min': 5 * 60 * 1000,
  '1_min': 1 * 60 * 1000,
};

var tray = null;
var service = null;
var settings = null;
var interval = null;

var galleryWindow = null;
var optionsWindow = null;

var contextMenu = Menu.buildFromTemplate([
  { label: 'Get a random wallpaper', click: function () { service.newBackground(); } },
  { label: 'Show gallery...', click: showGallery },
  {
    id: 'change_background',
    label: 'Change background each',
    submenu: [
      { label: 'Never', type: 'radio', id: 'never', click: function () { setUpdatePeriod('never'); } },
      { label: '1 hour', type: 'radio', id: '1_hour', click: function () { setUpdatePeriod('1_hour'); } },
      { label: '30 minutes', type: 'radio', id: '30_min', click: function () { setUpdatePeriod('30_min'); } },
      { label: '15 minutes', type: 'radio', id: '15_min', click: function () { setUpdatePeriod('15_min'); } },
      { label: '5 minutes', type: 'radio', id: '5_min', click: function () { setUpdatePeriod('5_min'); } },
      { label: '1 minute', type: 'radio', id: '1_min', click: function () { setUpdatePeriod('1_min'); } },
    ]
  },
  { type: 'separator' },
  { label: 'Options', click: showOptions },
  { type: 'separator' },
  { label: 'Quit', click: exit }
]);

app.on('ready', function () {

  settings = Settings.load();
  setUpdatePeriod(settings.period);

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

  tray.on('right-click', function (event) {
    tray.popUpContextMenu(contextMenu);
  });
});

// Do not quit when all windows are closed
app.on('window-all-closed', function () {});

// IPC events
ipc.on('set-background', function (event, data) {
  winston.info('[*] Requested to get ' + data.id);
  service.setBackgroundById(data.id);
});

ipc.on('request-settings', function (event, data) {
  event.sender.send('init-settings', settings);
});

ipc.on('set-option', function (event, data) {
  settings[data.key] = data.value;
  Settings.save(settings);
});

/********************** Functions **********************/

function exit() {
  app.quit();
};

function showGallery() {
  if (galleryWindow != null) { return; }

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
  if (optionsWindow != null) { return; }

  optionsWindow = new BrowserWindow({
    height: 400,
    width: 400
  });

  optionsWindow.loadURL('file://' + __dirname + '/views/html/options.html');

  optionsWindow.on('closed', function () {
    optionsWindow = null;
  });
}

function setUpdatePeriod(period) {
  contextMenu.items.filter(function (obj) {
    return obj.id == 'change_background';
  })[0].submenu.items.filter(function (obj) {
    return obj.id == period;
  })[0].checked = true;

  settings.period = period;
  Settings.save(settings);

  clearInterval(interval);
  if (period != 'never') {
    interval = setInterval(function () {
      service.newBackground();
    }, INTERVALS[period]);
  }
}

function setWallpaper(image) {
  wallpaper.set(image).then(function () {

    tray.setImage(ICONS_PATH + '/IconTemplate.png');
    winston.info('[*] Set wallpaper ' + image);

    // Delete the file to comply with 500px API terms
    fs.unlink(image);
  });
}

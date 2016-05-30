const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const fs = require('fs');
const request = require('request');
const winston = require('winston');
const wallpaper = require('wallpaper');
const Settings = require('./src/main/settings.js');
const Templates = require('./src/constants/templates.js');
const Gallery = require('./src/ui/gallery.js');
const Options = require('./src/ui/options.js');
const App = require('./src/main/app.js');

const CONSTANTS = require('./src/constants/constants.js');

var tray = null;

app.on('ready', function () {

  App.setUpdatePeriod(App.settings.period);
  tray = new Tray(CONSTANTS.ICONS_PATH + 'IconTemplate.png');

  App.service.on('fetch', function (background) {
    winston.info('[*] Got a picture: ' + background.id + '. Saving to disk...');
    const IMAGE_FILE = CONSTANTS.IMAGES_PATH + background.id + '.' + background.image_format;
    var stream = fs.createWriteStream(IMAGE_FILE);
    request(background.image_url).pipe(stream).on('close', function () {
      App.setWallpaper(IMAGE_FILE);
    });
  });

  if (App.settings.open_gallery) Gallery.show();

  fs.exists(CONSTANTS.IMAGES_PATH, function (exists) {
    if (!exists) fs.mkdir(CONSTANTS.IMAGES_PATH);
  });

  tray.on('click', function (event) {

    if (event.altKey && App.settings.menu_on_alt ||
        !event.altKey && !App.settings.menu_on_alt) {
      tray.popUpContextMenu(App.contextMenu);
    } else {
      winston.info('[*] Getting images...');
      App.service.newBackground();
      tray.setImage(CONSTANTS.ICONS_PATH + '/IconDownload.png');
    }
  });

  tray.on('right-click', function (event) {
    tray.popUpContextMenu(App.contextMenu);
  });
});

// Do not quit when all windows are closed
app.on('window-all-closed', function () {});

// IPC events
ipc.on('set-background', function (event, data) {
  winston.info('[*] Requested to get ' + data.id);
  App.service.setBackgroundById(data.id);
});

ipc.on('request-settings', function (event, data) {
  event.sender.send('init-settings', App.settings);
});

ipc.on('set-option', function (event, data) {
  App.settings[data.key] = data.value;
  Settings.save(App.settings);
});

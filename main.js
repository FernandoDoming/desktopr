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
const Desktopr = require('./src/main/desktopr.js');
const Settings = require('./src/main/settings.js');
const Templates = require('./src/constants/templates.js');
const Gallery = require('./src/ui/gallery.js');
const Options = require('./src/ui/options.js');

const CONSTANTS = require('./src/constants/constants.js');

var tray = null;
var interval = null;

var settings = Settings.load();
var service = new Desktopr({
  images_path: CONSTANTS.IMAGES_PATH,
  allow_nsfw: settings.allow_nsfw
});

var contextMenu = Menu.buildFromTemplate([
  { label: 'Get a random wallpaper', click: service.newBackground },
  { label: 'Show gallery...', click: Gallery.show },
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
  { label: 'Options', click: Options.show },
  { type: 'separator' },
  { label: 'Quit', click: exit }
]);

app.on('ready', function () {

  setUpdatePeriod(settings.period);
  tray = new Tray(CONSTANTS.ICONS_PATH + 'IconTemplate.png');

  service.on('fetch', function (background) {
    winston.info('[*] Got a picture: ' + background.id + '. Saving to disk...');
    const IMAGE_FILE = CONSTANTS.IMAGES_PATH + background.id + '.' + background.image_format;
    var stream = fs.createWriteStream(IMAGE_FILE);
    request(background.image_url).pipe(stream).on('close', function () {
      setWallpaper(IMAGE_FILE);
    });
  });

  if (settings.open_gallery) Gallery.show();

  fs.exists(CONSTANTS.IMAGES_PATH, function (exists) {
    if (!exists) fs.mkdir(CONSTANTS.IMAGES_PATH);
  });

  tray.on('click', function (event) {

    if (event.altKey) {
      tray.popUpContextMenu(contextMenu);
    } else {
      winston.info('[*] Getting images...');
      service.newBackground();
      tray.setImage(CONSTANTS.ICONS_PATH + '/IconDownload.png');
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
    }, CONSTANTS.INTERVALS[period]);
  }
}

function setWallpaper(image) {
  wallpaper.set(image).then(function () {

    tray.setImage(CONSTANTS.ICONS_PATH + '/IconTemplate.png');
    winston.info('[*] Set wallpaper ' + image);

    // Delete the file to comply with 500px API terms
    fs.unlink(image);
  });
}

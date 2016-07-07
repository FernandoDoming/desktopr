const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const ImageWindow = require.main.require('./src/ui/image.js');
const Database = require.main.require('./src/main/database.js');
const Logger = require.main.require('./src/main/logger.js');

const Templates = require.main.require('./src/constants/templates.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

let gallery = {
  window: null,
  imageWindows: []
};

ipc.on('open-image', function(event, image) {
  let imageWindow = ImageWindow.create(image);

  gallery.imageWindows.push(imageWindow);
  ImageWindow.init(image.id);

  imageWindow.on('closed', function () {
    gallery.imageWindows.splice(gallery.imageWindows.indexOf(imageWindow), 1);
    imageWindow = null;
  });
});

ipc.on('set-fav', function(event, image) {
  Database.execute(`INSERT INTO favorites (photo_id, date_added, url, data) ` +
                   `VALUES (${image.id}, ${Date.now()}, "${image.url || null}", ${image.data || null});`);
  Logger.info(`New favorite ${image.id} saved`);
});

gallery.show = function () {
  // Do not create the window again if it is already instantiated
  if (gallery.window != null) {
    gallery.window.show();
    return;
  }

  let menu = new Menu.buildFromTemplate(Templates.appMenu);
  Menu.setApplicationMenu(menu);

  gallery.window = new BrowserWindow({
    height: 800,
    width: 600,
    titleBarStyle: 'hidden'
  });

  gallery.window.loadURL('file://' + CONSTANTS.PATH + '/views/html/gallery.html');

  gallery.window.on('closed', function () {
    gallery.window = null;
  });
};

gallery.reload = function () {
  if (gallery.window != null) {
    gallery.window.reload();
  }
}

module.exports = gallery;

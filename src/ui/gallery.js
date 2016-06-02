const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;
const ImageWindow = require.main.require('./src/ui/image.js');

const Templates = require.main.require('./src/constants/templates.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

let gallery = {
  window: null,
  imageWindows: []
};

ipc.on('open-image', function(event, data) {
  let imageWindow = ImageWindow.create(data);

  gallery.imageWindows.push(imageWindow);
  ImageWindow.init(data.id);

  imageWindow.on('closed', function () {
    gallery.imageWindows.splice(gallery.imageWindows.indexOf(imageWindow), 1);
    imageWindow = null;
  });
});

gallery.show = function showGallery() {
  if (gallery.window != null) { return; }

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

module.exports = gallery;

const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const Templates = require.main.require('./src/constants/templates.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

let gallery = {
  window: null,
};

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

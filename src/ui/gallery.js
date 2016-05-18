var electron = require('electron');
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;

var Templates = require.main.require('./src/constants/templates.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

var gallery = {
  window: null,
};

gallery.show = function showGallery() {
  if (gallery.window != null) { return; }

  var menu = new Menu.buildFromTemplate(Templates.appMenu);
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

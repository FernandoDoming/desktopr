const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const Templates = require.main.require('./src/constants/templates.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

var options = {
  window: null,
};

options.show = function showGallery() {
  if (options.window != null) { return; }

  options.window = new BrowserWindow({
    height: 400,
    width: 400
  });

  options.window.loadURL('file://' + CONSTANTS.PATH + '/views/html/options.html');

  options.window.on('closed', function () {
    options.window = null;
  });
};

module.exports = options;

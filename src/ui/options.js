const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const ipc = electron.ipcMain;

const Templates = require.main.require('./src/constants/templates.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

let options = {
  window: null,
  shouldReloadOnExit: false
};

ipc.on('show-options', function(event, _) {
  options.show();
});

options.show = function () {
  if (options.window != null) { return; }

  options.window = new BrowserWindow({
    height: 400,
    width: 400
  });

  options.shouldReloadOnExit = false;
  options.window.loadURL('file://' + CONSTANTS.PATH + '/views/html/options.html');

  options.window.on('closed', function () {
    options.window = null;

    // TODO: Find a better way to reload gallery
    if (options.shouldReloadOnExit) {
      BrowserWindow.getAllWindows().forEach(function (window) {
        if (window.getTitle().indexOf('Gallery') > -1) window.reload();
      });
    }
  });
};

module.exports = options;

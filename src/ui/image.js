const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const CONSTANTS = require.main.require('./src/constants/constants.js');

let imageWindow = {};

imageWindow.window = null;

imageWindow.create = function (opts) {
  imageWindow.window = new BrowserWindow({
    height: opts.height,
    width: opts.width,
    maxWidth: opts.width,
    maxHeight: opts.height,
    titleBarStyle: 'hidden',
    transparent: true
  });
  return imageWindow.window;
};

imageWindow.init = function (id) {
  imageWindow.window.loadURL('file://' + CONSTANTS.PATH + '/views/html/image.html');
  imageWindow.window.webContents.on('did-finish-load', function () {
    imageWindow.window.webContents.send('request-image', {
      id: id
    });
  });
};

module.exports = imageWindow;

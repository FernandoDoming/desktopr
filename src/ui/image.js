const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const CONSTANTS = require.main.require('./src/constants/constants.js');

let imageWindow = {};

imageWindow.window = null;

imageWindow.create = function (opts) {
  const screen = electron.screen;
  let currentDisplay = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());

  let imageRatio = opts.width / opts.height;
  let screenRatio = currentDisplay.workAreaSize.width / currentDisplay.workAreaSize.height;
  let height = Math.min(opts.height, currentDisplay.workAreaSize.height);
  let width = Math.min(opts.width, currentDisplay.workAreaSize.width);

  if (opts.width > currentDisplay.workAreaSize.width && imageRatio > screenRatio) {
    height = Math.round(width / imageRatio);
  } else if (opts.height > currentDisplay.workAreaSize.height && imageRatio < screenRatio) {
    width = Math.round(height * imageRatio);
  }

  imageWindow.window = new BrowserWindow({
    height: height,
    width: width,
    maxWidth: opts.width,
    maxHeight: opts.height,
    titleBarStyle: 'hidden',
    transparent: true
  });
  imageWindow.window.setAspectRatio(imageRatio);
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

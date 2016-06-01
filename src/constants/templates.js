const Options = require.main.require('./src/ui/options.js');
const name = require('electron').app.getName();

let templates = {};

templates.appMenu = [ {
  label: 'View',
  submenu: [
    {
      label: 'Settings',
      accelerator: 'CmdOrCtrl+,',
      click(item, focusedWindow) {
        if (focusedWindow)
          Options.show();
      }
    },
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click(item, focusedWindow) {
        if (focusedWindow) focusedWindow.reload();
      }
    },
    {
      label: 'Toggle Full Screen',
      accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
      click(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.webContents.toggleDevTools();
      }
    },
  ]
},
{
  label: 'Window',
  role: 'window',
  submenu: [
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
  ]
},
{
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'Learn More',
      click() { require('electron').shell.openExternal('http://electron.atom.io'); }
    },
  ]
}];

if (process.platform === 'darwin') {
  templates.appMenu.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  });
  // Window menu.
  templates.appMenu[3].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  );
}

templates.buildContextMenuTemplate = function (refs) {
  return [
    { label: 'Get a random wallpaper', click: refs.app.service.newBackground },
    { label: 'Show gallery...', click: refs.gallery.show },
    {
      id: 'change_background',
      label: 'Change background each',
      submenu: [
        { label: 'Never', type: 'radio', id: 'never', click: function () { refs.app.setUpdatePeriod('never'); } },
        { label: '24 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('24_hours'); } },
        { label: '12 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('12_hours'); } },
        { label: '6 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('6_hours'); } },
        { label: '4 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('4_hours'); } },
        { label: '2 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('2_hours'); } },
        { label: '1 hour', type: 'radio', id: '1_hour', click: function () { refs.app.setUpdatePeriod('1_hour'); } },
        { label: '30 minutes', type: 'radio', id: '30_min', click: function () { refs.app.setUpdatePeriod('30_min'); } },
        { label: '15 minutes', type: 'radio', id: '15_min', click: function () { refs.app.setUpdatePeriod('15_min'); } },
        { label: '5 minutes', type: 'radio', id: '5_min', click: function () { refs.app.setUpdatePeriod('5_min'); } },
        { label: '1 minute', type: 'radio', id: '1_min', click: function () { refs.app.setUpdatePeriod('1_min'); } },
      ]
    },
    { type: 'separator' },
    { label: 'Options', click: refs.options.show },
    { type: 'separator' },
    { label: 'Quit', click: refs.app.exit }
  ];
};

module.exports = templates;

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;

const Templates = require.main.require('./src/constants/templates.js');
const Desktopr = require.main.require('./src/main/desktopr.js');
const Settings = require.main.require('./src/main/settings.js');
const Gallery = require.main.require('./src/ui/gallery.js');
const Options = require.main.require('./src/ui/options.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

let App = {};

let interval = null;
let settings = Settings.load();

App.exit = function() {
  app.quit();
};

App.settings = settings;

App.service = new Desktopr({
  images_path: CONSTANTS.IMAGES_PATH,
  allow_nsfw: Settings.load().allow_nsfw
});

const template = [
  { label: 'Get a random wallpaper', click: App.service.newBackground },
  { label: 'Show gallery...', click: Gallery.show },
  {
    id: 'change_background',
    label: 'Change background each',
    submenu: [
      { label: 'Never', type: 'radio', id: 'never', click: function () { App.setUpdatePeriod('never'); } },
      { label: '24 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('24_hours'); } },
      { label: '12 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('12_hours'); } },
      { label: '6 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('6_hours'); } },
      { label: '4 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('4_hours'); } },
      { label: '2 hours', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('2_hours'); } },
      { label: '1 hour', type: 'radio', id: '1_hour', click: function () { App.setUpdatePeriod('1_hour'); } },
      { label: '30 minutes', type: 'radio', id: '30_min', click: function () { App.setUpdatePeriod('30_min'); } },
      { label: '15 minutes', type: 'radio', id: '15_min', click: function () { App.setUpdatePeriod('15_min'); } },
      { label: '5 minutes', type: 'radio', id: '5_min', click: function () { App.setUpdatePeriod('5_min'); } },
      { label: '1 minute', type: 'radio', id: '1_min', click: function () { App.setUpdatePeriod('1_min'); } },
    ]
  },
  { type: 'separator' },
  { label: 'Options', click: Options.show },
  { type: 'separator' },
  { label: 'Quit', click: App.exit }
];

App.setUpdatePeriod = function(period) {
  App.contextMenu = Menu.buildFromTemplate(template);
  App.contextMenu.items.filter(function (obj) {
    return obj.id == 'change_background';
  })[0].submenu.items.filter(function (obj) {
    return obj.id == period;
  })[0].checked = true;

  App.settings.period = period;
  Settings.save(App.settings);

  clearInterval(interval);
  if (period != 'never') {
    interval = setInterval(function () {
      App.service.newBackground();
    }, CONSTANTS.INTERVALS[period]);
  }
};

App.setWallpaper = function (image) {
  wallpaper.set(image).then(function () {

    tray.setImage(CONSTANTS.ICONS_PATH + '/IconTemplate.png');
    winston.info('[*] Set wallpaper ' + image);

    // Delete the file to comply with 500px API terms
    fs.unlink(image);
  });
};

module.exports = App;

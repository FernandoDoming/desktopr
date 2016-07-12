const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const ipc = electron.ipcMain;

const Logger = require.main.require('./src/main/logger.js');
const Templates = require.main.require('./src/constants/templates.js');
const Desktopr = require.main.require('./src/main/desktopr.js');
const Settings = require.main.require('./src/main/settings.js');
const Gallery = require.main.require('./src/ui/gallery.js');
const Database = require.main.require('./src/main/database.js');
const Options = require.main.require('./src/ui/options.js');
const CONSTANTS = require.main.require('./src/constants/constants.js');

let App = {};

let interval = null;
let settings = Settings.load();

ipc.on('request-favs', function (event, _) {
  let favs = [];
  Database.each('SELECT * FROM favorites ORDER BY date_added DESC;',
    function (row) {
      // Callback for each element
      favs.push(row);
    }, function () {
      // Callback on done
      event.sender.send('got-favs', favs);
    });
});

App.exit = function() {
  Database.close();
  app.quit();
};

App.settings = settings;

App.service = new Desktopr({
  images_path: CONSTANTS.IMAGES_PATH,
  allow_nsfw: Settings.load().allow_nsfw
});

App.setUpdatePeriod = function(period) {
  App.contextMenu = Menu.buildFromTemplate(Templates.buildContextMenuTemplate({
    app: App,
    gallery: Gallery,
    options: Options
  }));
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
    Logger.info('[*] Set wallpaper ' + image);

    // Delete the file to comply with 500px API terms
    fs.unlink(image);
  });
};

module.exports = App;

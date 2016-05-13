var YAML = require('yamljs');
var fs = require('fs');
var winston = require('winston');
var process = require('process');

var CONFIG_DIR = __dirname + '/app/config/';
var SETTINGS_FILE = CONFIG_DIR + '/settings.yml';

var settings = {};
var defaults = {
  open_gallery: true,
  allow_nsfw: true,
  period: 'never'
};

settings.load = function () {
  return YAML.load(SETTINGS_FILE);
};

settings.save = function (settings) {
  var yaml = YAML.stringify(settings);
  fs.writeFile(SETTINGS_FILE, yaml, function (error) {
    if (error) {
      winston.error('[x] Error writting settings');
    }
    winston.info('[*] Settings saved');
  });
};

function initSettings() {
  if (fs.existsSync(SETTINGS_FILE)) return;
  mkdir_p(CONFIG_DIR);
  settings.save(defaults);
}

function mkdir_p(path, root) {
    var dirs = path.split('/'), dir = dirs.shift(), root = (root || '') + dir + '/';

    try { fs.mkdirSync(root); }
    catch (e) {
        //dir wasn't made, something went wrong
        if(!fs.statSync(root).isDirectory()) throw new Error(e);
    }
    return !dirs.length || mkdir_p(dirs.join('/'), root);
}

initSettings();

module.exports = settings;

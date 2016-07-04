const YAML = require('yamljs');
const fs = require('fs');
const Logger = require.main.require('./src/main/logger.js');

const CONSTANTS = require.main.require('./src/constants/constants.js');

let settings = {};

settings.load = function () {
  return YAML.load(CONSTANTS.SETTINGS.FILE);
};

settings.save = function (settings) {
  let yaml = YAML.stringify(settings);
  fs.writeFile(CONSTANTS.SETTINGS.FILE, yaml, function (error) {
    if (error) {
      Logger.error('[x] Error writting settings');
    }
    Logger.info('[*] Settings saved');
  });
};

function initSettings() {
  if (fs.existsSync(CONSTANTS.SETTINGS.FILE)) return;
  mkdir_p(CONSTANTS.SETTINGS.PATH);
  settings.save(CONSTANTS.SETTINGS.DEFAULTS);
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

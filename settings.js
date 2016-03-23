var YAML = require('yamljs');
var fs = require('fs');
var winston = require('winston');

var SETTINGS_FILE = './config/settings.yml';

var settings = {};

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

module.exports = settings;

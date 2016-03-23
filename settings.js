var YAML = require('yamljs');

var settings = {
  load: function () {
    return YAML.load('./config/settings.yml');
  },
};

module.exports = settings;

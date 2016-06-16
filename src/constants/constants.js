var path = require('path');

var constants = {};

constants.PATH = path.dirname(require.main.filename);
constants.IMAGES_PATH = constants.PATH + '/images/';
constants.ICONS_PATH = constants.PATH + '/icons/';

constants.SETTINGS = {};
constants.SETTINGS.PATH = constants.PATH + '/config/';
constants.SETTINGS.FILE = constants.SETTINGS.PATH + '/settings.yml';
constants.SETTINGS.DEFAULTS = {
                                open_gallery: true,
                                allow_nsfw: true,
                                period: 'never',
                                menu_on_alt: false,
                                sources: []
                              };

constants.INTERVALS = {
  '24_hours': 24 * 60 * 60 * 1000,
  '12_hours': 12 * 60 * 60 * 1000,
  '6_hours': 6 * 60 * 60 * 1000,
  '4_hours': 4 * 60 * 60 * 1000,
  '2_hours': 2 * 60 * 60 * 1000,
  '1_hour': 60 * 60 * 1000,
  '30_min': 30 * 60 * 1000,
  '15_min': 15 * 60 * 1000,
  '5_min': 5 * 60 * 1000,
  '1_min': 1 * 60 * 1000,
};

constants.RPP = 50;
constants.FEATURES = ['Editors', 'Popular'];

module.exports = constants;

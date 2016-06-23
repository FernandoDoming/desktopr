const StringsHelper = require('./../../js/helpers/strings_helper.js');

const CATEGORIES = {
  0: 'Uncategorized',
  1: 'Celebrities',
  2: 'Film',
  3: 'Journalism',
  4: 'Nude',
  5: 'Black & White',
  6: 'Still Life',
  7: 'People',
  8: 'Landscapes',
  9: 'City & Architecture',
  10: 'Abstract',
  11: 'Animals',
  12: 'Macro',
  13: 'Travel',
  14: 'Fashion',
  15: 'Commercial',
  16: 'Concert',
  17: 'Sport',
  18: 'Nature',
  19: 'Performing Arts',
  20: 'Family',
  21: 'Street',
  22: 'Underwater',
  23: 'Food',
  24: 'Fine Art',
  25: 'Wedding',
  26: 'Transportation',
  27: 'Urban Exploration',
};

let PhotosHelper = {
  humanizeCategory: function (number) {
    if (typeof number === 'number') {
      return CATEGORIES[number];
    } else {
      return number;
    }
  },

  getUser: function (photo, prop) {
    return {
      key: StringsHelper.humanize(prop).capitalize(),
      value: `${photo[prop].firstname} ${photo[prop].lastname}`,
      extra: {
        userpic_url: photo[prop].userpic_url,
        username : photo[prop].username
      }
    }
  },

  getTags: function (photo, prop) {
    return {
      key: 'tags',
      value: photo[prop]
    }
  },

  getCategory: function (photo, prop) {
    return {
      key: prop.humanize().capitalize(),
      value: PhotosHelper.humanizeCategory(photo[prop])
    }
  },

  getDefault: function (photo, prop) {
    return {
      key: prop.humanize().capitalize(),
      value: StringsHelper.humanize(photo[prop])
    }
  }
};

module.exports = PhotosHelper;

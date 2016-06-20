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
  }
};

module.exports = PhotosHelper;

const electron = require('electron');
const ipc = electron.ipcRenderer;
const API500px = require('500px');
const api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');
const $ = window.$ = window.jQuery = require('jquery');
const Handlebars = require('handlebars');
const Snackbar = require('./../js/snackbar.js');
const Drawer = require('./../js/drawer.js');
const StringsHelper = require('./../js/helpers/strings_helper.js');

const CONSTANTS = require('./../js/constants.js');

let drawer = null;
let snackbar = null;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

ipc.on('request-image', function (event, data) {
  api500px.photos.getById( data.id, { image_size: 2048 }, showcase);

  snackbar = new Snackbar();
  drawer = new Drawer({
    title: 'Details',
    action: {
      class: 'fa fa-desktop',
      callback: function () {
        ipc.send('set-background', { id: data.id });
        snackbar.show(`Setting ${data.name} as the background image`);
      }
    }
  });
});

function showcase(error, results) {
  if (error) { return; }

  let photo = results.photo;

  document.getElementById('showcase').src = photo.image_url;

  for (let key of Object.keys(CONSTANTS.PHOTOS)) {
    let entries = CONSTANTS.PHOTOS[key].map(function (prop) {
      if (photo[prop] != undefined && photo[prop] != '') {
        return {
          key: StringsHelper.humanize(prop.capitalize()),
          value: StringsHelper.humanize(photo[prop])
        }
      }
    }).filter(function(e) { return e; });

    let template = Handlebars.compile( $(`#${key.toLowerCase()}_template`).html() )
    $('#drawer').append(template({
      entries: entries
    }));
  }
}

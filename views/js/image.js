const electron = require('electron');
const ipc = electron.ipcRenderer;
const API500px = require('500px');
const api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');
const $ = window.$ = window.jQuery = require('jquery');
const Handlebars = require('handlebars');
const Vibrant = require('node-vibrant');
const Snackbar = require('./../js/snackbar.js');
const Drawer = require('./../js/drawer.js');
const StringsHelper = require('./../js/helpers/strings_helper.js');
const PhotosHelper = require('./../js/helpers/photos_helper.js');

const CONSTANTS = require('./../js/constants.js');

let drawer = null;
let snackbar = null;

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
});

Handlebars.registerHelper("debug", function(optionalValue) {
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(optionalValue);
  }
});

ipc.on('request-image', function (event, data) {
  api500px.photos.getById( data.id, { image_size: 2048, tags: 1 }, showcase);

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

  let img = document.getElementById('showcase');
  img.src = photo.image_url;
  let vibrant = new Vibrant(img);

  for (let key of Object.keys(CONSTANTS.PHOTOS)) {
    let entries = CONSTANTS.PHOTOS[key].map(function (prop) {
      let fn = PhotosHelper[`get${prop.capitalize()}`] || PhotosHelper.getDefault;
      return fn(photo, prop);
    }).filter(function(e) { return e.value === 0 || e.value });

    let template = Handlebars.compile( $(`#${key.toLowerCase()}_template`).html() )
    $('#drawer').append(template({
      entries: entries
    }));
  }
}

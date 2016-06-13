const electron = require('electron');
const ipc = electron.ipcRenderer;
const API500px = require('500px');
const api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');
const $ = window.$ = window.jQuery = require('jquery');
const Handlebars = require('handlebars');
const Drawer = require('./../js/drawer.js');

const CONSTANTS = require('./../js/constants.js');

let drawer = null;

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

ipc.on('request-image', function (event, data) {
  api500px.photos.getById( data.id, { image_size: 2048 }, showcase);

  drawer = new Drawer({
    title: 'Details',
    action: {
      class: 'fa fa-desktop',
      callback: function () {
        ipc.send('set-background', { id: data.id });
      }
    }
  });
});

function showcase(error, results) {
  if (error) { return; }

  let photo = results.photo;
  let template = Handlebars.compile( $('#description-template').html() );

  document.getElementById('showcase').src = photo.image_url;

  CONSTANTS.PHOTOS.DISPLAYABLE_DETAILS.forEach(function (prop) {
    switch(prop) {
      case 'user':
        $('#drawer').append(template({
          key: 'Author',
          value: `${photo.user.firstname} ${photo.user.lastname}`
        }));
        break;

      default:
        if (photo[prop] !== undefined && photo[prop] !== ''
              && photo[prop] !== null) {
          let html = template({
            key: prop.replace(/_/g, ' ').capitalize(),
            value: photo[prop]
          });

          $('#drawer').append(html);
      }
    }
  });
}

const electron = require('electron');
const ipc = electron.ipcRenderer;
const API500px = require('500px');
const api500px = new API500px('9FNw3T1ywcR5PC0LMsTxrsSm6CH47HAYENQvh81L');

ipc.on('request-image', function (event, data) {
  api500px.photos.getById( data.id, { image_size: 2048 }, showcase);
});

function showcase(error, results) {
  if (error) { return; }

  let photo = results.photo;
  document.getElementById('showcase').src = photo.image_url;
}

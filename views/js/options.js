const ipc = require('electron').ipcRenderer;
const $   = require('jquery');

ipc.on('init-settings', function (sender, settings) {
  $('input[type="checkbox"][data-key="open_gallery"]').attr('checked', settings.open_gallery);
  $('input[type="checkbox"][data-key="allow_nsfw"]').attr('checked', settings.allow_nsfw);
});

ipc.send('request-settings');

$('input[type="checkbox"]').on('click', function () {
  ipc.send('set-option', {
    key: $(this).data('key'),
    value: $(this).is(':checked'),
  });
});

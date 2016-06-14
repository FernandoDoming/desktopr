const ipc = require('electron').ipcRenderer;
const $   = require('jquery');

ipc.on('init-settings', function (sender, settings) {
  $('input[type="checkbox"][data-key="open_gallery"]').attr('checked', settings.open_gallery);
  $('input[type="checkbox"][data-key="allow_nsfw"]').attr('checked', settings.allow_nsfw);
  $('input[type="radio"][data-key="menu_on_alt"][value="' + settings.menu_on_alt + '"]').prop('checked', true);

  settings.sources.forEach(function (e) {
    $(`input[type="checkbox"][data-key="${e}"]`).prop('checked', true);
  });
});

ipc.send('request-settings');

$('#general input[type="checkbox"]').on('click', function () {
  ipc.send('set-option', {
    key: $(this).data('key'),
    value: $(this).is(':checked'),
  });
});

$('#keys input[type="radio"]').on('click', function () {
  ipc.send('set-option', {
    key: $(this).data('key'),
    value: $(this).attr('value') === 'true' ? true : false,
  });
});

$('#sources input[type="checkbox"]').on('click', function () {
  let sources = [];
  $('#sources input:checked').each(function() {
    sources.push($(this).data('key'));
  });

  ipc.send('set-option', {
    key: 'sources',
    value: sources,
  });
});

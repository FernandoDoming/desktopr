const ipc = require('electron').ipcRenderer;
const $   = require('jquery');

ipc.on('init-settings', function (sender, settings) {
  $('input[type="checkbox"][data-key="open_gallery"]').attr('checked', settings.open_gallery);
  $('input[type="checkbox"][data-key="allow_nsfw"]').attr('checked', settings.allow_nsfw);
  $('input[type="radio"][data-key="menu_on_alt"][value="' + settings.menu_on_alt + '"]').prop('checked', true);
  $('#gallery #layout').val(settings.layout);
  $('#gallery #n_columns').val(settings.n_columns);

  settings.sources.forEach(function (e) {
    $(`input[type="checkbox"][data-key="${e}"]`).prop('checked', true);
  });
});

ipc.send('request-settings');

$('.tab-item').click(function () {
  $('.tab-item.active').removeClass('active');
  $(this).addClass('active');
  let tab = $(this).data('key');
  $(`.settings [data-tab]`).css({ display: 'none' });
  $(`.settings [data-tab="${tab}"]`).css({ display: 'block' });
});

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

$('#gallery select').on('change', function () {
  let key = $(this).attr('id');
  ipc.send('set-option', {
    key: key,
    value: $(this).val()
  });
});

$('#gallery #layout').on('change', function () {
  let $nColumns = $('#gallery #n_columns');
  if ($(this).val() === 'columns') {
    $nColumns.prop('disabled', false);
  } else {
    $nColumns.prop('disabled', true);
  }
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

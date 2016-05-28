const snackbarHTML = '<div class="snackbar">' +
                        '<span class="content"></span>' +
                        '<span class="action"></span>' +
                      '</div>';

function Snackbar(opts) {

  let _opts = opts || {};
  this.appendTo = _opts.appendTo || 'body';
  this.timeout = _opts.timeout || 5 * 1000;
  this.interval = null;
  this.showing = false;
  this.self = this;

  this.init = function () {
    document.querySelector(this.appendTo).innerHTML += snackbarHTML;
    this.snackbar = document.querySelector('.snackbar');
    this.content  = document.querySelector('.snackbar .content');
    this.action   = document.querySelector('.snackbar .action');
  };

  this.init();
};

Snackbar.prototype.hide = function (self = this.self) {
  if (self.showing) {
    self.snackbar.className = 'snackbar';
    self.showing = false;
  }
};

Snackbar.prototype.show = function (message, action = {}) {
  let _action = action || {};
  let actionTitle = _action.title || '';
  let actionCallback = _action.callback || function () {};
  let ctx = this;

  this.content.innerHTML = message;
  this.action.innerHTML = actionTitle;
  this.action.addEventListener('click', actionCallback);

  if (!this.showing) {
    this.snackbar.className += ' show';
    this.showing = true;

    this.interval = setTimeout(function () {
      ctx.hide(ctx);
    }, this.timeout);

  } else {

    clearTimeout(this.interval);
    this.interval = setTimeout(function () {
      ctx.hide(ctx);
    }, this.timeout);
  }
};

module.exports = Snackbar;

const snackbarHTML = '<div class="snackbar">' +
                        '<span class="content"></span>' +
                        '<span class="action"></span>' +
                      '</div>';

function Snackbar(opts) {

  let _opts = opts || {};
  let that = this;

  this.appendTo = _opts.appendTo || 'body';
  this.timeout = _opts.timeout || 5 * 1000;
  this.interval = null;
  this.showing = false;

  this.init = function () {
    document.querySelector(this.appendTo).innerHTML += snackbarHTML;
    this.snackbar = document.querySelector('.snackbar');
    this.content  = document.querySelector('.snackbar .content');
    this.action   = document.querySelector('.snackbar .action');
    this.snackbar.addEventListener('mouseover', that.stopHiding);
    this.snackbar.addEventListener('mouseout', function () { that.dismiss(that) });
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

  this.content.innerHTML = message;
  this.action.innerHTML = actionTitle;
  this.action.addEventListener('click', actionCallback);

  if (!this.showing) {
    this.snackbar.className += ' show';
    this.showing = true;
  } else {
    this.stopHiding();
  }
  this.dismiss(this, this.timeout);
};

Snackbar.prototype.stopHiding = function () {
  clearTimeout(this.interval);
};

Snackbar.prototype.dismiss = function (ctx, t = 1000) {
  this.interval = setTimeout(function () {
    ctx.hide(ctx);
  }, t);
};

module.exports = Snackbar;

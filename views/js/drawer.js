const drawerHTML = '<div id="drawer">' +
                      '<div class="top-bar">' +
                        '<i id="close-drawer" class="fa fa-arrow-left"></i>' +
                        '<span class="title"></span>' +
                        '<div class="drawer-actions align-right">' +
                          '<i id="drawer-action" class=""></i>' +
                        '</div>' +
                      '</div>' +
                    '</div>';

function Drawer(opts) {

  let _opts = opts || {};
  let that = this;

  this.appendTo = _opts.appendTo || 'body';
  this.title = _opts.title || '';
  this.action = _opts.action || {};

  this.init = function () {
    document.querySelector(this.appendTo).innerHTML += drawerHTML;
    document.querySelector('#drawer .title').innerHTML = this.title;
    document.getElementById('open-drawer').addEventListener('click', function () {
      that.open();
    });
    document.getElementById('close-drawer').addEventListener('click', function () {
      that.close();
    });
    document.getElementById('drawer-action').className += ` ${this.action.class}`;
    document.getElementById('drawer-action').addEventListener('click', this.action.callback || function () {});
  };

  this.init();
};

Drawer.prototype.open = function () {
  document.getElementById('drawer').className += ' show';
};

Drawer.prototype.close = function () {
  document.getElementById('drawer').className = '';
};

module.exports = Drawer;

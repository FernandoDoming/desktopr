const drawerHTML = '<div id="drawer">' +
                      '<i class="fa fa-times" id="close-drawer"></i>' +
                    '</div>';

function Drawer(opts) {

  let _opts = opts || {};
  let that = this;

  this.appendTo = _opts.appendTo || 'body';

  this.init = function () {
    document.querySelector(this.appendTo).innerHTML += drawerHTML;
    document.getElementById('open-drawer').addEventListener('click', function () {
      that.open();
    });
    document.getElementById('close-drawer').addEventListener('click', function () {
      that.close();
    });
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

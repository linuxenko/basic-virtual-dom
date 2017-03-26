/** @jsx h */
var h = require('./h').h;
var diff = require('./diff').diff;
var patch = require('./patch').patch;

var component = function (options) {
  this.data = {};
  this.element = undefined;

  var initialDom = h(
    'div', {
      id: 'application',
      className: 'main-app'
    }
  );

  if (typeof options === 'object') {
    if ('data' in options) {
      this.data = options['data'];
    }
    if ('el' in options) {
      // TODO: Capture element by class, id....
      this.element = options['el'];
      document.getElementById(this.element)
        .appendChild(initialDom.render());

    }
    if ('render' in options) {
      var remd = options.render();
      var diffs = diff(initialDom, remd);
      patch(initialDom, diffs);
    }
  }

  this.getData = function () {
    return this.data;
  };
};

module.exports = component;
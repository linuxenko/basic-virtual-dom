/*
 * Element
 */

/**
 * General tree
 *
 * /** @jsx h * /
 *
 * @name h
 * @function
 * @access public
 */
var h = function(argv) {
  if (!(this instanceof h)) {
    return new h(arguments);
  }
  this.tag = argv[0].toLowerCase();
  this.props = argv[1] || {};

  if (argv.length > 2) {
    if (typeof argv[2] !== 'object') {
      this.children = [createTextNode(argv[2])];
    } else {
      this.children = [].slice.call(argv, 2, argv.length)
        .map(function(n) {
          if (typeof n === 'string') {
            return createTextNode(n);
          } else {
            return n;
          }
        });
    }
  }
};

/**
 * Tree renderer
 *
 * @name render
 * @function
 * @access public
 * @param {Boolean} fasle - do not save DOM into tree
 */
h.prototype.render = function(node, parent) {
  node = node || this;

  node.el = createElement(node.tag ? node : this, parent);

  var children = node.children;

  if (typeof children === 'object') {
    for (var i = 0; i < children.length; i++) {
      node.el.appendChild(this.render(children[i], node.el));
    }
  }

  return node.el;
};

h.prototype.setProp = function(name, value) {
  if (name === 'className') {
    this.el.setAttribute('class', value);
  } else if (name.match(/^on/)) {
    this.addEvent(name, value);
  } else if (name === 'ref') {
    if (typeof value === 'function') {
      value(this.el);
    }
  } else if (typeof value === 'boolean') {
    this.el.setAttribute(name, value);
    this.el[name] = Boolean(value);
  } else {
    this.el.setAttribute(name, value);
  }

  this.props[name] = value;
};

h.prototype.setProps = function(props) {
  var propNames = Object.keys(props);

  for (var i = 0; i < propNames.length; i++) {
    var prop = propNames[i];
    this.setProp(prop, props[prop]);
  }
};

h.prototype.rmProp = function(name) {
  if (name === 'className') {
    this.el.removeAttribute('class');
  } else if (name.match(/^on/)) {
    this.removeEvent(name);
  } else if (name === 'ref') {
    /* Nothing to do */
  } else if (typeof value === 'boolean') {
    this.el.removeAttribute(name);
    delete this.el[name];
  } else {
    this.el.removeAttribute(name);
  }

  delete this.props[name];
};

h.prototype.addEvent = function(name, listener) {
  name = name.slice(2).toLowerCase();

  this.listeners = this.listeners || {};

  if (name in this.listeners) {
    this.removeEvent(name);
  }

  this.listeners[name] = listener;
  this.el.addEventListener(name, listener);
};

h.prototype.removeEvent = function(name) {
  if (name in this.listeners) {
    this.el.removeEventListener(name, this.listeners[name]);
    delete this.listeners[name];
  }
};

var createTextNode = function(text) {
  return {
    tag : 'text',
    children : String(text)
  };
};

var createElement = function(node, parent) {
  var el = node.tag === 'text' ?
    document.createTextNode(node.children) :
    document.createElement(node.tag);

  node.el = el;


  if (typeof node.props !== 'undefined') {
    node.setProps(node.props);
  }

  if (typeof parent !== 'undefined') {
    parent.appendChild(el);
  }

  return el;
};

exports.h = h;
exports.createElement = createElement;

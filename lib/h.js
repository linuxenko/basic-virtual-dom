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

  if (argv[0] instanceof h) {
    return argv[0];
  }

  this.tag = argv[0].toLowerCase();
  this.props = argv[1] || {};

  if (argv[2] === null || argv[2] === undefined) {
    return;
  }

  if (argv.length > 2) {
    if (typeof argv[2] !== 'object' && argv.length === 3) {
      this.children = [_createTextNode(argv[2])];
    } else if (Array.isArray(argv[2])) {
      this.children = argv[2];
    } else {
      this.children = [].slice.call(argv, 2, argv.length)
        .filter(function(n) {
          return n !== null && n !== undefined;
        })
        .map(function(n) {
          if (!(n instanceof h)) {
            return _createTextNode(n);
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
  if (typeof this.el !== 'undefined') {
    if (name === 'className') {
      this.el.setAttribute('class', value);
    } else if (name === 'style' && typeof value !== 'string') {
      this.el.setAttribute('style', _stylePropToString(value));
    } else if (name.match(/^on/)) {
      this.addEvent(name, value);
    } else if (name === 'ref') {
      if (typeof value === 'function') {
        value(this.el);
      }
    } else if (typeof value === 'boolean' || value === 'true') {
      this.el.setAttribute(name, value);
      this.el[name] = Boolean(value);
    } else {
      this.el.setAttribute(name, value);
    }
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
  if (typeof this.el !== 'undefined') {
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

h.prototype.clone = function() {
  var node = {
    tag : String(this.tag),
    props : _cloneProps(this.props)
  };

  if (typeof this.children !== 'undefined') {
    node.children = this.tag === 'text' ? String(this.children) :
      this.children.map(function(child) {
        return child.tag === 'text' ? _createTextNode(child.children) : child.clone();
      });
  }

  return h(node.tag, node.props, node.children);
};

var _cloneProps = function(props, keepRefs) {
  if (typeof keepRefs === 'undefined') {
    keepRefs = true;
  }

  var attrs = Object.keys(props), i, name, cloned = {};

  for (i = 0; i < attrs.length; i++) {
    name = attrs[i];

    if (typeof props[name] === 'string') {
      cloned[name] = String(props[name]);
    } else if (typeof props[name] === 'function' && keepRefs === true) {
      cloned[name] = props[name];
    } else if (typeof props[name] === 'boolean') {
      cloned[name] = Boolean(props[name]);
    } else if (typeof props[name] === 'object') {
      cloned[name] = _cloneProps(props[name]);
    }
  }

  return cloned;
};

var _stylePropToString = function(props) {
  var out = '';
  var attrs = Object.keys(props);

  for (var i = 0; i < attrs.length; i++) {
    out += attrs[i].replace(/([A-Z])/g, '-$1').toLowerCase();
    out += ':';
    out += props[attrs[i]];
    out += ';';
  }

  return out;
};

var _createTextNode = function(text) {
  return {
    tag : 'text',
    children : String(text)
  };
};

var createElement = function(node, parent) {
  node.el = node.tag === 'text' ?
    document.createTextNode(node.children) :
    document.createElement(node.tag);

  if (typeof node.props !== 'undefined') {
    node.setProps(node.props);
  }

  if (typeof parent !== 'undefined') {
    parent.appendChild(node.el);
  }

  return node.el;
};

exports.h = h;
exports.createElement = createElement;

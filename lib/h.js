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
      this.children = [textNode(argv[2])];
    } else {
      this.children = [].slice.call(argv, 2, argv.length)
        .map(function(n) {
          if (typeof n === 'string') {
            return textNode(n);
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
  if (node === false) {
    node = { };
  } else {
    node = node || this;
  }

  node.el = createElement(node.tag ? node : this, parent);

  var children = node.children || this.children;

  if (typeof children === 'object') {
    for (var i = 0; i < children.length; i++) {
      node.el.appendChild(this.render(children[i], node.el));
    }
  }

  return node.el;
};

var textNode = function(text) {
  return {
    tag : 'text',
    children : String(text)
  };
};

var setProp = function(el, name, value) {
  if (name === 'className') {
    el.setAttribute('class', value);
  } else if (name.match(/^on/)) {
    /* TODO: Event handling */
  } else if (name === 'ref') {
    /* TODO: Handle referals */
  } else if (typeof value === 'boolean') {
    el.setAttribute(name, value);
    el[name] = Boolean(value);
  } else {
    el.setAttribute(name, value);
  }
};

var setProps = function(el, props) {
  Object.keys(props).forEach(function(prop) {
    setProp(el, prop, props[prop]);
  });
};

var rmProp = function(el, name) {
  if (name === 'className') {
    el.removeAttribute('class');
  } else if (name.match(/^on/)) {
    /* TODO: Event handling */
  } else if (name === 'ref') {
    /* TODO: Handle referals */
  } else if (typeof value === 'boolean') {
    el.removeAttribute(name);
    delete el[name];
  } else {
    el.removeAttribute(name);
  }
};

var createElement = function(node, parent) {
  var el = node.tag === 'text' ?
    document.createTextNode(node.children) :
    document.createElement(node.tag);

  if (typeof node.props !== 'undefined') {
    setProps(el, node.props);
  }

  if (typeof parent !== 'undefined') {
    parent.appendChild(el);
  }

  return el;
};

exports.h = h;
exports.createElement = createElement;
exports.setProps = setProps;
exports.setProp = setProp;
exports.rmProp = rmProp;

/*
 * Patch
 */

var PATCH_CREATE  = require('./diff').PATCH_CREATE;
var PATCH_REMOVE  = require('./diff').PATCH_REMOVE;
var PATCH_REPLACE = require('./diff').PATCH_REPLACE;
var PATCH_REORDER = require('./diff').PATCH_REORDER;
var PATCH_PROPS   = require('./diff').PATCH_PROPS;

var createElement = require('./h').createElement;
var rmProp        = require('./h').rmProp;
var setProp       = require('./h').setProp;
var setProps       = require('./h').setProps;

/**
 * Patch DOM and virtual tree
 *
 * @name patch
 * @function
 * @access public
 * @param {Object} tree Tree to patch
 * @param {Array} patches Array of patches
 */
var patch = function(tree, patches) {
  for (var i = 0; i < patches.length; i++) {
    var p = patches[i];

    switch(p.t) {
      case PATCH_REORDER:
        patchReorder(p);
        break;
      case PATCH_CREATE:
        patchCreate(p);
        break;
      case PATCH_REMOVE:
        patchRemove(p);
        break;
      case PATCH_REPLACE:
        patchReplace(p);
        break;
      case PATCH_PROPS:
        patchProps(p);
        break;
    }
  }
};

var patchReplace = function(p) {
  p.node.children = p.with.children;
  p.node.el.nodeValue = String(p.with.children);
};

var patchReorder = function(p) {
  if (p.node.el.childNodes.length - 1 <= p.to) {
    p.node.el.appendChild(p.item.el);
  } else {
    p.node.el.insertBefore(p.item.el, p.node.el.childNodes[p.to]);
  }

  p.node.children.splice(p.to, 0, p.node.children.splice(p.from, 1)[0]);
};

var patchCreate = function(p) {
  var element = p.item.tag === 'text' ?
    createElement(p.item) : p.item.render(false);

  if (p.node.el.childNodes.length - 1 <= p.to) {
    p.node.children.push(p.item);
    p.node.el.appendChild(element);
  } else {
    p.node.children.splice(p.to, 0, p.item);
    p.node.el.insertBefore(element, p.node.el.childNodes[p.to]);
  }
};

var patchRemove = function(p) {
  p.node.el.removeChild(p.item.el);

  for (var i = 0; i < p.node.children.length; i++) {
    if (p.node.children[i] === p.item) {
      p.node.children.splice(i, 1);
    }
  }
};

var patchProps = function(p) {
  if ('copy' in p) {
    p.node.props = p.props;
    [].slice.call(p.node.el.attributes).forEach(function(attr) {
      p.node.el.removeAttribute(attr.name);
    });
    setProps(p.node.el, p.node.props);
  }

  var i;

  if ('remove' in p) {
    for (i = 0; i < p.remove.length; i++) {
      rmProp(p.node.el, p.remove[i].name);
      delete p.node.props[p.remove[i].name];
    }
    return;
  }

  if ('change' in p) {
    for (i = 0; i < p.change.length; i++) {
      setProp(p.node.el, p.change[i].name, p.change[i].value);
      p.node.props[p.change[i].name] = p.change[i].value;
    }
    return;
  }
};

exports.patch = patch;

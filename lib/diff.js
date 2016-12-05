/*
 * Diff
 */

var PATCH_CREATE  = 0;
var PATCH_REMOVE  = 1;
var PATCH_REPLACE = 2;
var PATCH_REORDER = 3;
var PATCH_PROPS   = 4;

/**
 * Diff two virtual dom trees
 *
 * @name diff
 * @function
 * @access public
 * @param {Object} oldNode virtual tree to compare
 * @param {Object} newNode virtual tree to compare with
 */
var diff = function(oldNode, newNode) {

  if (typeof oldNode === 'undefined' ||typeof newNode === 'undefined') {
    throw new Error('cannot diff undefined nodes');
  }

  if (!isNodeSame(oldNode, newNode)) {
    throw new Error('unable create diff replace for root node');
  }

  return diffTree(oldNode, newNode, []);
};

var isNodeSame = function(a, b) {
  return a.tag === b.tag;
};

var diffTree = function(a, b, patches) {

  diffProps(a, b, patches);

  if (b.tag === 'text') {
    if (b.children !== a.children) {
      patches.push({ t : PATCH_REPLACE, node : a, with : b });
    }
    return;
  }

  if (Array.isArray(b.children)) {
    diffChild(a.children, b.children, a,  patches);
  }

  return patches;
};

var diffChild = function(a, b, pn, patches) {
  var reorderMap = [], i, j, found;

  for (i = 0; i < b.length; i++) {
    found = false;

    for (j = 0; j < a.length; j++) {
      if (isNodeSame(a[j], b[i]) && reorderMap.indexOf(a[j]) === -1) {
        if (j !== i) {
          patches.push({ t : PATCH_REORDER, from : j, to : i, node : nodeId(pn), item : nodeId(a[j])});
        }
        reorderMap.push(a[j]);

        diffTree(a[j], b[i], patches);
        found = true;
        break;
      }
    }

    if (found === false) {
      reorderMap.push(null);
      patches.push({ t : PATCH_CREATE, to : i, node : nodeId(pn), item : nodeId(b[i])});
    }
  }

  for (i = 0; i < a.length; i++) {
    if (reorderMap.indexOf(a[i]) === -1) {
      patches.push({ t: PATCH_REMOVE, from : i, node : nodeId(pn), item : nodeId(a[i])});
    }
  }
};

var diffProps = function(a, b, patches) {
  if (!a || !b || !a.props && !b.props) {
    return;
  }

  var toChange = [];
  var toRemove = [];
  var battrs = Object.keys(b.props);
  var aattrs = Object.keys(a.props);
  var i;

  for (i = 0; i < battrs.length || i < aattrs.length; i++) {
    if (i < battrs.length) {
      if (!(battrs[i] in a.props) || b.props[battrs[i]] !== a.props[battrs[i]]) {
        toChange.push({ name : battrs[i], value : b.props[battrs[i]] });
      }
    }

    if (i < aattrs.length) {
      if (!(aattrs[i] in b.props)) {
        toRemove.push({ name : aattrs[i] });
      }
    }
  }

  if (toRemove.length > 0) {
    patches.push({ t : PATCH_PROPS, remove : toRemove, node : a });
  }

  if (toChange.length > 0) {
    patches.push({ t : PATCH_PROPS, change : toChange, node : a });
  }
};

var nodeId = function(node) {
  return node;
};

exports.PATCH_CREATE  = PATCH_CREATE;
exports.PATCH_REMOVE  = PATCH_REMOVE;
exports.PATCH_REPLACE = PATCH_REPLACE;
exports.PATCH_REORDER = PATCH_REORDER;
exports.PATCH_PROPS   = PATCH_PROPS;
exports.diff = diff;

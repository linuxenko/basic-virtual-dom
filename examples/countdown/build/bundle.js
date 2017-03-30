/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(1);
	
	var _ = __webpack_require__(2);
	
	/* coundown gist from https://gist.github.com/loremipson/8834955 */
	var date = new Date(),
	    month = date.getMonth(),
	    day = date.getDate(),
	    weekDay = date.getDay();
	
	var hours = {
	  start: new Date(date.getFullYear(), month, day),
	  end: new Date(date.getFullYear(), month, day)
	};
	
	// weekDay var [0 = sun, 1 = mon, 2 = tues ... 5 = fri 6 = sat]
	
	// If it's Monday - Friday
	if (weekDay >= 1 && weekDay <= 5) {
	
	  // Start at 7am, end at 8pm
	  hours.start.setHours(7);
	  hours.end.setHours(20);
	
	  // If it's Saturday
	} else if (weekDay == 6) {
	
	  // Start at 8am, end at 8pm
	  hours.start.setHours(8);
	  hours.end.setHours(20);
	
	  // If it's Sunday
	} else {
	
	  // Start at 9am, end at 6pm
	  hours.start.setHours(9);
	  hours.end.setHours(18);
	}
	
	function countDown() {
	  var date = new Date(),
	      countHours = ('0' + (hours.end.getHours() - date.getHours())).substr(-2),
	      countMinutes = ('0' + (59 - date.getMinutes())).substr(-2),
	      countSeconds = ('0' + (59 - date.getSeconds())).substr(-2);
	
	  return { h: countHours, m: countMinutes, s: countSeconds };
	}
	
	/** @jsx h */
	
	var initialDom = (0, _.h)(
	  'div',
	  null,
	  (0, _.h)(
	    'div',
	    null,
	    (0, _.h)(
	      'h3',
	      null,
	      'Counter'
	    )
	  )
	);
	
	document.getElementById('application').appendChild(initialDom.render());
	
	setInterval(function () {
	  var cd = countDown();
	  var countDownDom = (0, _.h)(
	    'div',
	    null,
	    (0, _.h)(
	      'div',
	      null,
	      (0, _.h)(
	        'h3',
	        null,
	        'Day Countdown'
	      )
	    ),
	    (0, _.h)(
	      'div',
	      { className: 'clock' },
	      (0, _.h)(
	        'strong',
	        null,
	        cd.h
	      ),
	      ' :\xA0',
	      (0, _.h)(
	        'strong',
	        null,
	        cd.m
	      ),
	      ' :\xA0',
	      (0, _.h)(
	        'strong',
	        null,
	        cd.s
	      )
	    )
	  );
	
	  var diffs = (0, _.diff)(initialDom, countDownDom);
	  (0, _.patch)(initialDom, diffs);
	}, 1000);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "index.html";

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports.h = __webpack_require__(3).h;
	exports.diff = __webpack_require__(4).diff;
	exports.patch = __webpack_require__(5).patch;
	
	exports.PATCH_CREATE = __webpack_require__(4).PATCH_CREATE;
	exports.PATCH_REMOVE = __webpack_require__(4).PATCH_REMOVE;
	exports.PATCH_REPLACE = __webpack_require__(4).PATCH_REPLACE;
	exports.PATCH_REORDER = __webpack_require__(4).PATCH_REORDER;
	exports.PATCH_PROPS = __webpack_require__(4).PATCH_PROPS;

/***/ },
/* 3 */
/***/ function(module, exports) {

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
	var H = function (argv) {
	  if (!(this instanceof H)) {
	    if (typeof argv === 'function') {
	      return argv.apply(argv, [].slice.call(arguments, 1, arguments.length));
	    }
	    return new H(arguments);
	  }
	
	  if (argv[0] instanceof H) {
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
	      this.children = [].concat.apply([], [].slice.call(argv, 2, argv.length)).filter(function (n) {
	        return n !== null && n !== undefined && n !== false;
	      }).map(function (n) {
	        if (!(n instanceof H)) {
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
	H.prototype.render = function (node, parent) {
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
	
	H.prototype.setProp = function (name, value) {
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
	
	H.prototype.setProps = function (props) {
	  var propNames = Object.keys(props);
	
	  for (var i = 0; i < propNames.length; i++) {
	    var prop = propNames[i];
	    this.setProp(prop, props[prop]);
	  }
	};
	
	H.prototype.rmProp = function (name) {
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
	
	H.prototype.addEvent = function (name, listener) {
	  name = name.slice(2).toLowerCase();
	
	  this.listeners = this.listeners || {};
	
	  if (name in this.listeners) {
	    this.removeEvent(name);
	  }
	
	  this.listeners[name] = listener;
	  this.el.addEventListener(name, listener);
	};
	
	H.prototype.removeEvent = function (name) {
	  name = name.replace(/^on/, '').toLowerCase();
	  if (name in this.listeners) {
	    this.el.removeEventListener(name, this.listeners[name]);
	    delete this.listeners[name];
	  }
	};
	
	H.prototype.clone = function () {
	  var node = {
	    tag: String(this.tag),
	    props: _cloneProps(this.props)
	  };
	
	  if (typeof this.children !== 'undefined') {
	    node.children = this.tag === 'text' ? String(this.children) : this.children.map(function (child) {
	      return child.tag === 'text' ? _createTextNode(child.children) : child.clone();
	    });
	  }
	
	  return H(node.tag, node.props, node.children);
	};
	
	var _cloneProps = function (props, keepRefs) {
	  if (typeof keepRefs === 'undefined') {
	    keepRefs = true;
	  }
	
	  var attrs = Object.keys(props);
	  var i;
	  var name;
	  var cloned = {};
	
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
	
	var _stylePropToString = function (props) {
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
	
	var _createTextNode = function (text) {
	  return {
	    tag: 'text',
	    children: String(text)
	  };
	};
	
	var createElement = function (node, parent) {
	  node.el = node.tag === 'text' ? document.createTextNode(node.children) : document.createElement(node.tag);
	
	  if (typeof node.props !== 'undefined') {
	    node.setProps(node.props);
	  }
	
	  if (typeof parent !== 'undefined') {
	    parent.appendChild(node.el);
	  }
	
	  return node.el;
	};
	
	exports.h = H;
	exports.createElement = createElement;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
	 * Diff
	 */
	
	var PATCH_CREATE = 0;
	var PATCH_REMOVE = 1;
	var PATCH_REPLACE = 2;
	var PATCH_REORDER = 3;
	var PATCH_PROPS = 4;
	
	/**
	 * Diff two virtual dom trees
	 *
	 * @name diff
	 * @function
	 * @access public
	 * @param {Object} oldNode virtual tree to compare
	 * @param {Object} newNode virtual tree to compare with
	 */
	var diff = function (oldNode, newNode) {
	  if (typeof oldNode === 'undefined' || typeof newNode === 'undefined') {
	    throw new Error('cannot diff undefined nodes');
	  }
	
	  if (!_isNodeSame(oldNode, newNode)) {
	    throw new Error('unable create diff replace for root node');
	  }
	
	  return _diffTree(oldNode, newNode, []);
	};
	
	/**
	 * Tree walker function
	 *
	 * @name _diffTree
	 * @function
	 * @access private
	 * @param {} a
	 * @param {} b
	 * @param {} patches
	 */
	var _diffTree = function (a, b, patches) {
	  _diffProps(a, b, patches);
	
	  if (b.tag === 'text') {
	    if (b.children !== a.children) {
	      patches.push({ t: PATCH_REPLACE, node: a, with: b });
	    }
	    return;
	  }
	
	  if (Array.isArray(b.children)) {
	    _diffChild(a.children, b.children, a, patches);
	  } else if (Array.isArray(a.children)) {
	    for (var i = 0; i < a.children.length; i++) {
	      patches.push({ t: PATCH_REMOVE, from: i, node: _nodeId(a), item: _nodeId(a.children[i]) });
	    }
	  }
	
	  return patches;
	};
	
	/**
	 * Tree children diffings
	 *
	 * @name _diffChild
	 * @function
	 * @access private
	 * @param {} a
	 * @param {} b
	 * @param {} pn
	 * @param {} patches
	 */
	var _diffChild = function (a, b, pn, patches) {
	  var reorderMap = [];
	  var i;
	  var j;
	  var found;
	
	  for (i = 0; i < b.length; i++) {
	    found = false;
	
	    if (!a) {
	      if (!pn.children) {
	        pn.children = [];
	      }
	
	      if (b[i].tag === 'text') {
	        patches.push({ t: PATCH_CREATE, to: i, node: _nodeId(pn), item: _nodeId(b[i]) });
	      } else {
	        patches.push({ t: PATCH_CREATE, to: i, node: _nodeId(pn), item: _nodeId(b[i].clone()) });
	      }
	      continue;
	    }
	
	    for (j = 0; j < a.length; j++) {
	      if (_isNodeSame(a[j], b[i]) && reorderMap.indexOf(a[j]) === -1) {
	        if (j !== i) {
	          patches.push({ t: PATCH_REORDER, from: j, to: i, node: _nodeId(pn), item: _nodeId(a[j]) });
	        }
	        reorderMap.push(a[j]);
	
	        _diffTree(a[j], b[i], patches);
	        found = true;
	        break;
	      }
	    }
	
	    if (found === false) {
	      reorderMap.push(null);
	      patches.push({ t: PATCH_CREATE, to: i, node: _nodeId(pn), item: b[i].tag === 'text' ? _nodeId(b[i]) : _nodeId(b[i].clone()) });
	    }
	  }
	
	  if (!a) return;
	
	  for (i = 0; i < a.length; i++) {
	    if (reorderMap.indexOf(a[i]) === -1) {
	      patches.push({ t: PATCH_REMOVE, from: i, node: _nodeId(pn), item: _nodeId(a[i]) });
	    }
	  }
	};
	
	/**
	 * Props diffings
	 *
	 * @name _diffProps
	 * @function
	 * @access private
	 * @param {} a
	 * @param {} b
	 * @param {} patches
	 * @param {} type
	 */
	var _diffProps = function (a, b, patches) {
	  if (!a || !b || !a.props && !b.props) {
	    return;
	  }
	
	  var toChange = [];
	  var toRemove = [];
	  var battrs = Object.keys(b.props);
	  var aattrs = Object.keys(a.props);
	  var aattrsLen = aattrs.filter(function (attr) {
	    return attr !== 'ref' && !attr.match(/^on/);
	  }).length;
	  var i;
	
	  if (a.el && a.el.attributes.length !== aattrsLen) {
	    for (i = 0; i < a.el.attributes.length; i++) {
	      var attr = a.el.attributes[i];
	      var name = attr.name;
	
	      if (name === 'class') {
	        name = 'className';
	      }
	
	      if (!(name in aattrs)) {
	        a.props[name] = attr.value;
	      }
	
	      if (attr.value !== a.props[name]) {
	        a.props[name] = attr.value;
	      }
	    }
	    aattrs = Object.keys(a.props);
	  }
	
	  for (i = 0; i < battrs.length || i < aattrs.length; i++) {
	    if (i < battrs.length) {
	      if (!(battrs[i] in a.props) || b.props[battrs[i]] !== a.props[battrs[i]]) {
	        toChange.push({ name: battrs[i], value: b.props[battrs[i]] });
	      }
	    }
	
	    if (i < aattrs.length) {
	      if (!(aattrs[i] in b.props)) {
	        toRemove.push({ name: aattrs[i] });
	      }
	    }
	  }
	
	  if (toRemove.length > 0) {
	    patches.push({ t: PATCH_PROPS, remove: toRemove, node: _nodeId(a) });
	  }
	
	  if (toChange.length > 0) {
	    patches.push({ t: PATCH_PROPS, change: toChange, node: _nodeId(a) });
	  }
	};
	
	/**
	 * Node identifier
	 *
	 * @name _nodeId
	 * @function
	 * @access private
	 * @param {} node
	 */
	var _nodeId = function (node) {
	  return node;
	};
	
	/**
	 * Nodes comparison
	 *
	 * @name _isNodeSame
	 * @function
	 * @access private
	 * @param {} a
	 * @param {} b
	 */
	var _isNodeSame = function (a, b) {
	  return a.tag === b.tag;
	};
	
	exports.PATCH_CREATE = PATCH_CREATE;
	exports.PATCH_REMOVE = PATCH_REMOVE;
	exports.PATCH_REPLACE = PATCH_REPLACE;
	exports.PATCH_REORDER = PATCH_REORDER;
	exports.PATCH_PROPS = PATCH_PROPS;
	exports.diff = diff;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Patch
	 */
	
	var PATCH_CREATE = __webpack_require__(4).PATCH_CREATE;
	var PATCH_REMOVE = __webpack_require__(4).PATCH_REMOVE;
	var PATCH_REPLACE = __webpack_require__(4).PATCH_REPLACE;
	var PATCH_REORDER = __webpack_require__(4).PATCH_REORDER;
	var PATCH_PROPS = __webpack_require__(4).PATCH_PROPS;
	
	var createElement = __webpack_require__(3).createElement;
	
	/**
	 * Patch DOM and virtual tree
	 *
	 * @name patch
	 * @function
	 * @access public
	 * @param {Object} tree Tree to patch
	 * @param {Array} patches Array of patches
	 */
	var patch = function (tree, patches) {
	  var render = true;
	
	  if (typeof tree.el === 'undefined') {
	    render = false;
	  }
	
	  for (var i = 0; i < patches.length; i++) {
	    var p = patches[i];
	
	    switch (p.t) {
	      case PATCH_REORDER:
	        _patchReorder(p, render);
	        break;
	      case PATCH_CREATE:
	        _patchCreate(p, render);
	        break;
	      case PATCH_REMOVE:
	        _patchRemove(p, render);
	        break;
	      case PATCH_REPLACE:
	        _patchReplace(p, render);
	        break;
	      case PATCH_PROPS:
	        _patchProps(p, render);
	        break;
	    }
	  }
	};
	
	/**
	 * Replace existen node content
	 *
	 * @name patchReplace
	 * @function
	 * @access private
	 */
	var _patchReplace = function (p, render) {
	  p.node.children = String(p.with.children);
	
	  if (render === true) {
	    p.node.el.nodeValue = String(p.with.children);
	  }
	};
	
	/**
	 * Reorder existen node
	 *
	 * @name patchReorder
	 * @function
	 * @access private
	 */
	var _patchReorder = function (p, render) {
	  if (render === true) {
	    p.node.el.insertBefore(p.item.el, p.node.el.childNodes[p.to]);
	  }
	
	  p.node.children.splice(p.to, 0, p.node.children.splice(p.node.children.indexOf(p.item), 1)[0]);
	};
	
	/**
	 * Create new tree node
	 *
	 * @name patchCreate
	 * @function
	 * @access private
	 */
	var _patchCreate = function (p, render) {
	  var element;
	
	  if (render === true) {
	    element = p.item.tag === 'text' ? createElement(p.item) : p.item.render();
	  }
	
	  if (p.node.children.length - 1 < p.to) {
	    p.node.children.push(p.item);
	
	    if (render === true) {
	      p.node.el.appendChild(element);
	    }
	  } else {
	    p.node.children.splice(p.to, 0, p.item);
	
	    if (render === true) {
	      p.node.el.insertBefore(element, p.node.el.childNodes[p.to]);
	    }
	  }
	};
	
	/**
	 * Remove tree node
	 *
	 * @name patchRemove
	 * @function
	 * @access private
	 */
	var _patchRemove = function (p, render) {
	  if (render === true) {
	    p.node.el.removeChild(p.item.el);
	  }
	
	  for (var i = 0; i < p.node.children.length; i++) {
	    if (p.node.children[i] === p.item) {
	      p.node.children.splice(i, 1);
	    }
	  }
	};
	
	/**
	 * Replace props
	 *
	 * @name _patchProps
	 * @function
	 * @access private
	 */
	var _patchProps = function (p) {
	  var i;
	
	  if ('remove' in p) {
	    for (i = 0; i < p.remove.length; i++) {
	      p.node.rmProp(p.remove[i].name);
	    }
	    return;
	  }
	
	  if ('change' in p) {
	    for (i = 0; i < p.change.length; i++) {
	      p.node.setProp(p.change[i].name, p.change[i].value);
	    }
	    return;
	  }
	};
	
	exports.patch = patch;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map
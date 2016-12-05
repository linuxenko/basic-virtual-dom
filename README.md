### Simple virtual-dom implementation
[![Build Status](https://travis-ci.org/linuxenko/basic-virtual-dom.svg?branch=master)](https://travis-ci.org/linuxenko/basic-virtual-dom) [![Coverage Status](https://coveralls.io/repos/github/linuxenko/basic-virtual-dom/badge.svg?branch=master)](https://coveralls.io/github/linuxenko/basic-virtual-dom?branch=master)

### Features
 
### Example

Simple day countdown example 
```javascript
/** @jsx h */

import {h, patch, diff} from '../../';

var initialDom = (
  <div>
    <div><h3>Counter</h3></div>
  </div>
);

document.getElementById('application')
  .appendChild(initialDom.render());

setInterval(function() {
  var cd = countDown();
  var countDownDom = (
    <div>
      <div><h3>Day Countdown</h3></div>
      <div className="clock">
        <strong>{cd.h}</strong> :&nbsp;
        <strong>{cd.m}</strong> :&nbsp;
        <strong>{cd.s}</strong>
      </div>
    </div>
  );

  var diffs = diff(initialDom, countDownDom);
  patch(initialDom, diffs);

}, 1000);
```
[![Example](https://raw.githubusercontent.com/linuxenko/basic-virtual-dom/master/examples/misc/inspect.gif)](https://raw.githubusercontent.com/linuxenko/basic-virtual-dom/master/examples/misc/inspect.gif)

### TODO

### License
MIT (c) Svetlana Linuxenko

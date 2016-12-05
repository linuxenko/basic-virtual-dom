var h = require('../../').h;

exports.a = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  h(
    'div',
    null,
    'text'
  )
);

exports.a1 = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  'text'
);

exports.a2 = h(
  'div',
  { id: 'application', className: 'no-class' },
  h(
    'div',
    null,
    'changed'
  )
);

exports.b = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  'text'
);

exports.c = h(
  'div',
  { id: 'application', className: 'test-class test-class2' },
  h(
    'div',
    null,
    'changed'
  )
);

exports.d = h(
  'div',
  null,
  h(
    'span',
    { id : 'text-node', className : 'text-node' },
    'node-text'
  )
);

exports.e = h(
  'div',
  { 'data-name' : 'to remove',  className : 'test-class' },
  h(
    'div',
    null,
    'changed'
  )
);


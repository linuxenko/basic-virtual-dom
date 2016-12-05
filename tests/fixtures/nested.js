var h = require('../../').h;

exports.a = h(
  'div',
  { id: 'app', className: 'changed-class' },
  h(
    'ul',
    null,
    h(
      'li',
      null,
      h(
        'span',
        { className: 'menu-item' },
        'Item 1'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'changed-menu-item' },
        'Item 2'
      )
    ),
    h(
      'li',
      null,
      h(
        'span',
        { className: 'menu-item' },
        'Item 3'
      )
    )
  )
);


var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');

var h = require('../../').h;
var diff = require('../../').diff;
var patch = require('../../').patch;

describe('Test attributes', function() {
  jsdom();

  it('should setup style attribute', function() {
    var a = h('div', { style: { backgroundColor: '#fff', left: '20px' } },
      h('div', { style: 'right:20px;' })
    );

    var dom = a.render();

    expect(a.props['style']).to.be.exists;
    expect(a.props['style']).to.be.deep.equal({ backgroundColor: '#fff', left: '20px' });
    expect(dom.getAttribute('style')).to.be.a('string');
    expect(dom.getAttribute('style')).to.be.equal('background-color:#fff;left:20px;');
    expect(a.children[0].props['style']).to.be.equal('right:20px;');
  });

  it('should diff and patch style attribute', function() {
    var a = h('div', { style: { left: '21px' }}, '');
    var b = h('div', { style: { backgroundColor: '#fff', left: '20px' } },
      h('div', { style: 'right:20px;' })
    );

    var dom = a.render();
    patch(a, diff(a, b));

    expect(a.props['style']).to.be.exists;
    expect(a.props['style']).to.be.deep.equal({ backgroundColor: '#fff', left: '20px' });
    expect(dom.getAttribute('style')).to.be.a('string');
    expect(dom.getAttribute('style')).to.be.equal('background-color:#fff;left:20px;');
    expect(a.children[0].props['style']).to.be.equal('right:20px;');
  });

  it('should patch attrs modified via dom node', function () {
    var a = h('div', null, '');
    var b = h('div', null, '');

    var dom = a.render();

    dom.classList.add('active');
    patch(a, diff(a, b));

    expect(dom.attributes.length).to.be.equal(0);
    expect(dom.props).to.be.an('undefined');
  });
});
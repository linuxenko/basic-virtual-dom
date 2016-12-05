var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');

var diff = require('../').diff;
var patch = require('../').patch;

var a = require('./fixtures/simple').a;
var b = require('./fixtures/simple').b;

var a1 = require('./fixtures/simple').a1;
var a2 = require('./fixtures/simple').a2;

describe('Test patch()', function() {
  jsdom();

  it('should patch simple nodes', function() {
    var dom = b.render();
    var diffs;

    expect(dom.childNodes[0]).to.be.instanceof(window.Text);
    diffs = diff(b, a);

    expect(function() {
      patch(b, diffs);
    }).not.throw();

    expect(dom.childNodes[0]).to.be.instanceof(window.HTMLDivElement);
    expect(dom.childNodes[0].childNodes[0]).to.be.instanceof(window.Text);
    expect(dom.childNodes[0].childNodes[0].textContent)
      .to.be.equal('text');
  });

  it('should patch virtual tree', function() {
    a1.render();
    var diffs;

    expect(a1.children).to.be.an('array');
    expect(a1.children[0].children).to.be.a('string');
    expect(a1.children[0].tag).to.be.equal('text');

    diffs = diff(a1, a2);
    patch(a1, diffs);

    expect(a1.children).to.be.an('array');
    expect(a1.children[0].children).to.be.an('array');
    expect(a1.children[0].tag).to.be.equal('div');
  });

  it('should patch props', function() {
    expect(a1.props.className).to.be.equal(a2.props.className);
  });

});

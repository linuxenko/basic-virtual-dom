var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');

var h = require('../../').h;
var diff = require('../../').diff;
var patch = require('../../').patch;

describe('Test events', function() {
  jsdom();

  it('should handle very simple click event', function(done) {
    var tree = h('div', { onClick : function() { done(); } }, '');

    expect(tree.props.onClick).to.be.a('function');
    tree.render();
    tree.el.click();
  });

  it('should repatch event handlers', function(done) {
    var counter = 0;
    var a = h('div', { onClick : function() { counter++; } }, '');
    var b = h('div', { onClick : function() { 
      expect(counter).to.be.equal(1);
      done();
    } }, '');

    a.render();
    a.el.click();

    expect(counter).to.be.equal(1);
    expect(Object.keys(a.listeners).length).to.be.equal(1);

    patch(a, diff(a, b));
    expect(Object.keys(a.listeners).length).to.be.equal(1);
    a.el.click();
  });

});


var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');

var diff = require('../').diff;

var a = require('./fixtures/simple').a;
var b = require('./fixtures/simple').b;
var c = require('./fixtures/simple').c;
var e = require('./fixtures/simple').e;

var PATCH_REPLACE = require('../').PATCH_REPLACE;

describe('Test diff()', function() {
  jsdom();

  it('should create trees', function() {
    expect(a).to.be.an('object');
    expect(b).to.be.an('object');
  });

  it('should diff simple tree', function() {
    var diffs;

    a.render();

    expect(function() {
      diffs = diff(a, c);
    }).not.throw();

    expect(diffs).to.be.an('array');
    expect(diffs.length).to.be.equal(1);
    expect(diffs[0].t).to.be.equal(PATCH_REPLACE);
  });

  it('should diff nonexisten node', function() {
    var dom = b.render();
    var diffs;

    expect(dom.children).not.be.exists;

    diffs = diff(b, a);

    expect(diffs.length).to.be.equal(2);
  });

  it('should diff props', function() {
    e.render();
    var diffs = diff(e, c);


    expect(diffs[0].t).to.be.equal(4);
    expect(diffs[1].t).to.be.equal(4);
    expect(diffs[1].change.length).to.be.equal(2);
  });

  it('should diff complex tree', function() {

  });
});

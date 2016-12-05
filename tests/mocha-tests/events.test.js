var expect = require('chai').expect;
var jsdom = require('mocha-jsdom');

describe('Test events', function() {
  jsdom();
  it.skip('should handle very simple click event', function() {
    expect(true).to.be.true;
  });

});


var expect = require('chai').expect;

var jsdom = require('mocha-jsdom');

var a = require('../fixtures/simple').a;
var b = require('../fixtures/simple').b;
var c = require('../fixtures/simple').c;

describe('Test render()', function() {
  jsdom();

  it('should render simple nodes', function() {
    expect(a).to.be.an('object');
    expect(b).to.be.an('object');
    expect(c).to.be.an('object');

    expect(function() {
      a.render();
      b.render();
      c.render();
    }).not.throw();
  });

  it('shoud render DOM nodes', function() {
    var dom = a.render();
    expect(dom).to.be.instanceof(window.HTMLDivElement);
    dom = b.render();
    expect(dom).to.be.instanceof(window.HTMLDivElement);
  });

  it('should render text nodes', function() {
    var dom = a.render();
    expect(dom.childNodes[0].childNodes[0]).to.be.instanceof(window.Text);
    expect(dom.childNodes[0].childNodes[0].textContent).to.be.equal('text');
  });

  it('should render more complex nodes', function() {
    var dom;

    expect(function() {
      dom = require('../fixtures/nested').a.render();
    }).not.throw();

    expect(dom).to.be.instanceof(window.HTMLDivElement);

    expect(dom.childNodes[0]).to.be.instanceof(window.HTMLUListElement);
    expect(dom.childNodes[0].childNodes[0])
      .to.be.instanceof(window.HTMLLIElement);
    expect(dom.childNodes[0].childNodes[1])
      .to.be.instanceof(window.HTMLLIElement);
    expect(dom.childNodes[0].childNodes[2])
      .to.be.instanceof(window.HTMLLIElement);
  });
});

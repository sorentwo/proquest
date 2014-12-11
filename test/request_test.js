var expect  = require('chai').expect;
var sinon   = require('sinon');
var Request = require('../proquest').Request;

describe('Request', function() {
  describe('.partial', function() {
    it('composes a request with pre-defined attributes', function() {
      var partial = Request.partial({
        method: 'GET',
        header: { 'Accept' : 'application/json' },
        catcher: function(res) {}
      });

      var request = partial({method: 'HEAD', url: '/endpoint'});

      expect(request.method).to.eq('HEAD');
      expect(request.url).to.eq('/endpoint');
      expect(request.header).to.eql({ 'Accept' : 'application/json' });
      expect(request.catcher).to.exist;
    });
  });

  describe('#set', function() {
    it('updates the header object', function() {
      var request = new Request('get', '/');

      request.set('Accept', 'application/json');

      expect(request.header).to.have.key('Accept');
    });
  });

  describe('#catch', function() {
    it('sets a default catcher function', function() {
      var request = new Request('get', '/');
      var pong    = function() {};

      request.catch(pong);

      expect(request.catcher).to.eql(pong);
    });
  });

  describe('#send', function() {
    it('merges the object into data', function() {
      var request = new Request('post', '/');

      request.send({ id: 100, name: 'Hello' });
      expect(request.data).to.eql({ id: 100, name: 'Hello' });

      request.send({ type: 'thing' });
      expect(request.data).to.include({ type: 'thing' });
    });
  });

  describe('#isXDomainRequest', function() {
    it('is a cross domain request when the hostname does not match', function() {
      var request = new Request('get', 'https://example.com/stuff');

      expect(request.isXDomainRequest('localhost:8080')).to.be.true;
      expect(request.isXDomainRequest('example.com')).to.be.false;
    });
  });
});

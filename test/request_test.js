var Promise  = require('es6-promise').Promise;
var expect   = require('chai').expect;
var sinon    = require('sinon');
var Request  = require('../proquest').Request;
var Response = require('../proquest').Response;

describe('Request', function() {
  var currentRequest;
  var xhr;

  beforeEach(function() {
    xhr = sinon.useFakeXMLHttpRequest();
    global.XMLHttpRequest = xhr;
    global.window = {
      location: {
        hostname: 'example.org'
      }
    };

    xhr.onCreate = function(nextRequest) {
      currentRequest = nextRequest;
    }
  });

  afterEach(function() {
    currentRequest = null;
    xhr.restore();
  });

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

  describe('#end', function() {
    it('returns a promise', function(done) {
      var request = new Request('POST', '/');
      var promise = request.end();

      expect(promise).to.be.instanceof(Promise);
      done();
    });

    it('performs an XMLHttpRequest', function(done) {
      var method = 'POST';
      var payload = { id: 100, name: 'Hello' };
      var url = '/';
      var request = new Request(method, url);

      request.send(payload);
      request.end();

      expect(currentRequest).to.exist;
      expect(currentRequest.method).to.eq(method);
      expect(JSON.parse(currentRequest.requestBody)).to.eql(payload);
      expect(currentRequest.url).to.eq('/');

      currentRequest.respond(200, {}, '{}');

      done();
    });
  });

  describe('#abort', function() {
    it('cancels a request that has been sent', function(done) {
      var request = new Request('post', '/');
      var promise = request.end();
      expect(request.xhr.readyState).to.eq(1);

      request.abort();
      expect(request.xhr.readyState).to.eq(0);

      promise.catch(function(response) {
        expect(response).to.exist;
        expect(response).to.be.instanceof(Response);
      });

      done();
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

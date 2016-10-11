var expect   = require('chai').expect;
var Response = require('../proquest').Response;

describe('Response', function() {
  it('does not try to parse responses without any text', function() {
    var xhr = {
      getAllResponseHeaders: function() { return ''; },
      responseText: '',
      status: 204
    };

    var response = new Response(xhr);

    expect(response.body).to.be.null;
  });

  it('swallows errors during json parsing', function() {
    var xhr = {
      getAllResponseHeaders: function() { return ''; },
      responseText: '<html>Not Found</html>',
      status: 404
    };

    var response = new Response(xhr);

    expect(response.body).to.be.null;
  });

  it('re-throws errors so they can be caught by the request/response consumer', function() {
    var xhr = {
      getAllResponseHeaders: function() { return ''; },
      responseText: '<html>Server Error</html>',
      status: 500
    }

    expect(function() { return new Response(xhr); }).to.throw(Error);
  });
});

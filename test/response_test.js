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
      responseText: '<html>Error</html>',
      status: 500
    };

    var response = new Response(xhr);

    expect(response.body).to.be.null;
  });
});

var merge     = require('./merge');
var ESPromise = require('es6-promise').Promise;
var Response  = require('./response');

var Request = function(method, url) {
  this.method = method;
  this.url    = url;
  this.data   = {};
  this.header = {};
  this.xhr    = new XMLHttpRequest();
};

Request.partial = function(partOpts) {
  return function(options) {
    var merged  = merge(partOpts, options);
    var request = new Request(merged.method, merged.url);

    if (merged.header)  request.header  = merged.header;
    if (merged.data)    request.data    = merged.data;
    if (merged.catcher) request.catcher = merged.catcher;

    return request;
  };
};

merge(Request.prototype, {
  set: function(field, value) {
    this.header[field] = value;

    return this;
  },

  catch: function(func) {
    this.catcher = func;
  },

  send: function(data) {
    merge(this.data, data);

    return this;
  },

  end: function() {
    var request = this;
    var xhr = this.xhr;

    var promise = new ESPromise(function(resolve, reject) {
      xhr.addEventListener('load', function() {
        if (xhr.status >= 200 && xhr.status <= 399) {
          resolve(new Response(xhr));
        } else {
          reject(new Response(xhr));
        }
      });

      xhr.addEventListener('error', function() {
        reject(new Response(xhr));
      });

      xhr.addEventListener('abort', function() {
        reject(new Response(xhr));
      });

      if (request.isXDomainRequest()) {
        xhr.withCredentials = true;
      }

      xhr.open(request.method, request.url, true);

      for (var field in request.header) {
        xhr.setRequestHeader(field, request.header[field]);
      }

      xhr.send(request.serialized());
    });

    if (this.catcher) promise.catch(this.catcher);

    return promise;
  },

  abort: function() {
    this.xhr.abort();
  },

  isXDomainRequest: function(hostname) {
    hostname = hostname || window.location.hostname;
    var hostnameMatch = this.url.match(/http[s]?:\/\/([^\/]*)/);

    return (hostnameMatch && hostnameMatch[1] !== hostname);
  },

  serialized: function() {
    return this.parser()(this.data);
  },

  parser: function() {
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      return JSON.stringify;
    } else {
      return function(value) { return value; };
    }
  }
});

module.exports = Request;

var merge     = require('./merge');
var ESPromise = require('es6-promise').Promise;
var Response  = require('./response');

merge(Response.prototype, {
  parseHeader: function(string) {
    var lines  = string.split(/\r?\n/);
    var fields = {};
    var index, line, field, value;

    lines.pop(); // trailing CRLF

    for (var i = 0, len = lines.length; i < len; ++i) {
      line  = lines[i];
      index = line.indexOf(':');
      field = line.slice(0, index).toLowerCase();
      value = line.slice(index + 1).trim();
      fields[field] = value;
    }

    return fields;
  }
});

var Request = function(method, url) {
  this.method = method;
  this.url    = url;
  this.data   = {};
  this.header = {};
};

Request.partial = function(partOpts) {
  return function(options) {
    var merged  = merge(partOpts, options);
    var request = new Request(merged.method, merged.url);

    if (merged.header) request.header = merged.header;
    if (merged.data)   request.data   = merged.data;

    return request;
  };
};

merge(Request.prototype, {
  set: function(field, value) {
    this.header[field] = value;

    return this;
  },

  send: function(data) {
    merge(this.data, data);

    return this;
  },

  end: function() {
    var self = this;
    var xhr  = new XMLHttpRequest();

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

      if (self.isXDomainRequest()) {
        xhr.withCredentials = true;
      }

      xhr.open(self.method, self.url, true);

      for (var field in self.header) {
        xhr.setRequestHeader(field, self.header[field]);
      }

      xhr.send(self.serialized());
    });

    return promise;
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

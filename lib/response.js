var merge = require('./merge');

var Response = function(xhr) {
  this.xhr     = xhr;
  this.text    = this.xhr.responseText;
  this.header  = this.parseHeader(this.xhr.getAllResponseHeaders());
  this.status  = this.xhr.status;

  if (this.text) {
    this.body = JSON.parse(this.text);
  } else {
    this.body = null;
  }
};

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

module.exports = Response;

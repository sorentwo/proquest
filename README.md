# Proquest (Promise Request)

Ultra light wrapper around XHR requests that returns Promises for composition.

## Installation

Designed for usage with CJS, namely via [browserify](http://browserify.org/).

```bash
npm install proquest --save-dev
```

Then simply require it:

```javascript
var Request = require('proquest');
```

## Usage

Proquest takes many of its design cues from [superagent](superagent), but in an
extremely paired back way.

```javascript
// Composing a request

var Request = require('proquest').Request;
var request = new Request('POST', 'https://example.com/things');

request
  .set('Accept', 'application/json')
  .set('Content-Type', 'application/json')
  .set('Authorization', 'token abcdefg1234567')
  .send({ name: 'New Thing', tags: ['a', 'b', 'c'] })
  .end()
  .then(function(response) {
    console.log('Success!', response.body);
  }, function(response) {
    console.log('Failure!', response.status);
  });
```

[superagent]: http://visionmedia.github.io/superagent/

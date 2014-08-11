# Proquest (Promise Request)

Ultra light wrapper around XHR requests that returns Promises for composition.

## Installation

Designed for usage with CJS, namely via [browserify](browserify).

```bash
npm install proquest --save-dev
```

Then simply require it:

```javascript
var Request = require('proquest').Request;
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

Often in the context of an application each request will share most headers.
This can be achieved easily with a `partial` request:

```javascript
// Compose a request using method, url, data, or header options.
var partial = Request.partial({
  header: {
    'Authorization' : 'token abc123'
    'Content-Type'  : 'application/json'
    'Accept'        : 'application/json'
  }
});

// Store the partial request for use throughout the application.
MyApp.request = partial;

// Elsewhere, use the request by invoking and completing it.
var request = partial({ method: 'HEAD', url: '/status' });
```

## Notes

Proquest expects a modern XHR api underneath. That means IE8 and below isn't
going to work.

[browserify]: http://browserify.org/
[superagent]: http://visionmedia.github.io/superagent/

## 0.5.0 - 2016-10-11

* Fixed: Propagate server errors in the 500 range.

## 0.4.0 - 2016-09-08

* Added: Expose an `abort` function on the request object.

## 0.3.0

* Fixed: Swallow errors when parsing JSON. This prevents errors for servers that
  return an HTML error response (404, 500).

## 0.2.0

* Added: Append a `catch` handler on `end` when provided. This allows universal
  error handling.
* Fixed: Properly handle empty xhr responseText
* Fixed: Resolve promises if the xhr status code is between 200 and 399. [Devon
  Blandin]

## v0.1.1 - 2014-09-23

* Added: Handle connection logic within the fulfillment function.
* Fixed: Avoid passing request to response object, just pass the XHR that it
  needs.

## v0.1.0 - 2014-08-12

* Initial release!

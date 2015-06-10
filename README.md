#accept

HTTP Accept-* headers parsing.

[![Build Status](https://secure.travis-ci.org/hapijs/accept.png)](http://travis-ci.org/hapijs/accept)

Lead Maintainer - [Mark Bradshaw](https://github.com/mark-bradshaw)

## Introduction

Accept helps to answer the question of what specific types of technologies should be used in responding to a HTTP request.  Accept will parse the headers of a HTTP request and tell you what the preferred encoding is, or what charsets are supported, etc..

Additional details about Accept headers and content negotiation can be found in [IETF RFC 7231, Section 5.3](https://tools.ietf.org/html/rfc7231#section-5.3).

## Usage

### `charsets(charsetHeader)`

Given a string of acceptable charsets from a HTTP request it will return an array of strings indicating the possible charset options that can be used in the HTTP response, in order from most preferred to least as determined by the encoding weight.  This takes into account any weighting parameters given in the header for ordering and exclusion.

```
var charsets = Accept.charsets("iso-8859-5, unicode-1-1;q=0.8"); // charsets === ["iso-8859-5", "unicode-1-1"]
var charsets = Accept.charsets("iso-8859-5;q=0.5, unicode-1-1;q=0.8"); // charsets === ["unicode-1-1", "iso-8859-5"]
```

### `encoding(encodingHeader, [preferences])`

Given a string of acceptable encodings from a HTTP request, and optionally an array of preferences, it will return a string with the best fit encoding that should be used in the HTTP response.  If no preferences array parameter is given the highest weighted or first ordered encoding is returned.  If weightings are given in the header (using the q parameter) they are taken into account and the highest weighted match is returned.  If a preferences array is given the best match from the array is returned.  For more information about how the preferences array works see the section below on [Preferences](#preferences).

```
var encoding = Accept.encoding("gzip, deflate, sdch"); // encoding === "gzip"
var encoding = Accept.encoding("gzip, deflate, sdch", ["deflate", "identity"]); // encoding === "delate"
```

### `encodings(encodingHeader)`

Given a string of acceptable encodings from a HTTP request it will return an array of strings indicating the possible encoding options that can be used in the HTTP response, in order from most preferred to least as determined by the encoding weight.  This takes into account any weighting parameters given in the header for ordering and exclusion.

```
var encodings = Accept.encodings("compress;q=0.5, gzip;q=1.0"); // encodings === ["gzip", "compress", "identity"]
```

## Examples

### Preferences

If you are looking for a set of specific encodings you can pass that in as an array to the `preferences` parameter.  Your preferences **must** be an array.  In the preferences array you specify a list of possible encodings you want to look for, in order of preference.  Accept will return back the most preferential option it can find, if any match.

```
var encoding = Accept.encoding("gzip, deflate, sdch", ["deflate", "identity"]); // encoding === "delate"
```

Your preferences are evaluated without any case sensitivity, to better match what the browser sends.  This means that "gZip" will match a preference of ["gzip"].

```
var encoding = Accept.encoding("gZip, deflate, sdch", ["gzip"]); // encoding === "gzip"
```

If you supply a preferences array, and no match if found, `encoding()` will return an empty string, rather than an encoding from the header.

```
var encoding = Accept.encoding("gZip", ["deflate"]); // encoding === ""
```

If the encoding header is the special "*" that indicates the browser will accept any encoding.  In that case the top preference from your supplied options will be returned.

```
var encoding = Accept.encoding("*", ["gzip"]); // encoding === "gzip"
```

### Weighted encoding

The encoding header may optionally include preferential weighting to indicate what encoding it would like for you to use in your response.  In that case your preferences are matched with the weighting in mind, and the highest weighted option will be returned, no matter in what order you list your preferences.  The browser weighting is most important.

```
var encoding = Accept.encoding("gzip;q=1.0, identity; q=0.5", ["identity", "gzip"]); // encoding === "gzip"
```


## Encodings

You can also ask Accept for a list of all the supported encodings from the browser, using the `encodings()` function (plural, not singular).  You will be returned an array of strings, in order from most preferred to least as determined by the encoding weight.

```
var encodings = Accept.encodings("compress;q=0.5, gzip;q=1.0"); // encodings === ["gzip", "compress", "identity"]
```

You'll notice that `identity` was returned in the array, even though it's not in the encoding header.  Identity is always an option for encoding, unless specifically excluded in the header using a weighting of zero.  Identity just means respond with no special encoding.

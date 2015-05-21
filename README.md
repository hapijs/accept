#accept

HTTP Accept-* headers parsing.

[![Build Status](https://secure.travis-ci.org/hapijs/accept.png)](http://travis-ci.org/hapijs/accept)

Lead Maintainer - [Eran Hammer](https://github.com/hueniverse)

## Introduction

Accept helps to answer the question of whether the browser can use certain content encoding techniques, such as gzip or deflate.  Accept will parse the headers of a HTTP request and tell you what the preferred encoding is, or if given a list of possible encodings, it will respond with the first available encoding that matches something in the list.

Additional details about Accept headers and content negotiation can be found in [IETF RFC 7231, Section 5.3](https://tools.ietf.org/html/rfc7231#section-5.3).

## Parsing for a specific encoding

Using the `encoding` function will return a `string` matching a type of encoding.  `Encoding` takes two parameters, `encoding(encodingHeader, [preferences])`.  The headers parameter is required, but the preferences are optional.  If no preferences are provided, encoding will find the first supported encoding option and return that.

```
var accepts = Accept.encoding("gzip, deflate, sdch"); // accepts === "gzip"
```

### Preferences

If you are looking for a set of specific encodings you can pass that in as an array to the `preferences` parameter.  Your preferences **must** be an array.  In the preferences array you specify a list of possible encodings you want to look for, in order of preference.  Accept will return back the most preferential option it can find, if any match.

```
var accepts = Accept.encoding("gzip, deflate, sdch", ["deflate", "identity"]); // accepts === "delate"
```

Your preferences are evaluated without any case sensitivity, to better match what the browser sends.  This means that "gZip" will match a preference of ["gzip"].

```
var accepts = Accept.encoding("gZip, deflate, sdch", ["gzip"]); // accepts === "gzip"
```

If you supply a preferences array, and no match if found, `encoding` will return an empty string, rather than an encoding from the header.

```
var accepts = Accept.encoding("gZip", ["deflate"]); // accepts === ""
```

If the encoding header is the special "*" that indicates the browser will accept any encoding.  In that case the top preference from your supplied options will be returned.

```
var accepts = Accept.encoding("*", ["gzip"]); // accepts === "gzip"
```

### Weighted encoding

The encoding header may optionally include preferential weighting to indicate what encodings it would like for you to use in your response.  In that case your preferences are matched with the weighting in mind, and the highest weighted option will be returned, no matter in what order you list your preferences.  The browser weighting is most important.

```
var accepts = Accept.encoding("gzip;q=1.0, identity; q=0.5", ["identity", "gzip"]); // accepts === "gzip"
```


## Encodings

You can also ask Accept for a list of all the supported encodings from the browser, using the `encodings` function (plural, not singular).  You will be returned an array of strings, in order from most preferred to least as determined by the encoding weight.

```
var accepts = Accept.encodings("compress;q=0.5, gzip;q=1.0"); // accepts === ["gzip", "compress", "identity"]
```

You'll notice that `identity` was returned in the array, even though it's not in the encoding header.  Identity is always an option for encoding, unless specifically excluded in the header using a weighting of zero.  Identity just means respond with no special encoding.

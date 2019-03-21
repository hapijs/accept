# accept

HTTP Accept-* headers parsing.

[![Build Status](https://travis-ci.org/hapijs/accept.svg?branch=v2-commercial)](https://travis-ci.org/hapijs/accept)

## License

This version of the package requires a commercial license. You may not use, copy, or distribute it without first acquiring a commercial license from Sideway Inc. Using this software without a license is a violation of US and international law. To obtain a license, please contact [sales@sideway.com](mailto:sales@sideway.com). The open source version of this package can be found [here](https://github.com/hapijs/accept).

## Introduction

Accept helps to answer the question of how best to respond to a HTTP request, based on the requesting browser's capabilities.  Accept will parse the headers of a HTTP request and tell you what the preferred encoding is, what language should be used, and what charsets and media types are accepted.

Additional details about Accept headers and content negotiation can be found in [IETF RFC 7231, Section 5.3](https://tools.ietf.org/html/rfc7231#section-5.3).

## API

For information on using Accept see the [API documentation](API.md).

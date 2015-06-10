'use strict';

var charsetLib = require('./charset');
var encodingLib = require('./encoding');

exports.charset = charsetLib.charset;
exports.charsets = charsetLib.charsets;
exports.encoding = encodingLib.encoding;
exports.encodings = encodingLib.encodings;

exports.parseAll = function(requestHeaders) {

    return {
        charsets: charsetLib.charsets(requestHeaders['accept-charset']),
        encodings: encodingLib.encodings(requestHeaders['accept-encoding'])
    };
};

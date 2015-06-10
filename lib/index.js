'use strict';

var charsetLib = require('./charset');
var encodingLib = require('./encoding');

exports.charsets = charsetLib.charsets;
exports.encoding = encodingLib.encoding;
exports.encodings = encodingLib.encodings;

exports.parseAll = function(requestHeaders) {

    return {
        charsets: charsetLib.charsets(requestHeaders['Accept-Charset']),
        encodings: encodingLib.encodings(requestHeaders['Accept-Encoding'])
    };
};

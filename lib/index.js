'use strict';

var charsetLib = require('./charset');
var encodingLib = require('./encoding');
var languageLib = require('./language');
var mediaTypeLib = require('./mediatype');

exports.charset = charsetLib.charset;
exports.charsets = charsetLib.charsets;

exports.encoding = encodingLib.encoding;
exports.encodings = encodingLib.encodings;

exports.language = languageLib.language;
exports.languages = languageLib.languages;

exports.mediaTypes = mediaTypeLib.mediaTypes;

exports.parseAll = function(requestHeaders) {

    return {
        charsets: charsetLib.charsets(requestHeaders['accept-charset']),
        encodings: encodingLib.encodings(requestHeaders['accept-encoding']),
        languages: languageLib.languages(requestHeaders['accept-language']),
        mediaTypes: mediaTypeLib.mediaTypes(requestHeaders['accept'])
    };
};

'use strict';

var CharsetLib = require('./charset');
var EncodingLib = require('./encoding');
var LanguageLib = require('./language');

exports.charset = CharsetLib.charset;
exports.charsets = CharsetLib.charsets;

exports.encoding = EncodingLib.encoding;
exports.encodings = EncodingLib.encodings;

exports.language = LanguageLib.language;
exports.languages = LanguageLib.languages;

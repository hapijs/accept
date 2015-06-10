'use strict';

// Load modules

var Boom = require('boom');
var Hoek = require('hoek');


// Declare internals

var internals = {};


/*
    https://tools.ietf.org/html/rfc7231#section-5.3.3
    Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
*/

exports.charset = function(header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');
    var charsets = exports.charsets(header);

    if (charsets.length === 0) {
        charsets.push('');
    }

    // no preferences.  take the first charset.
    if (!preferences || preferences.length === 0) {
        return charsets[0];
    }

    // if charsets includes * return first preference
    if (~charsets.indexOf('*')) {
        return preferences[0];
    }

    // try to find the first match in the array of preferences.
    preferences = preferences.map(function(str) {

        return str.toLowerCase();
    });

    for (var i = 0; i < charsets.length; ++i) {
        if (~preferences.indexOf(charsets[i])) {
            return charsets[i];
        }
    }

    return '';
};

exports.charsets = function(header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

    header = header.toLowerCase();

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeUnwanted)
        .sort(internals.compareByWeight)
        .map(internals.partToCharset);
};

internals.getParts = function(item) {

    var result = {
        weight: 1,
        charset: ''
    };

    var match = item.match(internals.partsRegex);

    if (!match) {
        return result;
        }

    result.charset = match[1];
    if (match[2] && internals.isNumber(match[2]) ) {
        var weight = parseFloat(match[2]);
        if (weight === 0 || (weight >= 0.001 && weight <= 1)) {
            result.weight = weight;
        }
    }
    return result;
};

//                         1: token               2: qvalue
internals.partsRegex = /\s*([^;]+)(?:\s*;\s*[qQ]\=([01](?:\.\d*)?))?\s*/;

internals.removeUnwanted = function(item) {
    return item.weight !== 0 && item.charset !== '';
};

internals.compareByWeight = function(a, b) {

    return a.weight < b.weight;
};

internals.partToCharset = function(item) {

    return item.charset;
};

internals.isNumber = function(n) {

  return !isNaN(parseFloat(n));
};

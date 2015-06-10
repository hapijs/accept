'use strict';

// Declare internals

var internals = {};


/*
    Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
*/

exports.charsets = function(header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

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

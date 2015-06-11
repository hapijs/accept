'use strict';

// Load modules

var Boom = require('boom');
var Hoek = require('hoek');


// Declare internals

var internals = {};


/*
    https://tools.ietf.org/html/rfc7231#section-5.3.5
    Accept-Language: da, en-gb;q=0.8, en;q=0.7
*/

exports.language = function(header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');
    var languages = exports.languages(header);

    if (languages.length === 0) {
        languages.push('');
    }

    // no preferences.  take the first charset.
    if (!preferences || preferences.length === 0) {
        return languages[0];
    }

    // if languages includes * return first preference
    if (~languages.indexOf('*')) {
        return preferences[0];
    }

    // try to find the first match in the array of preferences.
    preferences = preferences.map(function(str) {

        return str.toLowerCase();
    });

    for (var i = 0; i < languages.length; ++i) {
        if (~preferences.indexOf(languages[i].toLowerCase())) {
            return languages[i];
        }
    }

    return '';
};

exports.languages = function(header) {

    if (header === undefined || typeof header !== 'string') {
        return [];
    }

    return header
        .split(',')
        .map(internals.getParts)
        .filter(internals.removeUnwanted)
        .sort(internals.compareByWeight)
        .map(internals.partToLanguage);
};

internals.getParts = function(item) {

    var result = {
        weight: 1,
        language: ''
    };

    var match = item.match(internals.partsRegex);

    if (!match) {
        return result;
        }

    result.language = match[1];
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
    return item.weight !== 0 && item.language !== '';
};

internals.compareByWeight = function(a, b) {

    return a.weight < b.weight;
};

internals.partToLanguage = function(item) {

    return item.language;
};

internals.isNumber = function(n) {

  return !isNaN(parseFloat(n));
};

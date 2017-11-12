'use strict';

// Load modules

const Boom = require('boom');
const Hoek = require('hoek');


// Declare internals

const internals = {};

/*
    gzip, deflate = most browsers (safari, chrome on iphone6s & ipad air),
       (chrome on android), (firefox, edge on win10), (chrome, safari on desktop)
    gzip, deflate, br = chrome on https or localhost
    gzip, deflate, sdch = firefox win7
    identity, gzip = for benchmark
*/
internals.commonAcceptEncodings = [
    'gzip, deflate',
    'gzip, deflate, br',
    'gzip, deflate, sdch',
    'identity, gzip'
];

// from hapi/lib/compression.js
internals.commonPreferences = [
    ['identity', 'gzip', 'deflate'],
    ['identity', 'deflate', 'gzip'],
    undefined
];

internals.cache = {};

internals.generateCache = function (encodingHeaders, preferencesList) {

    encodingHeaders.forEach((header) => {

        preferencesList.forEach((preferences) => {

            const result = exports.encoding(header, preferences);
            const label = preferences ? header.concat(preferences.join('')) : header;
            internals.cache[label] = result;
        });
    });
};

/*
    RFC 7231 Section 5.3.4 (https://tools.ietf.org/html/rfc7231#section-5.3.4)

    Accept-Encoding  = #( codings [ weight ] )
    codings          = content-coding / "identity" / "*"

    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

exports.encoding = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    const label = preferences ? header.concat(preferences.join('')) : header;
    if (!internals.cache[label]) {
        const encodings = exports.encodings(header, preferences);
        const output = encodings.length ? encodings[0] : '';
        return output;
    }
    return internals.cache[label];
};


exports.encodings = function (header, preferences) {

    const scores = internals.parse(header, 'encoding');
    if (!preferences) {
        preferences = Object.keys(scores.accept);
        preferences.push('*');
    }

    return internals.map(preferences, scores);
};


/*
    RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)

   The weight is normalized to a real number in the range 0 through 1,
   where 0.001 is the least preferred and 1 is the most preferred; a
   value of 0 means "not acceptable".  If no "q" parameter is present,
   the default weight is 1.

     weight = OWS ";" OWS "q=" qvalue
     qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )
*/

//                              1: token               2: qvalue
internals.preferenceRegex = /\s*([^;\,]+)(?:\s*;\s*[qQ]\=([01](?:\.\d{0,3})?))?\s*(?:\,|$)/g;


internals.equivalents = {
    encoding: {
        'x-compress': 'compress',
        'x-gzip': 'gzip'
    }
};

internals.parse = function (header, type) {

    const scores = {
        accept: {},
        reject: {},
        any: 0.0
    };

    if (header) {
        const leftovers = header.replace(internals.preferenceRegex, ($0, $1, $2) => {

            $1 = $1.toLowerCase();
            const key = internals.equivalents[type][$1] || $1;
            const score = $2 ? parseFloat($2) : 1.0;
            if (key === '*') {
                scores.any = score;
            }
            else if (score > 0) {
                scores.accept[key] = score;
            }
            else {
                scores.reject[key] = true;
            }

            return '';
        });

        if (leftovers) {
            throw Boom.badRequest('Invalid accept-' + type + ' header');
        }
    }

    // Add identity at the lowest score if not explicitly set

    if (!scores.reject.identity &&
        !scores.accept.identity) {

        scores.accept.identity = scores.any || 0.001;
    }

    return scores;
};


internals.map = function (preferences, scores) {

    const scored = [];
    for (let i = 0; i < preferences.length; ++i) {
        const key = preferences[i].toLowerCase();
        if (!scores.reject[key]) {
            const score = scores.accept[key] || scores.any;
            if (score > 0) {
                scored.push({ key, score });
            }
        }
    }

    scored.sort(internals.sort);

    const result = [];
    for (let i = 0; i < scored.length; ++i) {
        result.push(scored[i].key);
    }

    return result;
};


internals.sort = function (a, b) {

    return (a.score === b.score ? 0 : (a.score < b.score ? 1 : -1));
};

internals.generateCache(internals.commonAcceptEncodings, internals.commonPreferences);

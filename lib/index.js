// Load modules

var Boom = require('boom');
var Hoek = require('hoek');


// Declare internals

var internals = {};

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

    var encodings = exports.encodings(header, preferences);
    if (encodings.isBoom) {
        return encodings;
    }

    return encodings.length ? encodings[0] : null;
};


exports.encodings = function (header, preferences) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    var scores = internals.parse(header, 'content-encoding');
    if (scores.isBoom) {
        return scores;
    }

    if (!preferences ||
        !preferences.length) {

        preferences = Object.keys(scores.accept);
        if (scores.any) {
            preferences.push('*');
        }
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


internals.parse = function (header, name) {

    var scores = {
        accept: {},
        reject: {},
        any: 1.0
    };

    if (!header) {
        return scores;
    }

    var leftovers = header.replace(internals.preferenceRegex, function ($0, $1, $2) {

        var key = $1;
        var score = $2 ? parseFloat($2) : 1.0;
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
        return Boom.badRequest('Invalid ' + name + ' header');
    }

    return scores;
};


internals.map = function (preferences, scores) {

    var scored = [];
    for (var i = 0, il = preferences.length; i < il; ++i) {
        var key = preferences[i];
        if (!scores.reject[key]) {
            var score = scores.accept[key] || scores.any;
            if (score > 0) {
                scored.push({ key: key, score: score });
            }
        }
    }

    scored.sort(internals.sort);

    var result = [];
    for (i = 0, il = scored.length; i < il; ++i) {
        result.push(scored[i].key);
    }

    return result;
};


internals.sort = function (a, b) {

    return (a.score === b.score ? 0 : (a.score < b.score ? 1 : -1));
};

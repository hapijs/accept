'use strict';

const Hoek = require('@hapi/hoek');
const Boom = require('@hapi/boom');


const internals = {};


exports.selection = function (header, preferences, options) {

    const selections = exports.selections(header, preferences, options);
    return selections.length ? selections[0] : '';
};


exports.selections = function (header, preferences, options) {

    Hoek.assert(!preferences || Array.isArray(preferences), 'Preferences must be an array');

    return internals.parse(header || '', preferences, options);
};


//      RFC 7231 Section 5.3.3 (https://tools.ietf.org/html/rfc7231#section-5.3.3)
//
//      Accept-Charset  = *( "," OWS ) ( ( charset / "*" ) [ weight ] ) *( OWS "," [ OWS ( ( charset / "*" ) [ weight ] ) ] )
//      charset         = token
//
//      Accept-Charset: iso-8859-5, unicode-1-1;q=0.8


//      RFC 7231 Section 5.3.4 (https://tools.ietf.org/html/rfc7231#section-5.3.4)
//
//      Accept-Encoding = [ ( "," / ( codings [ weight ] ) ) *( OWS "," [ OWS ( codings [ weight ] ) ] ) ]
//      codings         = content-coding / "identity" / "*"
//      content-coding  = token
//
//      Accept-Encoding: compress, gzip
//      Accept-Encoding:
//      Accept-Encoding: *
//      Accept-Encoding: compress;q=0.5, gzip;q=1.0
//      Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0


//      RFC 7231 Section 5.3.5 (https://tools.ietf.org/html/rfc7231#section-5.3.5)
//
//      Accept-Language = *( "," OWS ) ( language-range [ weight ] ) *( OWS "," [ OWS ( language-range [ weight ] ) ] )
//      language-range  = ( 1*8ALPHA *( "-" 1*8alphanum ) ) / "*"   ; [RFC4647], Section 2.1
//      alphanum        = ALPHA / DIGIT
//
//       Accept-Language: da, en-gb;q=0.8, en;q=0.7


//      token           = 1*tchar
//      tchar           = "!" / "#" / "$" / "%" / "&" / "'" / "*"
//                        / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
//                        / DIGIT / ALPHA
//                        ; any VCHAR, except delimiters
//      OWS             = *( SP / HTAB )


//      RFC 7231 Section 5.3.1 (https://tools.ietf.org/html/rfc7231#section-5.3.1)
//
//      The weight is normalized to a real number in the range 0 through 1,
//      where 0.001 is the least preferred and 1 is the most preferred; a
//      value of 0 means "not acceptable".  If no "q" parameter is present,
//      the default weight is 1.
//
//       weight = OWS ";" OWS "q=" qvalue
//       qvalue = ( "0" [ "." 0*3DIGIT ] ) / ( "1" [ "." 0*3("0") ] )


internals.parse = function (raw, preferences, options) {

    // Normalize header (remove spaces and tabs)

    const header = raw.replace(/[ \t]/g, '');

    // Parse selections

    const parts = header.split(',');
    const selections = [];
    const map = {};

    for (const part of parts) {
        if (!part) {                            // Ignore empty parts or leading commas
            continue;
        }

        // Parse parameters

        const params = part.split(';');
        if (params.length > 2) {
            throw Boom.badRequest(`Invalid ${options.type} header`);
        }

        let token = params[0].toLowerCase();
        if (!token) {
            throw Boom.badRequest(`Invalid ${options.type} header`);
        }

        if (options.equivalents &&
            options.equivalents[token]) {

            token = options.equivalents[token];
        }

        const selection = { token, q: 1 };
        map[selection.token] = selection;

        // Parse q=value

        if (params.length === 2) {
            const q = params[1];
            const [key, value] = q.split('=');

            if (!value ||
                (key !== 'q' && key !== 'Q')) {

                throw Boom.badRequest(`Invalid ${options.type} header`);
            }

            const score = parseFloat(value);
            if (score === 0) {
                continue;
            }

            if (Number.isFinite(score) &&
                score <= 1 &&
                score >= 0.001) {

                selection.q = score;
            }
        }

        selections.push(selection);             // Only add allowed selections (q !== 0)
    }

    // Sort selection based on q and then position in header

    selections.sort(internals.sort);

    const values = selections.map((selection) => selection.token);

    if (options.default &&
        !map[options.default]) {

        values.push(options.default);
    }

    return internals.preferences(map, values, preferences);
};


internals.sort = function (a, b) {

    return b.q - a.q;
};


internals.preferences = function (map, selections, preferences) {

    if (!preferences ||
        !preferences.length) {

        return selections;
    }

    const lowers = Object.create(null);
    for (const preference of preferences) {
        lowers[preference.toLowerCase()] = preference;
    }

    const preferred = [];
    for (const selection of selections) {
        if (selection === '*') {
            for (const preference of Object.keys(lowers)) {
                if (!map[preference]) {
                    preferred.push(lowers[preference]);
                }
            }
        }
        else {
            const lower = selection.toLowerCase();
            if (lowers[lower]) {
                preferred.push(lowers[lower]);
            }
        }
    }

    return preferred;
};

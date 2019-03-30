'use strict';

const Accept = require('..');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

/*
    Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
*/

describe('parseAll()', () => {

    it('parses all Accept headers', () => {

        const headers = {};
        headers.accept = 'text/plain, application/json;q=0.5, text/html;q=0.6, */*;q=0.1';
        headers['accept-charset'] = 'iso-8859-5, unicode-1-1;q=0.8, *;q=0.001';
        headers['accept-encoding'] = 'compress;q=0.5, gzip;q=1.0';
        headers['accept-language'] = 'da, en;q=0.7, en-gb;q=0.8';

        const accept = Accept.parseAll(headers);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.equal({
            charsets: ['iso-8859-5', 'unicode-1-1', '*'],
            encodings: ['gzip', 'compress', 'identity'],
            languages: ['da', 'en-gb', 'en'],
            mediaTypes: ['text/plain', 'text/html', 'application/json', '*/*']
        });
    });
});

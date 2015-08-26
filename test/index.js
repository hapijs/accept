// Load modules

var Accept = require('..');
var Code = require('code');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

/*
    Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
*/

describe('parseAll()', function () {

    it('parses all Accept headers', function (done) {

        var headers = {};
        headers.accept = 'text/plain, application/json;q=0.5, text/html, */*;q=0.1';
        headers['accept-charset'] = 'iso-8859-5, unicode-1-1;q=0.8, *;q=0.001';
        headers['accept-encoding'] = 'compress;q=0.5, gzip;q=1.0';
        headers['accept-language'] = 'da, en;q=0.7, en-gb;q=0.8';

        var accept = Accept.parseAll(headers);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal({
            charsets: ['iso-8859-5', 'unicode-1-1', '*'],
            encodings: ['gzip', 'compress', 'identity'],
            languages: ['da', 'en-gb', 'en'],
            mediaTypes: ['text/plain', 'text/html', 'application/json', '*/*']
        });
        done();
    });
});

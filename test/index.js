// Load modules

var Code = require('code');
var Lab = require('lab');
var Accept = require('..');


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

    it('parses all Accept headers', function(done) {

        var headers = {};
        headers['Accept-Charset'] = 'iso-8859-5, unicode-1-1;q=0.8, *;q=0.001';
        headers['Accept-Encoding'] = 'compress;q=0.5, gzip;q=1.0';
        var accept = Accept.parseAll(headers);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal({
            charsets: ['iso-8859-5', 'unicode-1-1', '*'],
            encodings: ['gzip', 'compress', 'identity']
        });
        done();
    });
});

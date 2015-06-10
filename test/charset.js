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

describe('charsets()', function () {

    it('parses header', function (done) {

        var accept = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['iso-8859-5', 'unicode-1-1', '*']);
        done();
    });

    it('orders by weight(q)', function (done) {

        var accept = Accept.charsets('iso-8859-5;q=0.5, unicode-1-1;q=0.8');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['unicode-1-1', 'iso-8859-5']);
        done();
    });

    it('drops zero weighted charsets', function (done) {

        var accept = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, drop-me;q=0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['iso-8859-5', 'unicode-1-1']);
        done();
    });

    it('ignores invalid weights', function (done) {

        var accept = Accept.charsets('too-low;q=0.0001, unicode-1-1;q=0.8, too-high;q=1.1, letter-weight;q=a');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['too-low', 'too-high', 'letter-weight', 'unicode-1-1']);
        done();
    });

    it('return empty array when no header is present', function (done) {

        var accept = Accept.charsets();
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal([]);
        done();
    });

    it('return empty array when header is empty', function (done) {

        var accept = Accept.charsets('');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal([]);
        done();
    });
});

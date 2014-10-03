// Load modules

var Accept = require('..');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Lab.expect;

/*
    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

describe('encoding()', function () {

    it('parses header', function (done) {

        var accept = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(accept.isBoom).to.not.exist;
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('returns top preference on *', function (done) {

        var accept = Accept.encoding('*', ['gzip', 'deflate']);
        expect(accept.isBoom).to.not.exist;
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('returns top preference on empty', function (done) {

        var accept = Accept.encoding('', ['gzip', 'deflate']);
        expect(accept.isBoom).to.not.exist;
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('returns top preference on undefined', function (done) {

        var accept = Accept.encoding(undefined, ['gzip', 'deflate']);
        expect(accept.isBoom).to.not.exist;
        expect(accept).to.deep.equal('gzip');
        done();
    });
});


describe('encodings()', function () {

    it('parses header', function (done) {

        var accept = Accept.encodings('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(accept.isBoom).to.not.exist;
        expect(accept).to.deep.equal(['gzip', 'identity']);
        done();
    });
});

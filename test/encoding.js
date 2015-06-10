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
    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

describe('encoding()', function () {

    it('parses header', function (done) {

        var accept = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('parses header with weightings', function (done) {

        var accept = Accept.encoding('gzip;q=0.001, identity; q=0.05, *;q=0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('identity');
        done();
    });

    it('requires that preferences be an array', function (done) {

        try {
            var accept = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', 'identity, deflate');
        }
        catch (err) {
            expect(err.message).to.equal('Preferences must be an array');
            return done();
        }

        expect(true).to.equal(false); // shouldn't get here.  If we did, there's a problem.
        done();
    });

    it('parses header with preferences', function (done) {

        var accept = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gzip']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('parses header with preferences (case insensitive)', function (done) {

        var accept = Accept.encoding('GZIP;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gZip']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('parses header with preferences (x-)', function (done) {

        var accept = Accept.encoding('x-gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gzip']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('parses header with preferences (secondary match)', function (done) {

        var accept = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('identity');
        done();
    });

    it('parses header with preferences (no match)', function (done) {

        var accept = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['deflate']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.equal('');
        done();
    });

    it('returns top preference on *', function (done) {

        var accept = Accept.encoding('*', ['gzip', 'deflate']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('gzip');
        done();
    });

    it('returns top preference on * (identity)', function (done) {

        var accept = Accept.encoding('*', ['identity', 'gzip', 'deflate']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('identity');
        done();
    });

    it('returns identity on empty', function (done) {

        var accept = Accept.encoding('');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('identity');
        done();
    });

    it('returns none on empty with non identity preferences', function (done) {

        var accept = Accept.encoding('', ['gzip', 'deflate']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('');
        done();
    });

    it('returns identity on undefined without preference', function (done) {

        var accept = Accept.encoding();
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('identity');
        done();
    });

    it('excludes q=0', function (done) {

        var accept = Accept.encoding('compress;q=0.5, gzip;q=0.0', ['gzip', 'compress']);
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.equal('compress');
        done();
    });

    it('ignores improper weightings', function (done) {

        var accept = Accept.encoding('gzip;q=0.01, identity; q=0.5, deflate;q=1.1, *;q=0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal('deflate');
        done();
    });

    it('errors on invalid header', function (done) {

        var accept = Accept.encoding('a;b');
        expect(accept.isBoom).to.exist();
        done();
    });
});

describe('encodings()', function () {

    it('parses header', function (done) {

        var accept = Accept.encodings('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['gzip', 'identity']);
        done();
    });

    it('parses header (reverse header)', function (done) {

        var accept = Accept.encodings('compress;q=0.5, gzip;q=1.0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['gzip', 'compress', 'identity']);
        done();
    });

    it('parses header (exclude encoding)', function (done) {

        var accept = Accept.encodings('compress;q=0.5, gzip;q=0.0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['compress', 'identity']);
        done();
    });

    it('parses header (exclude identity)', function (done) {

        var accept = Accept.encodings('compress;q=0.5, gzip;q=1.0, identity;q=0');
        expect(accept.isBoom).to.not.exist();
        expect(accept).to.deep.equal(['gzip', 'compress']);
        done();
    });
});

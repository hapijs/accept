'use strict';

const Accept = require('..');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;

/*
    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

describe('encoding()', () => {

    it('parses header', () => {

        const encoding = Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0');
        expect(encoding).to.equal('gzip');
    });

    it('parses header with weightings', () => {

        const encoding = Accept.encoding('gzip;q=0.001, identity; q=0.05, *;q=0');
        expect(encoding).to.equal('identity');
    });

    it('requires that preferences be an array', () => {

        expect(() => {

            Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', 'identity, deflate');
        }).to.throw('Preferences must be an array');
    });

    it('parses header with preferences', () => {

        const encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gzip']);
        expect(encoding).to.equal('gzip');
    });

    it('parses header with preferences (server priority)', () => {

        expect(Accept.encoding('gzip, identity, deflate', ['deflate', 'gzip', 'identity'])).to.equal('deflate');
        expect(Accept.encoding('gzip, identity, deflate', ['gzip', 'identity'])).to.equal('gzip');
        expect(Accept.encoding('gzip, identity, deflate;q=0.9', ['deflate', 'gzip', 'identity'])).to.equal('gzip');
    });

    it('parses header with preferences (case insensitive)', () => {

        const encoding = Accept.encoding('GZIP;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gZip']);
        expect(encoding).to.equal('gZip');
    });

    it('parses header with preferences (x-)', () => {

        const encoding = Accept.encoding('x-gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gzip']);
        expect(encoding).to.equal('gzip');
    });

    it('parses header with preferences (secondary match)', () => {

        const encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate']);
        expect(encoding).to.equal('identity');
    });

    it('parses header with preferences (no match)', () => {

        const encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['deflate']);
        expect(encoding).to.equal('');
    });

    it('returns top preference on *', () => {

        const encoding = Accept.encoding('*', ['gzip', 'deflate']);
        expect(encoding).to.equal('gzip');
    });

    it('returns top preference on * (identity)', () => {

        const encoding = Accept.encoding('*', ['identity', 'gzip', 'deflate']);
        expect(encoding).to.equal('identity');
    });

    it('returns identity on empty', () => {

        const encoding = Accept.encoding('');
        expect(encoding).to.equal('identity');
    });

    it('returns none on empty with non identity preferences', () => {

        const encoding = Accept.encoding('', ['gzip', 'deflate']);
        expect(encoding).to.equal('');
    });

    it('returns identity on undefined without preference', () => {

        const encoding = Accept.encoding();
        expect(encoding).to.equal('identity');
    });

    it('excludes q=0', () => {

        const encoding = Accept.encoding('compress;q=0.5, gzip;q=0.0', ['gzip', 'compress']);
        expect(encoding).to.equal('compress');
    });

    it('ignores improper weightings', () => {

        const encoding = Accept.encoding('gzip;q=0.01, identity; q=0.5, deflate;q=1.1, *;q=0');
        expect(encoding).to.equal('deflate');
    });

    it('errors on invalid header', () => {

        expect(() => Accept.encoding('a;b')).to.throw();
        expect(() => Accept.encoding('a;b;q=1')).to.throw();
        expect(() => Accept.encoding('a;q')).to.throw();
        expect(() => Accept.encoding('a;q=')).to.throw();
        expect(() => Accept.encoding(';q=1')).to.throw();
        expect(() => Accept.encoding('gzip;a=1')).to.throw();
    });

    it('obeys disallow with wildcard', () => {

        const encoding = Accept.encoding('*, gzip;q=0, deflate;q=1.1', ['gzip', 'deflate']); // gzip is disallowed
        expect(encoding).to.equal('deflate');
    });
});

describe('encodings()', () => {

    it('parses header', () => {

        const encodings = Accept.encodings('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(encodings).to.equal(['gzip', 'identity']);
    });

    it('parses header (reverse header)', () => {

        const encodings = Accept.encodings('compress;q=0.5, gzip;q=1.0');
        expect(encodings).to.equal(['gzip', 'compress', 'identity']);
    });

    it('parses header (exclude encodings)', () => {

        const encodings = Accept.encodings('compress;q=0.5, gzip;q=0.0');
        expect(encodings).to.equal(['compress', 'identity']);
    });

    it('parses header (exclude identity)', () => {

        const encodings = Accept.encodings('compress;q=0.5, gzip;q=1.0, identity;q=0');
        expect(encodings).to.equal(['gzip', 'compress']);
    });
});

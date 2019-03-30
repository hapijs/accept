'use strict';

const Accept = require('..');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('charset()', () => {

    it('parses header', () => {

        const charset = Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(charset).to.equal('iso-8859-5');
    });

    it('respects weights', () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001');
        expect(charset).to.equal('unicode-1-1');
    });

    it('requires that preferences parameter must be an array', () => {

        expect(() => {

            Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', 'iso-8859-5');
        }).to.throw('Preferences must be an array');
    });

    it('returns empty string when there are no charsets', () => {

        const charset = Accept.charset('*;q=0');
        expect(charset).to.equal('');
    });

    it('returns first charset when preferences array is empty', () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', []);
        expect(charset).to.equal('unicode-1-1');
    });

    it('looks for top preference', () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']);
        expect(charset).to.equal('iso-8859-5');
    });

    it('find anything in preferences', () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8', ['utf-8', 'iso-8859-5']);
        expect(charset).to.equal('iso-8859-5');
    });

    it('returns empty string if no preference match is found', () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8', ['utf-8']);
        expect(charset).to.equal('');
    });

    it('accepts any charset preference with *', () => {

        const charset = Accept.charset('*;q=0.001', ['utf-8']);
        expect(charset).to.equal('utf-8');
    });

    it('ignores preference case', () => {

        expect(Accept.charset('UTF-8', ['utf-8'])).to.equal('utf-8');
        expect(Accept.charset('utf-8', ['UTF-8'])).to.equal('UTF-8');
    });

    it('obeys disallow with wildcard', () => {

        const charset = Accept.charset('*, not-this;q=0, UTF-8;q=0', ['utf-8', 'iso-8859-5']); // utf-8 is disallowed
        expect(charset).to.equal('iso-8859-5');
    });
});

describe('charsets()', () => {

    it('parses header', () => {

        const charsets = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(charsets).to.equal(['iso-8859-5', 'unicode-1-1', '*']);
    });

    it('orders by weight(q)', () => {

        const charsets = Accept.charsets('iso-8859-5;q=0.5, unicode-1-1;q=0.8');
        expect(charsets).to.equal(['unicode-1-1', 'iso-8859-5']);
    });

    it('ignores case', () => {

        const charsets = Accept.charsets('ISO-8859-5, uNIcode-1-1;q=0.8, *;q=0.001');
        expect(charsets).to.equal(['iso-8859-5', 'unicode-1-1', '*']);
    });

    it('drops zero weighted charsets', () => {

        const charsets = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, drop-me;q=0');
        expect(charsets).to.equal(['iso-8859-5', 'unicode-1-1']);
    });

    it('ignores invalid weights', () => {

        const charsets = Accept.charsets('too-low;q=0.0001, unicode-1-1;q=0.8, too-high;q=1.1, letter-weight;q=a');
        expect(charsets).to.equal(['too-low', 'too-high', 'letter-weight', 'unicode-1-1']);
    });

    it('return empty array when no header is present', () => {

        const charsets = Accept.charsets();
        expect(charsets).to.equal([]);
    });

    it('return empty array when header is empty', () => {

        const charsets = Accept.charsets('');
        expect(charsets).to.equal([]);
    });
});

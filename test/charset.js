'use strict';

// Load modules

const Accept = require('..');
const Code = require('code');
const Lab = require('lab');


// Declare internals

const internals = {};


// Test shortcuts

const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


// Charset

describe('charset()', () => {

    it('parses header', async () => {

        const charset = Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('iso-8859-5');
    });

    it('respects weights', async () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001');
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('unicode-1-1');
    });

    it('requires that preferences parameter must be an array', async () => {

        expect(() => {

            Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', 'iso-8859-5');
        }).to.throw('Preferences must be an array');
    });

    it('returns empty string when there are no charsets', async () => {

        const charset = Accept.charset('*;q=0');
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('');
    });

    it('returns first charset when preferences array is empty', async () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', []);
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('unicode-1-1');
    });

    it('looks for top preference', async () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']);
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('iso-8859-5');
    });

    it('find anything in preferences', async () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8', ['utf-8', 'iso-8859-5']);
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('iso-8859-5');
    });

    it('returns empty string if no preference match is found', async () => {

        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8', ['utf-8']);
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('');
    });

    it('accepts any charset preference with *', async () => {

        const charset = Accept.charset('*;q=0.001', ['utf-8']);
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('utf-8');
    });

    it('ignores preference case', async () => {

        const charset = Accept.charset('UTF-8', ['utf-8']);
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('UTF-8');
    });

    it('obeys disallow with wildcard', async () => {

        const charset = Accept.charset('*, not-this;q=0, UTF-8;q=0', ['utf-8', 'iso-8859-5']); // utf-8 is disallowed
        expect(charset.isBoom).to.not.exist();
        expect(charset).to.equal('iso-8859-5');
    });
});


// Charsets
describe('charsets()', () => {

    it('parses header', async () => {

        const charsets = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal(['iso-8859-5', 'unicode-1-1', '*']);
    });

    it('orders by weight(q)', async () => {

        const charsets = Accept.charsets('iso-8859-5;q=0.5, unicode-1-1;q=0.8');
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal(['unicode-1-1', 'iso-8859-5']);
    });

    it('ignores case', async () => {

        const charsets = Accept.charsets('ISO-8859-5, uNIcode-1-1;q=0.8, *;q=0.001');
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal(['iso-8859-5', 'unicode-1-1', '*']);
    });

    it('drops zero weighted charsets', async () => {

        const charsets = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, drop-me;q=0');
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal(['iso-8859-5', 'unicode-1-1']);
    });

    it('ignores invalid weights', async () => {

        const charsets = Accept.charsets('too-low;q=0.0001, unicode-1-1;q=0.8, too-high;q=1.1, letter-weight;q=a');
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal(['too-low', 'too-high', 'letter-weight', 'unicode-1-1']);
    });

    it('return empty array when no header is present', async () => {

        const charsets = Accept.charsets();
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal([]);
    });

    it('return empty array when header is empty', async () => {

        const charsets = Accept.charsets('');
        expect(charsets.isBoom).to.not.exist();
        expect(charsets).to.equal([]);
    });
});

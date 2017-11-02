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


// Mediatypes

describe('mediaTypes()', () => {

    it('returns */* when header is missing', () => {

        const mediaTypes = Accept.mediaTypes();
        expect(mediaTypes).to.equal(['*/*']);
    });

    it('parses header', () => {

        const mediaTypes = Accept.mediaTypes('text/plain, application/json;q=0.5, text/html, */*;q=0.1');
        expect(mediaTypes).to.equal(['text/plain', 'text/html', 'application/json', '*/*']);
    });

    it('returns empty array when everything is disallowed', () => {

        const mediaTypes = Accept.mediaTypes('*/*;q=0');
        expect(mediaTypes).to.equal([]);
    });

    it('respects disallows', () => {

        const mediaTypes = Accept.mediaTypes('text/plain, application/json;q=0.5, text/html, text/drop;q=0');
        expect(mediaTypes).to.equal(['text/plain', 'text/html', 'application/json']);
    });

    it('orders by weight', () => {

        const mediaTypes = Accept.mediaTypes('application/json;q=0.2, text/html');
        expect(mediaTypes).to.equal(['text/html', 'application/json']);
    });

    it('orders most specific to least specific', () => {

        const mediaTypes = Accept.mediaTypes('text/*, text/plain, text/plain;format=flowed, */*');
        expect(mediaTypes).to.equal(['text/plain;format=flowed', 'text/plain', 'text/*', '*/*']);
    });

    it('keeps wildcard behind more specific', () => {

        const mediaTypes = Accept.mediaTypes('text/html, text/*');
        expect(mediaTypes).to.equal(['text/html', 'text/*']);
    });

    it('keeps the order of two media types with extensions', () => {

        const mediaTypes = Accept.mediaTypes('text/html;level=1, text/html;level=2');
        expect(mediaTypes).to.equal(['text/html;level=1', 'text/html;level=2']);
    });

    it('invalid header returns */*', () => {

        const mediaTypes = Accept.mediaTypes('ab');
        expect(mediaTypes).to.equal([]);
    });

    it('invalid weight is ignored', () => {

        const mediaTypes = Accept.mediaTypes('text/html;q=0.0001, text/plain, text/csv;q=1.1');
        expect(mediaTypes).to.equal(['text/html', 'text/plain', 'text/csv']);
    });
});

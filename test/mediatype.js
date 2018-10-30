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

describe('mediaType()', () => {

    it('parses the header', () => {

        const mediaType = Accept.mediaType('text/html, text/plain, application/json');
        expect(mediaType).to.equal('text/html');
    });

    it('respects weights', () => {

        const mediaType = Accept.mediaType('application/json;q=0.6, text/plain;q=0.8');
        expect(mediaType).to.equal('text/plain');
    });

    it('requires the preferences parameter to be an array', () => {

        expect(() => {

            Accept.mediaType('application/json;q=0.6, text/plain;q=0.8', 'text/plain');
        }).to.throw('Preferences must be an array');
    });

    it('returns */* with header is empty', () => {

        const mediaType = Accept.mediaType('');
        expect(mediaType).to.equal('*/*');
    });

    it('returns */* if header is missing', () => {

        const mediaType = Accept.mediaType();
        expect(mediaType).to.equal('*/*');
    });

    it('ignores an empty preferences array', () => {

        const mediaType = Accept.mediaType('text/plain, text/html, application/json', []);
        expect(mediaType).to.equal('text/plain');
    });

    it('returns empty string if none of the preferences match', () => {

        const mediaType = Accept.mediaType('text/csv, application/json, text/plain', ['text/html']);
        expect(mediaType).to.equal('');
    });

    it('returns first preference if header has *', () => {

        const mediaType = Accept.mediaType('text/html, application/json, text/plain, *', ['text/csv']);
        expect(mediaType).to.equal('text/csv');
    });

    it('returns first found preference that header includes', () => {

        const mediaType = Accept.mediaType('text/html, application/json, text/plain', ['text/csv', 'application/json']);
        expect(mediaType).to.equal('application/json');
    });

    it('returns preference with highest specificity', () => {

        const mediaType = Accept.mediaType('text/*, text/html, application/json', ['text/plain', 'text/html']);
        expect(mediaType).to.equal('text/plain');
    });

    it('return media type with highest weight', () => {

        const mediaType = Accept.mediaType('text/html;q=0.5, text/plain;q=1', ['text/html', 'text/plain']);
        expect(mediaType).to.equal('text/plain');
    });

});

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

        const mediaTypes = Accept.mediaTypes('text/*, text/plain;format=flowed, text/plain, text/plain;level=1, text/html, text/plain;level=2, */*, image/*, text/rich');
        expect(mediaTypes).to.equal([
            'text/plain;format=flowed',
            'text/plain;level=1',
            'text/plain;level=2',
            'text/plain',
            'text/html',
            'text/*',
            '*/*',
            'image/*',
            'text/rich'
        ]);
    });

    it('keeps wildcard behind more specific', () => {

        const mediaTypes = Accept.mediaTypes('text/html, text/*');
        expect(mediaTypes).to.equal(['text/html', 'text/*']);
    });

    it('keeps the order of two media types with extensions', () => {

        const mediaTypes = Accept.mediaTypes('text/html;level=1, text/html;level=2');
        expect(mediaTypes).to.equal(['text/html;level=1', 'text/html;level=2']);
    });

    it('invalid header returns []', () => {

        const mediaTypes = Accept.mediaTypes('ab');
        expect(mediaTypes).to.equal([]);
    });

    it('invalid weight is ignored', () => {

        const mediaTypes = Accept.mediaTypes('text/html;q=0.0001, text/plain, text/csv;q=1.1');
        expect(mediaTypes).to.equal(['text/html', 'text/plain', 'text/csv']);
    });
});

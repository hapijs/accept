'use strict';

const Accept = require('..');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('language()', () => {

    it('parses the header', () => {

        const language = Accept.language('da, en-GB, en');
        expect(language).to.equal('da');
    });

    it('respects weights', () => {

        const language = Accept.language('en;q=0.6, en-GB;q=0.8');
        expect(language).to.equal('en-gb');
    });

    it('requires the preferences parameter to be an array', () => {

        expect(() => {

            Accept.language('en;q=0.6, en-GB;q=0.8', 'en');
        }).to.throw('Preferences must be an array');
    });

    it('returns empty string with header is empty', () => {

        const language = Accept.language('');
        expect(language).to.equal('');
    });

    it('returns empty string if header is missing', () => {

        const language = Accept.language();
        expect(language).to.equal('');
    });

    it('ignores an empty preferences array', () => {

        const language = Accept.language('da, en-GB, en', []);
        expect(language).to.equal('da');
    });

    it('returns empty string if none of the preferences match', () => {

        const language = Accept.language('da, en-GB, en', ['es']);
        expect(language).to.equal('');
    });

    it('returns first preference if header has * and is unmatched', () => {

        const language = Accept.language('da, en-GB, *', ['en-US']);
        expect(language).to.equal('en-US');
    });

    it('returns first found preference that header includes', () => {

        const language = Accept.language('da, en-GB, en', ['en-US', 'en-GB']);
        expect(language).to.equal('en-US');
    });

    it('returns preference with highest order when equal weigths', () => {

        expect(Accept.language('da, en, en-GB', ['en', 'en-GB'])).to.equal('en');
        expect(Accept.language('da, en, en-GB', ['en-GB', 'en'])).to.equal('en-GB');
        expect(Accept.language('en, en-GB, en-US')).to.equal('en');
    });

    it('return language with heighest weight', () => {

        const language = Accept.language('da;q=0.5, en;q=1', ['da', 'en']);
        expect(language).to.equal('en');
    });

    it('ignores preference case when matching', () => {

        const language = Accept.language('da, en-GB, en-us', ['en-gb', 'en-us']); // en-GB vs en-gb
        expect(language).to.equal('en-gb');
    });

    it('returns language using range match', () => {

        expect(Accept.language('da', ['da-DK'])).to.equal('da-DK');
        expect(Accept.language('en-US, en', ['en-GB', 'en-US'])).to.equal('en-GB');
        expect(Accept.language('da, en', ['da-DK', 'en-GB'])).to.equal('da-DK');
        expect(Accept.language('en, da', ['da-DK', 'en-GB'])).to.equal('da-DK');
        expect(Accept.language('en, da', ['en', 'en-GB'])).to.equal('en');
        expect(Accept.language('da, en-GB', ['da-DK', 'en-GB'])).to.equal('da-DK');
        expect(Accept.language('en, en-GB', ['en-US', 'en-GB', 'da-DK'])).to.equal('en-US');
    });

    it('explicit preference overrides range match', () => {

        expect(Accept.language('da, en-GB', ['da-DK', 'en-GB', 'da'])).to.equal('en-GB');
    });
});


describe('languages()', () => {

    it('parses the header', () => {

        const languages = Accept.languages('da, en-GB, en');
        expect(languages).to.equal(['da', 'en-gb', 'en']);
    });

    it('orders by weight(q)', () => {

        const languages = Accept.languages('da, en;q=0.7, en-GB;q=0.8');
        expect(languages).to.equal(['da', 'en-gb', 'en']);
    });

    it('maintains case', () => {

        const languages = Accept.languages('da, en-GB, en');
        expect(languages).to.equal(['da', 'en-gb', 'en']);
    });

    it('drops zero weighted charsets', () => {

        const languages = Accept.languages('da, en-GB, es;q=0, en');
        expect(languages).to.equal(['da', 'en-gb', 'en']);
    });

    it('ignores invalid weights', () => {

        const languages = Accept.languages('da, en-GB;q=1.1, es;q=a, en;q=0.0001');
        expect(languages).to.equal(['da', 'en-gb', 'es', 'en']);
    });

    it('return empty array when no header is present', () => {

        const languages = Accept.languages();
        expect(languages).to.equal([]);
    });

    it('return empty array when header is empty', () => {

        const languages = Accept.languages('');
        expect(languages).to.equal([]);
    });
});

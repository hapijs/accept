// Load modules

var Accept = require('..');
var Code = require('code');
var Lab = require('lab');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;


// language
describe('language()', function () {

    it('parses the header', function (done) {

        var language = Accept.language('da, en-GB, en');
        expect(language).to.equal('da');
        done();
    });

    it('respects weights', function (done) {

        var language = Accept.language('en;q=0.6, en-GB;q=0.8');
        expect(language).to.equal('en-GB');
        done();
    });

    it('requires the preferences parameter to be an array', function (done) {

        expect(function () {

            Accept.language('en;q=0.6, en-GB;q=0.8', 'en');
        }).to.throw('Preferences must be an array');
        done();
    });

    it('returns empty string with header is empty', function (done) {

        var language = Accept.language('');
        expect(language).to.equal('');
        done();
    });

    it('returns empty string if header is missing', function (done) {

        var language = Accept.language();
        expect(language).to.equal('');
        done();
    });

    it('ignores an empty preferences array', function (done) {

        var language = Accept.language('da, en-GB, en', []);
        expect(language).to.equal('da');
        done();
    });

    it('returns empty string if none of the preferences match', function (done) {

        var language = Accept.language('da, en-GB, en', ['es']);
        expect(language).to.equal('');
        done();
    });

    it('returns first preference if header has *', function (done) {

        var language = Accept.language('da, en-GB, en, *', ['en-US']);
        expect(language).to.equal('en-US');
        done();
    });

    it('returns first found preference that header includes', function (done) {

        var language = Accept.language('da, en-GB, en', ['en-US', 'en-GB']);
        expect(language).to.equal('en-GB');
        done();
    });

    it('returns preference with highest specificity', function (done) {

        var language = Accept.language('da, en-GB, en', ['en', 'en-GB']);
        expect(language).to.equal('en-GB');
        done();
    });

    it('return language with heighest weight', function (done) {

        var language = Accept.language('da;q=0.5, en;q=1', ['da', 'en']);
        expect(language).to.equal('en');
        done();
    });

    it('ignores preference case when matching', function (done) {

        var language = Accept.language('da, en-GB, en', ['en-us', 'en-gb']); // en-GB vs en-gb
        expect(language).to.equal('en-GB');
        done();
    });
});


// languages
describe('languages()', function () {

    it('parses the header', function (done) {

        var languages = Accept.languages('da, en-GB, en');
        expect(languages).to.deep.equal(['da', 'en-GB', 'en']);
        done();
    });

    it('orders by weight(q)', function (done) {

        var languages = Accept.languages('da, en;q=0.7, en-GB;q=0.8');
        expect(languages).to.deep.equal(['da', 'en-GB', 'en']);
        done();
    });

    it('maintains case', function (done) {

        var languages = Accept.languages('da, en-GB, en');
        expect(languages).to.deep.equal(['da', 'en-GB', 'en']);
        done();
    });

    it('drops zero weighted charsets', function (done) {

        var languages = Accept.languages('da, en-GB, es;q=0, en');
        expect(languages).to.deep.equal(['da', 'en-GB', 'en']);
        done();
    });

    it('ignores invalid weights', function (done) {

        var languages = Accept.languages('da, en-GB;q=1.1, es;q=a, en;q=0.0001');
        expect(languages).to.deep.equal(['da', 'en-GB', 'es', 'en']);
        done();
    });

    it('return empty array when no header is present', function (done) {

        var languages = Accept.languages();
        expect(languages).to.deep.equal([]);
        done();
    });

    it('return empty array when header is empty', function (done) {


        var languages = Accept.languages('');
        expect(languages).to.deep.equal([]);
        done();
    });
});

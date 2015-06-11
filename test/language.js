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


// languages
describe('language()', function() {

    it('parses the header', function(done) {

        var language = Accept.language('da, en-gb, en');
        expect(language).to.equal('da');
        done();
    });

    it('respects weights', function(done) {

        var language = Accept.language('en;q=0.6, en-gb;q=0.8');
        expect(language).to.equal('en-gb');
        done();
    });

    it('requires the preferences parameter to be an array', function(done) {

        try {
            var language = Accept.language('en;q=0.6, en-gb;q=0.8', 'en');
        }
        catch (err) {
            expect(err).to.exist();
            return done();
        }

        // should never get here.
        expect(true).to.equal(false);
        done();
    });

    it('returns empty string with header is empty', function(done) {

        var language = Accept.language('');
        expect(language).to.equal('');
        done();
    });

    it('returns empty string if header is missing', function(done) {

        var language = Accept.language();
        expect(language).to.equal('');
        done();
    });

    it('ignores an empty preferences array', function(done) {

        var language = Accept.language('da, en-gb, en', []);
        expect(language).to.equal('da');
        done();
    });

    it('returns empty string if none of the preferences match', function(done) {

        var language = Accept.language('da, en-gb, en', ['es']);
        expect(language).to.equal('');
        done();
    });

    it('returns first preference if header has *', function(done) {

        var language = Accept.language('da, en-gb, en, *', ['en-us']);
        expect(language).to.equal('en-us');
        done();
    });

    it('returns first found preference that header includes', function(done) {

        var language = Accept.language('da, en-gb, en', ['en-us', 'en-gb']);
        expect(language).to.equal('en-gb');
        done();
    });

    it('returns preference with highest weighting', function(done) {

        var language = Accept.language('da, en-gb, en', ['en', 'en-gb']);
        expect(language).to.equal('en-gb');
        done();
    });
});


// languages
describe('languages()', function() {

    it('parses the header', function(done) {

        var languages = Accept.languages('da, en-gb, en');
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('orders by weight(q)', function (done) {

        var languages = Accept.languages('da, en;q=0.7, en-gb;q=0.8');
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('ignores case', function (done) {

        var languages = Accept.languages('da, en-GB, EN');
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('drops zero weighted charsets', function (done) {

        var languages = Accept.languages('da, en-gb, es;q=0, en');
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('ignores invalid weights', function (done) {

        var languages = Accept.languages('da, en-gb;q=1.1, es;q=a, en;q=0.0001');
        expect(languages).to.deep.equal(['da', 'en-gb', 'es', 'en']);
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

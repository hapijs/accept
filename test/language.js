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
describe('languages()', function() {

    it('parses the header', function(done) {

        var languages = Accept.languages('da, en-gb, en');
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('orders by weight(q)', function (done) {

        var languages = Accept.languages('da, en;q=0.7, en-gb;q=0.8');
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('ignores case', function (done) {

        var languages = Accept.languages('da, en-GB, EN');
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('drops zero weighted charsets', function (done) {

        var languages = Accept.languages('da, en-gb, es;q=0, en');
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal(['da', 'en-gb', 'en']);
        done();
    });

    it('ignores invalid weights', function (done) {

        var languages = Accept.languages('da, en-gb;q=1.1, es;q=a, en;q=0.0001');
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal(['da', 'en-gb', 'es', 'en']);
        done();
    });

    it('return empty array when no header is present', function (done) {

        var languages = Accept.languages();
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal([]);
        done();
    });

    it('return empty array when header is empty', function (done) {


        var languages = Accept.languages('');
        expect(languages.isBoom).to.not.exist();
        expect(languages).to.deep.equal([]);
        done();
    });
});

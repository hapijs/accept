import { describe, expectTypeOf, it } from 'vitest';

import * as Accept from '../src/index.js';

// Negative cases assert through `toBeCallableWith`, which is erased at runtime — a bare
// `// @ts-expect-error`-ed call would still execute and throw, since vitest loads this file
// under both `include` and `typecheck.include`.

describe('typings', () => {
    describe('charset()', () => {
        it('accepts an optional header and optional preferences', () => {
            expectTypeOf(Accept.charset).toBeCallableWith();
            expectTypeOf(Accept.charset).toBeCallableWith('');
            expectTypeOf(Accept.charset).toBeCallableWith('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']);
        });

        it('returns a string', () => {
            expectTypeOf(Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001')).toEqualTypeOf<string>();
            expectTypeOf(
                Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']),
            ).toEqualTypeOf<string>();
        });

        it('rejects a non-string header and non-array preferences', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.charset).toBeCallableWith(123);
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.charset).toBeCallableWith('', '');
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.charset).toBeCallableWith('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001', 'iso-8859-5');
        });
    });

    describe('charsets()', () => {
        it('accepts an optional header', () => {
            expectTypeOf(Accept.charsets).toBeCallableWith();
            expectTypeOf(Accept.charsets).toBeCallableWith('');
        });

        it('returns a string array', () => {
            expectTypeOf(Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001')).toEqualTypeOf<string[]>();
        });

        it('rejects a non-string header and any second argument', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.charsets).toBeCallableWith(123);
            // @ts-expect-error charsets() takes no preferences
            expectTypeOf(Accept.charsets).toBeCallableWith('', '');
            // @ts-expect-error charsets() takes no preferences
            expectTypeOf(Accept.charsets).toBeCallableWith('', ['']);
        });
    });

    describe('encoding()', () => {
        it('accepts an optional header and optional preferences', () => {
            expectTypeOf(Accept.encoding).toBeCallableWith();
            expectTypeOf(Accept.encoding).toBeCallableWith('');
            expectTypeOf(Accept.encoding).toBeCallableWith('gzip;q=1.0, identity; Q=0.5, *;q=0', ['gzip']);
        });

        it('returns a string', () => {
            expectTypeOf(Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0')).toEqualTypeOf<string>();
            expectTypeOf(Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0', ['gzip'])).toEqualTypeOf<string>();
        });

        it('rejects a non-string header and non-array preferences', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.encoding).toBeCallableWith(123);
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.encoding).toBeCallableWith('', '');
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.encoding).toBeCallableWith('gzip;q=1.0, identity; Q=0.5, *;q=0', 'gzip');
        });
    });

    describe('encodings()', () => {
        it('accepts an optional header', () => {
            expectTypeOf(Accept.encodings).toBeCallableWith();
            expectTypeOf(Accept.encodings).toBeCallableWith('');
        });

        it('returns a string array', () => {
            expectTypeOf(Accept.encodings('gzip;q=1.0, identity; Q=0.5, *;q=0')).toEqualTypeOf<string[]>();
        });

        it('rejects a non-string header and any second argument', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.encodings).toBeCallableWith(123);
            // @ts-expect-error encodings() takes no preferences
            expectTypeOf(Accept.encodings).toBeCallableWith('', '');
            // @ts-expect-error encodings() takes no preferences
            expectTypeOf(Accept.encodings).toBeCallableWith('', ['']);
        });
    });

    describe('language()', () => {
        it('accepts an optional header and optional preferences', () => {
            expectTypeOf(Accept.language).toBeCallableWith();
            expectTypeOf(Accept.language).toBeCallableWith('');
            expectTypeOf(Accept.language).toBeCallableWith('en;q=0.6, en-GB;q=0.8', ['en']);
        });

        it('returns a string', () => {
            expectTypeOf(Accept.language('en;q=0.6, en-GB;q=0.8')).toEqualTypeOf<string>();
            expectTypeOf(Accept.language('en;q=0.6, en-GB;q=0.8', ['en'])).toEqualTypeOf<string>();
        });

        it('rejects a non-string header and non-array preferences', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.language).toBeCallableWith(123);
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.language).toBeCallableWith('', '');
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.language).toBeCallableWith('en;q=0.6, en-GB;q=0.8', 'en');
        });
    });

    describe('languages()', () => {
        it('accepts an optional header', () => {
            expectTypeOf(Accept.languages).toBeCallableWith();
            expectTypeOf(Accept.languages).toBeCallableWith('');
        });

        it('returns a string array', () => {
            expectTypeOf(Accept.languages('en;q=0.6, en-GB;q=0.8')).toEqualTypeOf<string[]>();
        });

        it('rejects a non-string header and any second argument', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.languages).toBeCallableWith(123);
            // @ts-expect-error languages() takes no preferences
            expectTypeOf(Accept.languages).toBeCallableWith('', '');
            // @ts-expect-error languages() takes no preferences
            expectTypeOf(Accept.languages).toBeCallableWith('', ['']);
        });
    });

    describe('mediaType()', () => {
        it('accepts an optional header and optional preferences', () => {
            expectTypeOf(Accept.mediaType).toBeCallableWith();
            expectTypeOf(Accept.mediaType).toBeCallableWith('');
            expectTypeOf(Accept.mediaType).toBeCallableWith('application/json;q=0.6, text/plain;q=0.8', ['test/plain']);
        });

        it('returns a string', () => {
            expectTypeOf(Accept.mediaType('application/json;q=0.6, text/plain;q=0.8')).toEqualTypeOf<string>();
            expectTypeOf(
                Accept.mediaType('application/json;q=0.6, text/plain;q=0.8', ['test/plain']),
            ).toEqualTypeOf<string>();
        });

        it('rejects a non-string header and non-array preferences', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.mediaType).toBeCallableWith(123);
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.mediaType).toBeCallableWith('', '');
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.mediaType).toBeCallableWith('application/json;q=0.6, text/plain;q=0.8', 'test/plain');
        });
    });

    describe('mediaTypes()', () => {
        it('accepts an optional header and optional preferences', () => {
            expectTypeOf(Accept.mediaTypes).toBeCallableWith();
            expectTypeOf(Accept.mediaTypes).toBeCallableWith('');
            expectTypeOf(Accept.mediaTypes).toBeCallableWith('', ['text/plain']);
        });

        it('returns a string array', () => {
            expectTypeOf(Accept.mediaTypes('application/json;q=0.6, text/plain;q=0.8')).toEqualTypeOf<string[]>();
        });

        it('rejects a non-string header and non-array preferences', () => {
            // @ts-expect-error number is not assignable to string
            expectTypeOf(Accept.mediaTypes).toBeCallableWith(123);
            // @ts-expect-error string is not assignable to readonly string[]
            expectTypeOf(Accept.mediaTypes).toBeCallableWith('', '');
        });
    });

    describe('parseAll()', () => {
        it('accepts a headers object', () => {
            expectTypeOf(Accept.parseAll).toBeCallableWith({});
            expectTypeOf(Accept.parseAll).toBeCallableWith({ accept: '' });
        });

        it('returns a result of string arrays', () => {
            const headers = {
                accept: 'application/json;q=0.6, text/plain;q=0.8',
                'accept-charset': 'iso-8859-5, unicode-1-1;q=0.8, *;q=0.001',
                'accept-encoding': 'gzip;q=1.0, identity; Q=0.5, *;q=0',
                'accept-language': 'en;q=0.6, en-GB;q=0.8',
                ignore: {},
            };

            const all = Accept.parseAll(headers);

            expectTypeOf(all).toEqualTypeOf<Accept.parseAll.Result>();
            expectTypeOf(all.charsets).toEqualTypeOf<string[]>();
            expectTypeOf(all.encodings).toEqualTypeOf<string[]>();
            expectTypeOf(all.languages).toEqualTypeOf<string[]>();
            expectTypeOf(all.mediaTypes).toEqualTypeOf<string[]>();
        });

        it('requires headers with string-typed accept values', () => {
            // @ts-expect-error headers is required
            expectTypeOf(Accept.parseAll).toBeCallableWith();
            // @ts-expect-error object is not assignable to string
            expectTypeOf(Accept.parseAll).toBeCallableWith({ accept: {} });
        });
    });
});

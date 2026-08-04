import { describe, expect, it } from 'vitest';

import * as Accept from '../src/index.js';

describe('charset()', () => {
    it('parses header', () => {
        const charset = Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(charset).toBe('iso-8859-5');
    });

    it('respects weights', () => {
        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001');
        expect(charset).toBe('unicode-1-1');
    });

    it('requires that preferences parameter must be an array', () => {
        expect(() => {
            Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', 'iso-8859-5');
        }).toThrow('Preferences must be an array');
    });

    it('returns empty string when there are no charsets', () => {
        const charset = Accept.charset('*;q=0');
        expect(charset).toBe('');
    });

    it('returns first charset when preferences array is empty', () => {
        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', []);
        expect(charset).toBe('unicode-1-1');
    });

    it('looks for top preference', () => {
        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']);
        expect(charset).toBe('iso-8859-5');
    });

    it('find anything in preferences', () => {
        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8', ['utf-8', 'iso-8859-5']);
        expect(charset).toBe('iso-8859-5');
    });

    it('returns empty string if no preference match is found', () => {
        const charset = Accept.charset('iso-8859-5; q=0.1, unicode-1-1;q=0.8', ['utf-8']);
        expect(charset).toBe('');
    });

    it('accepts any charset preference with *', () => {
        const charset = Accept.charset('*;q=0.001', ['utf-8']);
        expect(charset).toBe('utf-8');
    });

    it('ignores preference case', () => {
        expect(Accept.charset('UTF-8', ['utf-8'])).toBe('utf-8');
        expect(Accept.charset('utf-8', ['UTF-8'])).toBe('UTF-8');
    });

    it('obeys disallow with wildcard', () => {
        const charset = Accept.charset('*, not-this;q=0, UTF-8;q=0', ['utf-8', 'iso-8859-5']); // utf-8 is disallowed
        expect(charset).toBe('iso-8859-5');
    });
});

describe('charsets()', () => {
    it('parses header', () => {
        const charsets = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
        expect(charsets).toEqual(['iso-8859-5', 'unicode-1-1', '*']);
    });

    it('orders by weight(q)', () => {
        const charsets = Accept.charsets('iso-8859-5;q=0.5, unicode-1-1;q=0.8');
        expect(charsets).toEqual(['unicode-1-1', 'iso-8859-5']);
    });

    it('ignores case', () => {
        const charsets = Accept.charsets('ISO-8859-5, uNIcode-1-1;q=0.8, *;q=0.001');
        expect(charsets).toEqual(['iso-8859-5', 'unicode-1-1', '*']);
    });

    it('drops zero weighted charsets', () => {
        const charsets = Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, drop-me;q=0');
        expect(charsets).toEqual(['iso-8859-5', 'unicode-1-1']);
    });

    it('ignores invalid weights', () => {
        const charsets = Accept.charsets('too-low;q=0.0001, unicode-1-1;q=0.8, too-high;q=1.1, letter-weight;q=a');
        expect(charsets).toEqual(['too-low', 'too-high', 'letter-weight', 'unicode-1-1']);
    });

    it('return empty array when no header is present', () => {
        const charsets = Accept.charsets();
        expect(charsets).toEqual([]);
    });

    it('return empty array when header is empty', () => {
        const charsets = Accept.charsets('');
        expect(charsets).toEqual([]);
    });
});

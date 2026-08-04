import * as Header from './header.js';
import * as Media from './media.js';

const options = {
    charset: {
        type: 'accept-charset',
    },
    encoding: {
        type: 'accept-encoding',
        default: 'identity',
        equivalents: new Map([
            ['x-compress', 'compress'],
            ['x-gzip', 'gzip'],
        ]),
    },
    language: {
        type: 'accept-language',
        prefixMatch: true,
    },
};

export const charset = (header, preferences) => Header.selection(header, preferences, options.charset);

export const charsets = (header, preferences) => Header.selections(header, preferences, options.charset);

export const encoding = (header, preferences) => Header.selection(header, preferences, options.encoding);

export const encodings = (header, preferences) => Header.selections(header, preferences, options.encoding);

export const language = (header, preferences) => Header.selection(header, preferences, options.language);

export const languages = (header, preferences) => Header.selections(header, preferences, options.language);

export const mediaType = (header, preferences) => Media.selection(header, preferences);

export const mediaTypes = (header, preferences) => Media.selections(header, preferences);

export const parseAll = function (requestHeaders) {
    return {
        charsets: charsets(requestHeaders['accept-charset']),
        encodings: encodings(requestHeaders['accept-encoding']),
        languages: languages(requestHeaders['accept-language']),
        mediaTypes: mediaTypes(requestHeaders.accept),
    };
};

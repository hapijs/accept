import * as Accept from '..';
import * as Lab from '@hapi/lab';


const { expect } = Lab.types;


// charset()

Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']);
Accept.charset('');
Accept.charset();

expect.type<string>(Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001'));
expect.type<string>(Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001', ['iso-8859-5']));

expect.error(Accept.charset(123));
expect.error(Accept.charset('', ''));
expect.error(Accept.charset('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001', 'iso-8859-5'));


// charsets()

Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001');
Accept.charsets('');
Accept.charsets();

expect.type<string[]>(Accept.charsets('iso-8859-5, unicode-1-1;q=0.8, *;q=0.001'));

expect.error(Accept.charsets(123));
expect.error(Accept.charsets('', ''));
expect.error(Accept.charsets('', ['']));


// encoding()

Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0');
Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0', ['gzip']);
Accept.encoding('');
Accept.encoding();

expect.type<string>(Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0'));
expect.type<string>(Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0', ['gzip']));

expect.error(Accept.encoding(123));
expect.error(Accept.encoding('', ''));
expect.error(Accept.encoding('gzip;q=1.0, identity; Q=0.5, *;q=0', 'gzip'));


// encodings()

Accept.encodings('gzip;q=1.0, identity; Q=0.5, *;q=0');
Accept.encodings('');
Accept.encodings();

expect.type<string[]>(Accept.encodings('gzip;q=1.0, identity; Q=0.5, *;q=0'));

expect.error(Accept.encodings(123));
expect.error(Accept.encodings('', ''));
expect.error(Accept.encodings('', ['']));


// language()

Accept.language('en;q=0.6, en-GB;q=0.8');
Accept.language('en;q=0.6, en-GB;q=0.8', ['en']);
Accept.language('');
Accept.language();

expect.type<string>(Accept.language('en;q=0.6, en-GB;q=0.8'));
expect.type<string>(Accept.language('en;q=0.6, en-GB;q=0.8', ['en']));

expect.error(Accept.language(123));
expect.error(Accept.language('', ''));
expect.error(Accept.language('en;q=0.6, en-GB;q=0.8', 'en'));


// languages()

Accept.languages('en;q=0.6, en-GB;q=0.8');
Accept.languages('');
Accept.languages();

expect.type<string[]>(Accept.languages('en;q=0.6, en-GB;q=0.8'));

expect.error(Accept.languages(123));
expect.error(Accept.languages('', ''));
expect.error(Accept.languages('', ['']));


// mediaType()

Accept.mediaType('application/json;q=0.6, text/plain;q=0.8');
Accept.mediaType('application/json;q=0.6, text/plain;q=0.8', ['test/plain']);
Accept.mediaType('');
Accept.mediaType();

expect.type<string>(Accept.mediaType('application/json;q=0.6, text/plain;q=0.8'));
expect.type<string>(Accept.mediaType('application/json;q=0.6, text/plain;q=0.8', ['test/plain']));

expect.error(Accept.mediaType(123));
expect.error(Accept.mediaType('', ''));
expect.error(Accept.mediaType('application/json;q=0.6, text/plain;q=0.8', 'test/plain'));


// mediaTypes()

Accept.mediaTypes('application/json;q=0.6, text/plain;q=0.8');
Accept.mediaTypes('');
Accept.mediaTypes();

expect.type<string[]>(Accept.mediaTypes('application/json;q=0.6, text/plain;q=0.8'));

expect.error(Accept.mediaTypes(123));
expect.error(Accept.mediaTypes('', ''));
expect.error(Accept.mediaTypes('', ['']));


// parseAll()

Accept.parseAll({});
Accept.parseAll({ accept: '' });

const headers = {
    accept: 'application/json;q=0.6, text/plain;q=0.8',
    'accept-charset': 'iso-8859-5, unicode-1-1;q=0.8, *;q=0.001',
    'accept-encoding': 'gzip;q=1.0, identity; Q=0.5, *;q=0',
    'accept-language': 'en;q=0.6, en-GB;q=0.8',
    ignore: {}
};

const all = Accept.parseAll(headers);

expect.type<Accept.parseAll.Result>(all);
expect.type<string[]>(all.charsets);
expect.type<string[]>(all.encodings);
expect.type<string[]>(all.languages);
expect.type<string[]>(all.mediaTypes);

expect.error(Accept.parseAll());
expect.error(Accept.parseAll({ accept: {} }));

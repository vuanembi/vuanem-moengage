import { getUserAttributesStreams } from './user-attribute.service';

it('getUserAttributes', (done) => {
    const [extract, parse] = getUserAttributesStreams();
    extract.pipe(parse);
    parse.on('data', (data) => {
        expect(data).toBeDefined();
    });
    parse.on('error', (error) => {
        console.error(error);
        done(error);
    });
    parse.on('finish', () => done());
}, 100_000_000);

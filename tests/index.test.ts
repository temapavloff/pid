import * as assert from 'node:assert';
import test from 'node:test';
import { fetchDepartures, parseDepartues } from '../src/index';

test('should say hello to the world', () => {
    assert.equal('hello world', 'hello world');
});

test('should request data from PID API', async () => {
    const json = await fetchDepartures((process.env['STOPS'] ?? '').split(','));

    console.log(parseDepartues(json).join('\n'));

    assert.equal(typeof json, 'object');
});
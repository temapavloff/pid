import * as assert from 'node:assert';
import test from 'node:test';
import { fetchDepartures, getStopIds, parseDepartues } from '../src/index';
import { stopsList } from '../src/stops_list';

test('should say hello to the world', () => {
    assert.equal('hello world', 'hello world');
});

test('should request data from PID API', async () => {
    const json = await fetchDepartures(getStopIds(stopsList));

    console.log(parseDepartues(json).join('\n'));

    assert.equal(typeof json, 'object');
});
import * as assert from 'node:assert';
import test from 'node:test';
import { fetchDepartures, parseDepartues } from '../src/index';
import { fetchWeather, parseWeatherResponse } from '../src/weather';

test('should say hello to the world', () => {
    assert.equal('hello world', 'hello world');
});

test('should request data from PID API', async () => {
    const json = await fetchDepartures((process.env['STOPS'] ?? '').split(','));

    console.log(parseDepartues(json).join('\n'));

    assert.equal(typeof json, 'object');
});

test('should fetch weather data', async () => {
    const [lat, long] = (process.env['COORDINATES'] ?? ',').split(',');

    const json = await fetchWeather(lat, long);

    console.log(JSON.stringify(parseWeatherResponse(json), undefined, 2));

    assert.equal(typeof json, 'object');
});

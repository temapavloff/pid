import { createServer, IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { fetchDepartures, parseDepartuesToJson } from './index';
import { handleStaticFile } from './handlers/static';
import { fetchWeather, parseWeatherResponse } from './weather';
const port = process.env['SERVER_PORT'] ?? 8080;

const writeJson = (res: ServerResponse<IncomingMessage>, json: unknown) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const stream = Readable.from([JSON.stringify(json)]);
    stream.pipe(res);
}

const handleDepartues: RequestListener = async (_, res) => {
    const departues = await fetchDepartures((process.env['STOPS'] ?? '').split(',').map(s => s.trim()));
    writeJson(res, parseDepartuesToJson(departues));
};

const handleWeather: RequestListener = async (_, res) => {
    const [lat, lng] = (process.env['COORDINATES'] ?? ',').split(',');
    const weather = await fetchWeather(lat, lng);
    writeJson(res, parseWeatherResponse(weather));
}

const handler: RequestListener = (req, res) => {
    if (req.url?.startsWith('/api/departures')) {
        handleDepartues(req, res);
        return;
    }

    if (req.url?.startsWith('/api/weather')) {
        handleWeather(req, res);
        return;
    }

    handleStaticFile(req, res);
};

console.warn(`Starting server at http://127.0.0.1:${port}`);

createServer(handler).listen(port);

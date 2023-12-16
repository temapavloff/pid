import { createServer, RequestListener } from 'node:http';
import { handleStaticFile, prepareFile } from '../handlers/static';
import { handleDepartues } from '../handlers/pid';
import { handleWeather } from '../handlers/weather';

const handler: RequestListener = async (req, res) => {
    try {
        if (req.url?.startsWith('/api/departures')) {
            await handleDepartues(req, res);
            return;
        }

        if (req.url?.startsWith('/api/weather')) {
            await handleWeather(req, res);
            return;
        }

        await handleStaticFile(req, res);
    } catch (e) {
        const file = await prepareFile('/500.html');
        res.writeHead(500, { 'Content-Type': 'text/html' });
        file.stream.pipe(res);
        console.error(e);
    }
};

export const serv = (port: number | string) => {
    console.warn(`Starting server at http://127.0.0.1:${port}`);
    createServer(handler).listen(port);
};

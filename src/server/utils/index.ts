import { ServerResponse, IncomingMessage } from 'http';
import { Readable } from 'stream';


export const writeJson = (res: ServerResponse<IncomingMessage>, json: unknown) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const stream = Readable.from([JSON.stringify(json)]);
    stream.pipe(res);
};

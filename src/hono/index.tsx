import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { renderToReadableStream } from 'hono/jsx/streaming'
import { Index } from '../views/index'
import { Weather } from '../views/components/weather'
import { Transport } from '../views/components/transport'
import { getDepartures } from '../services/pid/index';
import { getWeather } from '../services/weather/index';
import { ApiContext } from '../contexts/api';

const apiContextValue = { getDepartures, getWeather };

const stopIds = (process.env['STOPS'] ?? '').split(',').map(s => s.trim());
const [latitude, longitude] = (process.env['COORDINATES'] ?? ',').split(',');

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => {
    const stream = renderToReadableStream(
        <ApiContext.Provider value={apiContextValue}>
            <Index />
        </ApiContext.Provider>
    )
    return c.body(stream, {
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'Transfer-Encoding': 'chunked',
        },
    })
});

app.get('/weather', c => c.html(
    <ApiContext.Provider value={apiContextValue}>
        <Weather latitude={latitude} longitude={longitude} />
    </ApiContext.Provider>
));

app.get('/transport', c => c.html(
    <ApiContext.Provider value={apiContextValue}>
        <Transport stopIds={stopIds} />
    </ApiContext.Provider>
));

const port = Number(process.env['SERVER_POST'] ?? '8080');

console.log(`Starting server at http://127.0.0.1:${port}`)

serve({
    fetch: app.fetch,
    port,
});

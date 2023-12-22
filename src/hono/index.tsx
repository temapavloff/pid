import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { renderToReadableStream } from 'hono/jsx/streaming'
import { Index } from '../views/index'
import { Weather } from '../views/components/weather'
import { Transport } from '../views/components/transport'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('/', (c) => {
    const stream = renderToReadableStream(<Index />)
    return c.body(stream, {
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'Transfer-Encoding': 'chunked',
        },
    })
})

app.get('/weather', c => c.html(<Weather />))
app.get('/transport', c => c.html(<Transport />))

const port = Number(process.env['SERVER_POST'] ?? '8080');

console.log(`Starting server at http://127.0.0.1:${port}`);

serve({
    fetch: app.fetch,
    port,
});
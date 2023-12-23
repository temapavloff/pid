import { FC, ErrorBoundary } from 'hono/jsx'
import { Suspense } from 'hono/jsx/streaming'
import { Layout } from './layout'
import { Weather } from './components/weather';
import { Transport } from './components/transport';

const stopIds = (process.env['STOPS'] ?? '').split(',').map(s => s.trim());

const [latitude, longitude] = (process.env['COORDINATES'] ?? ',').split(',');

const Fallback = () => <h2>Ooops!</h2>;

const Loading = () => <h2>Loading...</h2>

export const Index: FC = () => (
    <Layout>
        <main>
            <section id="weather">
                <ErrorBoundary fallback={<Fallback />}>
                    <Suspense fallback={<Loading />}>
                        <Weather latitude={latitude} longitude={longitude} />
                    </Suspense>
                </ErrorBoundary>
            </section>
            <section id="transport">
                <ErrorBoundary fallback={<Fallback />}>
                    <Suspense fallback={<Loading />}>
                        <Transport stopIds={stopIds} />
                    </Suspense>
                </ErrorBoundary>
            </section>
        </main>
        <script src="/static/script.js"></script>
    </Layout>
);

import { FC, ErrorBoundary } from 'hono/jsx'
import { Suspense } from 'hono/jsx/streaming'
import { Layout } from './layout'
import { Weather } from './components/weather';
import { Transport } from './components/transport';

const Fallback = () => <h2>Ooops!</h2>;

export const Index: FC = () => (
    <Layout>
        <main>
            <section id="weather">
                <ErrorBoundary fallback={<Fallback />}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Weather />
                    </Suspense>
                </ErrorBoundary>
            </section>
            <section id="transport">
                <ErrorBoundary fallback={<Fallback />}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Transport />
                    </Suspense>
                </ErrorBoundary>
            </section>
        </main>
        <script src="/static/script.js"></script>
    </Layout>
);

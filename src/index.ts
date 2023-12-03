import { serv } from './server/index';

serv(process.env['PORT'] ?? 8080);

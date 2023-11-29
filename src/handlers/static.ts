import path from 'node:path';
import fs from 'node:fs';
import { RequestListener } from 'node:http';

const MIME_TYPES: Record<string, string> = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./static");

const toBool = [() => true, () => false];

const prepareFile = async (url: string) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith("/")) paths.push("index.html");
    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const found = !pathTraversal && exists;
    const streamPath = found ? filePath : STATIC_PATH + "/404.html";
    const ext = path.extname(streamPath).substring(1).toLowerCase();
    const stream = fs.createReadStream(streamPath);
    return { found, ext, stream };
};

export const handleStaticFile: RequestListener = async (req, res) => {
    const file = await prepareFile(req.url ?? '');
    const statusCode = file.found ? 200 : 404;
    const mimeType = MIME_TYPES[file.ext] ?? MIME_TYPES.default;
    res.writeHead(statusCode, { "Content-Type": mimeType });
    file.stream.pipe(res);
    console.log(`${req.method} ${req.url} ${statusCode}`);
}

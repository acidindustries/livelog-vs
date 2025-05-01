import * as http from 'http';
import { LivelogViewProvider } from './viewprovider';

export class Backend {
    private _server: http.Server;

    constructor(private readonly viewProvider: LivelogViewProvider) {
        this._server = http.createServer((req, res) => {
            if (req.method !== 'POST' || req.url !== '/ingest') {
                res.writeHead(404);
                res.end('Not found');
            }

            let body = '';
            req.on('data', chunk => (body += chunk));

            req.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    viewProvider.postJsonToWebView(json, false);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'OK' }));
                }
                catch (e) {
                    res.writeHead(400);
                    res.end('Bad request');
                }
            });
        });

        this._server.listen(8000, '0.0.0.0', () => {
            console.log('Listening on port 8000...');
        });
    }

    destroy() {
        this._server.close();
    }
}
import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { renderApplication } from '@angular/platform-server';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server'; // use the bootstrap function from main.server.ts

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function app(): express.Express {
  const server = express();

  const browserDistFolder = resolve(__dirname, '../browser');

  // Serve static files
  server.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));

  // SSR all other routes
  server.get('**', (req, res, next) => {
    renderApplication(bootstrap, {
      document: '<app-root></app-root>',
      url: req.originalUrl,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    })
      .then((html: string) => res.send(html))
      .catch((err: any) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

import { Application, Request, Response, json } from 'express';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

import { WebSocketServer, WebSocket } from 'ws';

const currentPath = resolve(__dirname, '../../../dist/packages/storybook/device/currentStory.ts');

export const middleware = () => {
  return (app: Application) => {
    const wsServer = new WebSocketServer({
      port: 8080,
    });

    let preview: WebSocket;
    const devices: WebSocket[] = [];
    wsServer.on('connection', (ws, req) => {
      if (req.url === '/preview') {
        preview = ws;
        console.log('preview connection');
        ws.on('message', (message, isBinary) => {
          console.log('preview message', isBinary ? message : message.toString('utf8'));
          devices.forEach((device) => {
            device.send(message, {
              binary: isBinary,
            });
          });
        });
      } else if (req.url === '/device') {
        console.log('device connection');
        devices.push(ws);
        ws.on('message', (message, isBinary) => {
          console.log('device message', isBinary ? message : message.toString('utf8'));
          preview?.send(message, {
            binary: isBinary,
          });
        });
      } else {
        ws.close();
        return;
      }
      ws.on('close', () => {
        if (ws === preview) {
          preview = null;
        } else {
          const index = devices.indexOf(ws);
          if (index > -1) {
            devices.splice(index, 1);
          }
        }
      });
      console.log(req.url);
      // const url = new URL(ws.url);
      // console.log(url.pathname);
    });

    app.use(json());
    app.post('/nativescript/changeStory', (req: Request, res: Response) => {
      const data = req.body;
      try {
        writeFileSync(currentPath, `export const currentStory = ${JSON.stringify(data, null, 2)}`);
        res.json({ ok: true, data });
      } catch (err) {
        console.error(err);
        res.status(400).json({
          ok: false,
          message: err.toString(),
        });
      }
    });
  };
};

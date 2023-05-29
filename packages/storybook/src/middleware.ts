import { Application, Request, Response, json } from 'express';

import { WebSocketServer, WebSocket } from 'ws';
import { StoryChangeEvent } from './types';

export const middleware = () => {
  return (app: Application) => {
    const wsServer = new WebSocketServer({
      port: 8080,
    });

    let preview: WebSocket;
    let lastStoryChangeEvent: StoryChangeEvent;
    const devices: WebSocket[] = [];
    wsServer.on('connection', (ws, req) => {
      if (req.url === '/preview') {
        preview = ws;
        console.log('preview connection');
        ws.on('message', (message, isBinary) => {
          console.log('preview message', isBinary ? message : message.toString('utf8'));
          if (!isBinary) {
            try {
              const data = JSON.parse(message.toString('utf8'));
              if (data.kind === 'storyChange') {
                lastStoryChangeEvent = data;
              }
            } catch (e) {
              console.error(e);
            }
          }
          devices.forEach((device) => {
            device.send(message, {
              binary: isBinary,
            });
          });
        });
      } else if (req.url === '/device') {
        console.log('device connection');
        devices.push(ws);
        if (lastStoryChangeEvent) {
          ws.send(JSON.stringify(lastStoryChangeEvent));
        }
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
  };
};
